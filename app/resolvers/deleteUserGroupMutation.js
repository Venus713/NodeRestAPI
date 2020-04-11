const { error } = require('lib-core')
const _ = require('lodash')
const { Op } = require('sequelize')

module.exports = async (args, { token, user, db }, ast) => {
  if (!user.permissions.includes('user_group_delete')) {
    return error.AccessDeniedError()
  }

  const userGroup = await db.UserGroup.findOne({
    where: {
      id: args.id
    }
  })

  if (_.isEmpty(userGroup)) {
    return error.NotFoundError()
  }

  const usersCount = await db.User.count({
    where: {
      userGroups: {
        [Op.contains]: userGroup.id
      }
    }
  })

  if (usersCount > 0) {
    return error('Please remove assigned users first', 400)
  }

  await userGroup.destroy()

  return 'ok'
}
