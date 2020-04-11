const { error } = require('lib-core')
const { UniqueConstraintError, Op } = require('sequelize')
const _ = require('lodash')
const graphqlFields = require('graphql-fields')

module.exports = async (args, { token, user, db }, ast) => {
  if (!user.permissions.includes('user_group_update')) {
    return error.AccessDeniedError()
  }

  const requestFields = graphqlFields(ast)
  let userGroup = await db.UserGroup.findOne({
    where: {
      id: args.id
    }
  })

  if (_.isEmpty(userGroup)) {
    return error.NotFoundError()
  }

  try {
    userGroup.set(args)
    userGroup = await userGroup.save()
  } catch (e) {
    if (e.name.includes(UniqueConstraintError.name)) {
      return error('User group with such name already exists!', 400)
    }
    return error(e, 400)
  }

  if (requestFields.hasOwnProperty('usersCount')) {
    return {
      ...userGroup.get(),
      usersCount: db.User.count({
        where: {
          userGroups: {
            [Op.contains]: userGroup.id
          }
        }
      })
    }
  }

  return userGroup
}
