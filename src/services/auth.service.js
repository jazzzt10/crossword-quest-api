// The rules of accounts. No req, no res, no queries here.
const userRepository = require('../repositories/user.repository');
const password = require('../security/password');
const token = require('../security/token');
const { unauthorized } = require('../errors/app-error');

// Rule: everyone who registers is a PLAYER. A host or admin is made by an admin.
async function register(data) {
  const passwordHash = await password.hash(data.password);
  return userRepository.create({
    school_id: data.school_id,
    full_name: data.full_name,
    email: data.email,
    password_hash: passwordHash,
    role: 'PLAYER',
  });
}

// Rule: a wrong password and an unknown school ID look exactly the same,
// so the login cannot be used to find out which accounts exist.
async function login(schoolId, plainPassword) {
  const user = await userRepository.findForLogin(schoolId);
  const ok = await password.matches(plainPassword, user ? user.password_hash : null);
  if (!ok) throw unauthorized('School ID or password is wrong.', 'INVALID_CREDENTIALS');

  const signed = token.issue(user);
  const { iat, exp } = token.verify(signed);
  return { user, token: signed, expiresIn: exp - iat };
}

module.exports = { register, login };