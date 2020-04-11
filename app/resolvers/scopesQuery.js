const { error } = require('lib-core')
const { Op } = require('sequelize')
const { isEmpty, map } = require('lodash')

module.exports = async (args, { user, db }, ast) => {
  if (!user.permissions.includes('scope_list_any') && !user.permissions.includes('scope_list_own')) {
    return error.AccessDeniedError()
  }

  const { limit, offset, id, name } = args
  const and = []
  const where = {}
  const order = map(args.sort, (row) => [ row.field, row.type ])

  if (!user.permissions.includes('scope_list_any')) {
    and.push({ createdBy: user.id })
  }

  if (!isEmpty(id)) {
    and.push({
      id: {
        [ Op.in ]: id
      }
    })
  }

  if (!isEmpty(name)) {
    where.name = {
      [ Op.iLike ]: `%${name}%`
    }
  }

  if (!isEmpty(and)) {
    where[ Op.and ] = and
  }

  const [ count, scopes ] = await Promise.all([
    db.Scope.count({
      where
    }),
    db.Scope.findAll({
      where,
      limit,
      offset,
      order
    })
  ])

  return {
    count,
    data: scopes
  }
}
