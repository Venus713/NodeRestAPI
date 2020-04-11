const joi = require('@hapi/joi')
const { error } = require('lib-core')
const { Op } = require('sequelize')
const { isEmpty } = require('lodash')
const path = require('path')
const passwordHelper = require(path.resolve('app', 'helpers', 'password'))

// schema validator
const schema = joi.object().keys({
  data: joi.array()
}).unknown(true)

// userSchema validator
const userSchema = joi.object().keys({
  firstName: joi.string().required(),
  lastName: joi.string().optional(),
  emailAddress: joi.string().required(),
  userGroups: joi.array().items(joi.string()).optional(),
  role: joi.string().guid().optional()
}).unknown(true)

module.exports = async (args, { token, user, db, logger }, ast) => {
  if (user.isAnonymous === true ||
    user.permissions.includes('user_create') === true) {
    return error.AccessDeniedError()
  }

  const arrayValidation = joi.validate(args, schema)

  if (isEmpty(arrayValidation.error) === false) {
    return error(arrayValidation.error)
  }

  const { data } = args
  const users = await db.User.findAll({ where: { emailAddress: { [ Op.in ]: data.map((row) => row.emailAddress) } } })
  const existingEmailAddress = users.map(item => item.emailAddress)
  const usersToCreate = data.filter(item =>
    !existingEmailAddress.includes(item.emailAddress) &&
    isEmpty(joi.validate(item, userSchema).error)
  )
  const creationPromises = []

  for (const userItem of usersToCreate) {
    const { id, firstName, lastName } = user
    const salt = passwordHelper.generateSalt()
    const password = passwordHelper.hashPassword({ salt, password: 'FAKE_PWD' })
    const hash = passwordHelper.generateSalt(32)
    const _user = new db.User({
      ...userItem,
      password,
      hash,
      salt,
      invitedBy: id,
      invitedByLink: {
        id,
        firstName,
        lastName
      }
    })

    creationPromises.push(_user.save())
  }

  let createdUsers = []

  try {
    const saveResult = await Promise.all(creationPromises)
    createdUsers = saveResult.map(result => result.dataValues)
  } catch (e) {
    logger.error(e)
  }

  return {
    data: createdUsers,
    count: createdUsers.length
  }
}
