const { error } = require('lib-core')
const joi = require('@hapi/joi')
const { isEmpty } = require('lodash')
const { UniqueConstraintError } = require('sequelize')

const schema = joi.object().keys({
  name: joi.string().required(),
  resources: joi.array().items(joi.object().keys({
    type: joi.string().truncate().valid([ 'DeviceGroup', 'UserGroup' ]).required(),
    id: joi.string().guid().required()
  }))
}).unknown(true)

module.exports = async (args, { token, user, db }, ast) => {
  if (!user.permissions.includes('scope_create')) {
    return error.AccessDeniedError()
  }

  const validation = joi.validate(args, schema)

  if (!isEmpty(validation.error)) {
    return error(validation.error)
  }

  const scope = new db.Scope(Object.assign({}, args, { createdBy: user.id }))

  try {
    await scope.save()
  } catch (e) {
    if (e.name.includes(UniqueConstraintError.name)) {
      return error('Scope with such name already exists!', 400)
    }

    return error(e, 400)
  }

  return scope
}
