const { error } = require('lib-core')
const { Op, fn, col } = require('sequelize')
const { isEmpty, map } = require('lodash')
const graphqlFields = require('graphql-fields')

module.exports = async (args, { user, db }, ast) => {
  if (!user.permissions.includes('role_list')) {
    return error.AccessDeniedError()
  }

  const { limit, offset, id, name } = args
  const where = {}
  const order = map(args.sort, (row) => [ row.field, row.type ])
  const requestFields = graphqlFields(ast)

  if (isEmpty(id) === false) {
    where.id = {
      [ Op.in ]: id
    }
  }

  if (!isEmpty(name)) {
    where.name = {
      [ Op.iLike ]: `%${name}%`
    }
  }

  const dbPromises = [
    db.Role.count({
      where
    }),
    db.Role.findAll({
      where,
      limit,
      offset,
      order
    })
  ]

  if (requestFields.data.hasOwnProperty('usersCount')) {
    dbPromises.pop()
    dbPromises.push(
      db.Role.findAll({
        where,
        attributes: [ 'id', 'name', 'description', 'permissions', 'createdAt', 'updatedAt', [ fn('count', col('users.id')), 'usersCount' ] ],
        include: [
          {
            model: db.User,
            attributes: [],
            as: 'users'
          }
        ],
        group: [ 'role.id' ],
        offset,
        limit,
        order,
        subQuery: false
      })
    )
  }

  const [ count, rolesList ] = await Promise.all(dbPromises)
  let roles = rolesList.map(role => Object.assign({}, role.get()))

  if (requestFields.data.hasOwnProperty('usersCount')) {
    roles = rolesList.map((role) => Object.assign({}, role.get(), { usersCount: +role.get().usersCount }))
  }

  return {
    count,
    data: roles
  }
}
