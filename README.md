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
| Passwords and login | bcryptjs and jsonwebtoken |

## Setup

```
git clone https://github.com/jazzzt10/crossword-quest-api
cd crossword-quest-api
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD` and a long random text in `JWT_SECRET`.

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
| JWT_SECRET | (64 random characters) | Secret that signs login tokens. Never commit this. |
| JWT_EXPIRES_IN | 1h | How long a login token lives |
| CORS_ORIGINS | http://localhost:5173 | Browser pages that may read the API's answers, separated by commas |

## Accounts and login

Every account has a role: `PLAYER`, `HOST` or `ADMIN`. A person who registers is always a `PLAYER`; only an admin can promote an account.

1. `POST /auth/login` with a school ID and password answers a token.
2. Send that token in every later request: `Authorization: Bearer <token>`.
3. A token lives for one hour. After that, log in again.

Passwords are 8 to 72 characters with at least one letter and one number. Only a bcrypt hash is stored, and it is never sent back. A wrong password and an unknown school ID get the same `401 INVALID_CREDENTIALS`, so the login cannot be used to find out which accounts exist.

## Endpoints (Hub Contract v1.3)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Who may call | Success |
|---|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | Anyone | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | Anyone | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | The Library Game Hub | 200 (401 without the key, 400 for a bad `since`) |
| POST | /auth/register | Create an account; the role is always PLAYER | Anyone | 201 |
| POST | /auth/login | Exchange a school ID and password for a token | Anyone | 200 |
| GET | /auth/me | The account of the token | Any logged-in account | 200 |
| GET | /users | List every account | ADMIN | 200 |
| PATCH | /users/:id/role | Change the role of an account (not your own) | ADMIN | 200 (409 for your own account) |
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
| 401 | AUTH_REQUIRED, INVALID_TOKEN, INVALID_CREDENTIALS, HUB_KEY_REQUIRED |
| 403 | FORBIDDEN |
| 404 | NOT_FOUND, USER_NOT_FOUND, QUESTION_SET_NOT_FOUND, SESSION_NOT_FOUND |
| 409 | SCHOOL_ID_TAKEN, EMAIL_TAKEN, CANNOT_CHANGE_OWN_ROLE, QUESTION_SET_NAME_TAKEN, QUESTION_SET_IN_USE, NICKNAME_TAKEN, NOT_ENOUGH_PLAYERS, SESSION_NOT_JOINABLE, SESSION_ENDED, SESSION_FULL, INVALID_STATUS_CHANGE |

## Demo accounts

All demo data is fictitious. School IDs start with 2099 and emails end in `.test`. Every demo account has the same password: `Crossword-Demo-2026`. It only exists in the seed data on a development computer.

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

1. `users`: every account, with a role (PLAYER, HOST or ADMIN) and a bcrypt password hash.
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

The collection is in `postman/crossword-quest-week11.postman_collection.json`: 90 requests in four folders (log in, accounts, question sets, and sessions and players). The first folder logs in the demo accounts and saves their tokens, so run the whole collection from the top.

```
npm run db:reset
npm start
npx newman run postman/crossword-quest-week11.postman_collection.json
```

All 90 requests and 187 assertions pass.