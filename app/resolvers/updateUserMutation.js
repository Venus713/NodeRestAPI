const { error } = require('lib-core')
const { isEmpty } = require('lodash')
const path = require('path')
const userHelper = require(path.resolve('app', 'helpers', 'user'))
const { UniqueConstraintError, Op } = require('sequelize')

module.exports = async (args, { token, user, db }, ast) => {
  if (user.isAnonymous === true) {
    return error.AccessDeniedError()
  }

  let userId = user.id

  if (
    (user.permissions.includes('user_update_any') === true) &&
    (isEmpty(args.id) === false)
  ) {
    userId = args.id
  }

  const where = { id: userId }

  if (!user.isOwner && args.id !== user.id) {
    const resources = await userHelper.getAssignedResources(user, 'UserGroup')

    where[ Op.and ] = [{
      [Op.or]: userHelper.getIndividualUserGroupOrQuery(resources)
    }]
  }

  const record = await db.User.findOne({ where })

  if (isEmpty(record)) {
    return error.NotFoundError()
  }

  record.set(args)

  try {
    await record.save()
  } catch (e) {
    if (e.name.includes(UniqueConstraintError.name)) {
      return error('User with such email already exists!', 400)
    }
  }

  return record
}
