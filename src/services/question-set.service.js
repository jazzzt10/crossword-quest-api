// The rules: who may do what. No req, no res, no queries here.
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden } = require('../errors/app-error');

async function findOrFail(id) {
  const questionSet = await questionSetRepository.findById(id);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${id}.`);
  }
  return questionSet;
}

// Number(): PostgreSQL BIGINT can arrive as text, so compare as numbers.
function isOwner(questionSet, user) {
  return Number(questionSet.host_id) === Number(user.user_id) || user.role === 'ADMIN';
}

async function findOwned(id, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user)) {
    throw forbidden('This question set belongs to another host.');
  }
  return questionSet;
}

// An admin sees every set. A host sees their own.
function list(user) {
  return user.role === 'ADMIN'
    ? questionSetRepository.findAll()
    : questionSetRepository.findAllByHost(user.user_id);
}

function get(id, user) {
  return findOwned(id, user);
}

// Rule: the owner is the caller. A client never chooses it.
function create(data, user) {
  return questionSetRepository.create({ ...data, host_id: user.user_id });
}

async function update(id, changes, user) {
  const questionSet = await findOwned(id, user);
  return questionSetRepository.update(questionSet, changes);
}

async function remove(id, user) {
  const questionSet = await findOwned(id, user);
  await questionSetRepository.remove(questionSet);
}

module.exports = { list, get, create, update, remove };