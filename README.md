# Crossword Quest API

Backend API for Crossword Quest, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Justine B. Belo (jazzzt10), BSCS 3-1
- Group and game concept: Group 6

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone https://github.com/jazzzt10/crossword-quest-api
cd crossword-quest-api
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

Until login is built, a caller says who they are with the `X-Demo-User` header (a school ID from the demo accounts below). The "Who may call" column shows the role each route needs.

| Method | Path | Purpose | Who may call | Success |
|---|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | Anyone | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | Anyone | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | The Library Game Hub | 200 (401 without the key, 400 for a bad `since`) |
| GET | /question-sets | List my question sets (an admin sees all) | HOST, ADMIN | 200 |
| POST | /question-sets | Create a question set; the caller becomes the owner | HOST, ADMIN | 201 |
| GET | /question-sets/:id | Read one question set | Owner, ADMIN | 200 |
| PATCH | /question-sets/:id | Rename a question set | Owner, ADMIN | 200 |
| DELETE | /question-sets/:id | Delete a question set that no game has used | Owner, ADMIN | 204 (409 if a game used it) |
| POST | /sessions | Start a game from a question set; the server makes the six-digit code | HOST, ADMIN | 201 |
| GET | /sessions/:code | Read a game and its player count | Anyone | 200 |
| PATCH | /sessions/:code | Move a game WAITING, then PLAYING, then FINISHED | The game's host, ADMIN | 200 |
| POST | /sessions/:code/players | Join with a nickname; joining again returns the same seat | Any logged-in account | 201 first time, 200 rejoin |
| GET | /sessions/:code/players | List the players (nickname, color, score) | Anyone | 200 |

Every error answers with the same shape: `{ "error": { "code": "...", "message": "..." } }`.

| Status | Codes |
|---|---|
| 400 | VALIDATION_FAILED, INVALID_JSON, INVALID_SINCE |
| 401 | AUTH_REQUIRED, HUB_KEY_REQUIRED |
| 403 | FORBIDDEN |
| 404 | NOT_FOUND, QUESTION_SET_NOT_FOUND, SESSION_NOT_FOUND |
| 409 | QUESTION_SET_NAME_TAKEN, QUESTION_SET_IN_USE, NICKNAME_TAKEN, NOT_ENOUGH_PLAYERS, SESSION_NOT_JOINABLE, SESSION_ENDED, SESSION_FULL, INVALID_STATUS_CHANGE |

## Demo accounts

All demo data is fictitious. School IDs start with 2099 and emails end in `.test`.

| School ID | Role | Name |
|---|---|---|
| 2099-0001 | HOST | Maria Host Santos |
| 2099-0003 | HOST | Ben Castro |
| 2099-0002 | ADMIN | Admin Demo |
| 2099-1001 | PLAYER | Rina Dela Cruz |
| 2099-1002 | PLAYER | Dale Reyes |
| 2099-1003 | PLAYER | Pao Garcia |
| 2099-1004 | PLAYER | Bea Lopez (never joins a game, on purpose) |

## What "completed" means in my game

A player completed a game if they solved at least one word in it (at least one row for that player in `solved_words`). Crossword Quest is a free-for-all, so no player solves every clue.

## Game statuses

A game moves only forward: `WAITING` (players may join), `PLAYING` (the game runs), `FINISHED` (the game is over and appears in `/results`). A game needs at least 2 players before it can start, and has at most 6.

## Tables

In the order of the migrations:

1. `users`: every account, with a role (PLAYER, HOST or ADMIN).
2. `question_sets`: a named set of clues, owned by a host (`host_id`).
3. `clues`: one crossword clue and its answer, in a question set.
4. `crossword_grids`: the grid of one game.
5. `game_sessions`: one game, with its join code, status and timestamps.
6. `players`: one account's seat in one game, with nickname, color, token and score.
7. `device_info`: the device a player used.
8. `solved_words`: which player solved which clue in which game, and the points awarded.

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |

## Testing with Postman

The collection is in `postman/crossword-quest-week11.postman_collection.json`: 62 requests, in two folders (question sets, and sessions and players).

```
npm run db:reset
npm start
npx newman run postman/crossword-quest-week11.postman_collection.json
```

All 62 requests and 120 assertions pass.