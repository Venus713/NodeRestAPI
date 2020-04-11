const { error } = require('lib-core')
const { UniqueConstraintError } = require('sequelize')
const _ = require('lodash')
const joi = require('@hapi/joi')

// schema validator
const schema = joi.object().keys({
  name: joi.string(),
  permissions: joi.array().min(1).items(joi.string()),
  description: joi.string()
}).unknown(true)

module.exports = async (args, { token, user, db }, ast) => {
  if (!user.permissions.includes('role_update')) {
    return error.AccessDeniedError()
  }

  const validation = joi.validate(args, schema)

  if (!_.isEmpty(validation.error)) {
    return error(validation.error)
  }

  const role = await db.Role.findOne({ where: { id: args.id } })

  if (_.isEmpty(role)) {
    return error.NotFoundError()
  }

  try {
    role.set(args)
    await role.save()
  } catch (e) {
    if (e.name.includes(UniqueConstraintError.name)) {
      return error('Role with such name already exists!', 400)
    }

    return error(e, 400)
  }

  return role
}
