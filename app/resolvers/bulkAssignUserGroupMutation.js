const { error } = require('lib-core')
const joi = require('@hapi/joi')
const { isEmpty, flatten } = require('lodash')
const { Op } = require('sequelize')
const schema = joi.object().keys({
  id: joi.array().min(1).items(joi.string().required()).required(),
  groupId: joi.string().required()
}).unknown(false)

module.exports = async (args, { db, user }, ast) => {
  if (
    user.isAnonymous ||
    !user.permissions.includes('user_update_any')
  ) {
    return error.AccessDeniedError()
  }

  const validation = joi.validate(args, schema)

  if (!isEmpty(validation.error)) {
    return error(validation.error)
  }

  const where = {
    id: { [ Op.in ]: args.id }
  }

  if (!user.isOwner) {
    const whereScope = {
      id: { [ Op.in ]: user.scopes }
    }
    const scopes = await db.Scope.findAll({ where: whereScope })
    const resources = flatten(scopes.map(
      scope => scope.resources.filter(resource => resource.type === 'UserGroup')
    ))
    where.userGroups = {
      [ Op.contains ]: resources.map(resource => resource.id)
    }
  }

  const users = await db.User.findAll({ where })
  const promises = []

  for (const user of users) {
    if (!user.userGroups.includes(args.groupId)) {
      user.userGroups = [...user.userGroups, args.groupId]
      promises.push(user.save())
    }
  }

  try {
    await Promise.all(promises)
  } catch (e) {
    return error.BadRequestError()
  }

  return 'OK'
}
