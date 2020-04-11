const { error } = require('lib-core')
const _ = require('lodash')
const { Op } = require('sequelize')
const graphqlFields = require('graphql-fields')

module.exports = async (args, { user, db }, ast) => {
  if (!user.permissions.includes('user_group_list')) {
    return error.AccessDeniedError()
  }

  const {
    id,
    limit,
    offset,
    type,
    name
  } = args

  const requestFields = graphqlFields(ast)
  const query = {}
  const order = _.map(args.sort, (row) => [ row.field, row.type ])

  if (!_.isEmpty(id)) {
    query.id = {
      [ Op.in ]: id
    }
  }

  if (!_.isEmpty(name)) {
    query.name = {
      [ Op.iLike ]: `%${name}%`
    }
  }

  if (!_.isEmpty(args.class)) {
    query.class = args.class
  }

  if (!_.isEmpty(type)) {
    query.type = type
  }

  const [ count, data ] = await Promise.all([
    db.UserGroup.count({
      where: query
    }),
    db.UserGroup.findAll({
      where: query,
      limit,
      offset,
      order
    })
  ])
  let result = data

  if (
    requestFields.hasOwnProperty('data') &&
    requestFields.data.hasOwnProperty('usersCount')
  ) {
    result = result.map(userGroup => ({
      ...userGroup.get(),
      usersCount: db.User.count({
        where: {
          userGroups: {
            [ Op.contains ]: userGroup.id
          }
        }
      })
    }))
  }

  return {
    count: count,
    data: result
  }
}
