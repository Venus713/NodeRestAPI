const { error } = require('lib-core')
const _ = require('lodash')

module.exports = async (args, { token, user, db }, ast) => {
  if (!user.permissions.includes('role_delete')) {
    return error.AccessDeniedError()
  }

  const role = await db.Role.findOne({
    where: {
      id: args.id
    }
  })

  if (_.isEmpty(role)) {
    return error.NotFoundError()
  }

  const usersCount = await db.User.count({
    where: {
      role: role.id
    }
  })

  if (usersCount > 0) {
    return error('Please remove assigned users first', 400)
  }

  await role.destroy()

  return 'ok'
}
