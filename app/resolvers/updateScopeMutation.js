const { error } = require('lib-core')
const { isEmpty } = require('lodash')
const joi = require('@hapi/joi')
const { UniqueConstraintError } = require('sequelize')

const schema = joi.object().keys({
  id: joi.string().guid().required(),
  name: joi.string(),
  resources: joi.array().items(joi.object().keys({
    type: joi.string().truncate().valid([ 'DeviceGroup', 'UserGroup' ]).required(),
    id: joi.string().guid().required()
  }))
}).unknown(true)

module.exports = async (args, { user, db }, ast) => {
  if (!user.permissions.includes('scope_update_any') && !user.permissions.includes('scope_update_own')) {
    return error.AccessDeniedError()
  }

  const validation = joi.validate(args, schema)

  if (!isEmpty(validation.error)) {
    return error(validation.error)
  }

  const scope = await db.Scope.findOne({ where: { id: args.id } })

  if (isEmpty(scope)) {
    return error.NotFoundError()
  }

  try {
    scope.set(args)
    await scope.save()
  } catch (e) {
    if (e.name.includes(UniqueConstraintError.name)) {
      return error('Scope with such name already exists!', 400)
    }

    return error(e, 400)
  }

  return scope
}
