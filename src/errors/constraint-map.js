// A database rule was broken -> what the client should hear.
// The key is the constraint name from the migration.
module.exports = {
  question_sets_name_key: {
    status: 409,
    code: 'QUESTION_SET_NAME_TAKEN',
    message: 'A question set with that name already exists.',
  },
  game_sessions_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set was used in a game and cannot be deleted.',
  },
  uq_one_seat: {
    status: 409,
    code: 'ALREADY_SEATED',
    message: 'This account already has a seat in this game.',
  },
  unique_session_nickname: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },
  unique_session_color: {
    status: 409,
    code: 'COLOR_TAKEN',
    message: 'That color is already used in this game.',
  },
};