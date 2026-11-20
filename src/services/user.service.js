// The rules of managing accounts. Only an admin reaches these.
const userRepository = require('../repositories/user.repository');
const { notFound, conflict } = require('../errors/app-error');

function list() {
  return userRepository.findAll();
}

async function changeRole(id, role, admin) {
  const user = await userRepository.findById(id);
  if (!user) throw notFound('USER_NOT_FOUND', `No account has the id ${id}.`);

  // Rule: an admin cannot change their own role, so the system never loses its last admin.
  if (Number(user.user_id) === Number(admin.user_id)) {
    throw conflict('CANNOT_CHANGE_OWN_ROLE', 'You cannot change your own role.');
  }
  return userRepository.update(user, { role });
}

module.exports = { list, changeRole };