const { Op } = require('sequelize')
const graphqlFields = require('graphql-fields')
const { has } = require('lodash')
const { error } = require('lib-core')

module.exports = async (args, { token, user, db, logger }, ast) => {
  if (user.isAnonymous) {
    return error.AccessDeniedError()
  }

  const requestedFields = graphqlFields(ast)
  const userFound = await db.User.findOne({
    where: {
      id: user.id
    },
    include: [
      {
        model: db.Role,
        as: 'UserRole'
      }
    ]
  })

  if (has(requestedFields, 'scopesLink')) {
    const scopes = await db.Scope.findAll({
      where: {
        id: {
          [ Op.in ]: user.scopes
        }
      }
    })

    userFound.scopesLink = scopes.map(scope => scope.get())
  }

  userFound.role = userFound.UserRole.get()

  logger.info(`Fetched user profile for ${userFound.id}`)

  return userFound
}
