const { error } = require('lib-core')
const { Op } = require('sequelize')

module.exports = async (args, { token, user, db }, ast) => {
  if (!user.permissions.includes('scope_update_any') && !user.permissions.includes('scope_update_own')) {
    return error.AccessDeniedError()
  }

  const { id } = args
  const usersCount = await db.User.count({
    where: {
      scopes: {
        [ Op.contains ]: id
      }
    }
  })

  if (usersCount > 0) {
    return error('Scopes are assigned to users', 400)
  }

  await db.Scope.destroy({
    where: {
      id: {
        [ Op.in ]: id
      }
    }
  })

  return 'OK'
}
