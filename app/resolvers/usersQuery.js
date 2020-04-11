const { error } = require('lib-core')
const { Op } = require('sequelize')
const _ = require('lodash')
const path = require('path')
const userHelper = require(path.resolve('app', 'helpers', 'user'))

module.exports = async (args, { user, db }) => {
  const {
    id,
    limit,
    offset,
    group,
    firstName,
    role
  } = args
  const or = []
  let and = []
  const query = {}
  const order = _.map(args.sort, (row) => [ row.field, row.type ])
  let ids = id

  if (!user.permissions.includes('user_list')) {
    return error.AccessDeniedError()
  }

  if (!user.isOwner && _.isEmpty(user.scopes)) {
    return {
      count: 0,
      data: []
    }
  }

  if (!_.isEmpty(firstName)) {
    or.push({
      firstName: {
        [ Op.iLike ]: `%${firstName}%`
      }
    })
  }

  if (_.has(args, 'group') && group) {
    or.push({
      userGroups: { [ Op.contains ]: group }
    })
  }

  if (!_.isEmpty(role)) {
    or.push({ role })
  }

  if (!_.isEmpty(ids)) {
    or.push({
      id: { [ Op.in ]: ids }
    })
  }

  if (!user.isOwner) {
    const resources = await userHelper.getAssignedResources(user, 'UserGroup')

    and.push({
      [Op.or]: userHelper.getIndividualUserGroupOrQuery(resources)
    })
  }

  if (!_.isEmpty(or)) {
    query[ Op.or ] = or
  }

  if (!_.isEmpty(and)) {
    query[ Op.and ] = and
  }

  const [ users, count ] = await Promise.all(
    [
      db.User.findAll({
        where: query,
        include: [
          {
            model: db.Role,
            as: 'UserRole'
          }
        ],
        offset,
        limit,
        order
      }),
      db.User.count({
        where: query
      })
    ]
  )

  const result = users.map(user => ({
    ...user.get(),
    role: user.UserRole,
    tags: (typeof user.tags === 'string')
      ? JSON.parse(user.tags)
      : Array.from(user.tags)
  }))

  return {
    count: count,
    data: result
  }
}
