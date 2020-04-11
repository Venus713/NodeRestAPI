const { error } = require('lib-core')
const _ = require('lodash')
const { Op } = require('sequelize')

module.exports = async (args, { user, db }, ast) => {
  if (user.isAnonymous) {
    return error.AccessDeniedError()
  }

  const { resources } = args
  const scopes = await db.Scope.findAll({
    where: {
      [ Op.or ]: resources.map((resource) => ({
        resources: {
          [ Op.contains ]: [resource]
        }
      }))
    }
  })

  const users = await db.User.findAll({
    where: {
      [ Op.or ]: scopes.map((scope) => ({
        scopes: {
          [ Op.contains ]: scope.id
        }
      }))
    },
    include: [
      {
        model: db.Role,
        as: 'UserRole'
      }
    ]
  })

  return {
    data: _.uniqBy(users, 'emailAddress').map((user) => ({
      ...user.get(),
      role: user.UserRole
    }))
  }
}
