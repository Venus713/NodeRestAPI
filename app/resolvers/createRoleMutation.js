const path = require('path')
const { error } = require('lib-core')
const { UniqueConstraintError } = require('sequelize')
const _ = require('lodash')
const joi = require('@hapi/joi')
const permissions = require(path.resolve('config', 'permissions.json'))

// schema validator
const schema = joi.object().keys({
  name: joi.string().required(),
  permissions: joi.array().min(1).items(joi.string().valid(permissions)).required(),
  description: joi.string()
}).unknown(true)

module.exports = async (args, { token, user, db }, ast) => {
  if (!user.permissions.includes('role_create')) {
    return error.AccessDeniedError()
  }

  const validation = joi.validate(args, schema)

  if (!_.isEmpty(validation.error)) {
    return error(validation.error)
  }

  const role = new db.Role(args)

  role.set('createdBy', user.id)

  try {
    await role.save()
  } catch (e) {
    if (e.name.includes(UniqueConstraintError.name)) {
      return error('Role with such name already exists!', 400)
    }

    return error(e, 400)
  }

  return role
}
