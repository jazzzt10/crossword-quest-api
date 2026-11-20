// Only these fields leave the API. The password hash is never one of them.
function toUserJson(user) {
  return {
    id: Number(user.user_id),
    school_id: user.school_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}

module.exports = { toUserJson };