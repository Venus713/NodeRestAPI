const { error } = require('lib-core')
const { UniqueConstraintError } = require('sequelize')

module.exports = async (args, { token, user, db }, ast) => {
  if (!user.permissions.includes('user_group_create')) {
    return error.AccessDeniedError()
  }

  const userGroup = new db.UserGroup(args)
  try {
    await userGroup.save()
  } catch (e) {
    if (e.name.includes(UniqueConstraintError.name)) {
      return error('User group with such name already exists!', 400)
    }
    return error(e, 400)
  }

  return {
    ...userGroup.get(),
    usersCount: 0
  }
}
