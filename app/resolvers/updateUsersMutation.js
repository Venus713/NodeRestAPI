const { error } = require('lib-core')
const { isEmpty, countBy } = require('lodash')
const path = require('path')
const userHelper = require(path.resolve('app', 'helpers', 'user'))
const { Op } = require('sequelize')
const joi = require('@hapi/joi')

// schema validator
const schema = joi.object().keys({
  data: joi.array()
}).unknown(true)

// userSchema validator
const userSchema = joi.object().keys({
  id: joi.string().guid().required(),
  firstName: joi.string().required(),
  lastName: joi.string().optional(),
  emailAddress: joi.string().required(),
  userGroups: joi.array().items(joi.string()).optional(),
  role: joi.string().guid().optional(),
  phoneNumber: joi.string().optional(),
  address: joi.string().optional(),
  tags: joi.array().items(joi.string()).optional(),
  language: joi.string().optional()
}).unknown(true)

module.exports = async (args, { token, user, db }, ast) => {
  if (
    user.isAnonymous === true ||
    user.permissions.includes('user_update_any') === true
  ) {
    return error.AccessDeniedError()
  }

  const arrayValidation = joi.validate(args, schema)

  if (isEmpty(arrayValidation.error) === false) {
    return error(arrayValidation.error)
  }

  const where = { [ Op.and ]: [] }

  if (!user.isOwner) {
    const resources = await userHelper.getAssignedResources(user, 'UserGroup')

    where[ Op.and ].push({
      [Op.or]: userHelper.getIndividualUserGroupOrQuery(resources)
    })
  }

  const { data } = args
  const emailInputs = data.map(row => row.emailAddress)
  const emailWhereCondition = { [Op.and]: [...where[Op.and]] }
  emailWhereCondition[ Op.and ].push({ emailAddress: { [ Op.in ]: emailInputs } })

  const users = await db.User.findAll({ where: emailWhereCondition })
  const existingEmailAddress = users.map(item => item.emailAddress)
  const updateInputs = data.filter(item =>
    !existingEmailAddress.includes(item.emailAddress) &&
    countBy(emailInputs, email => email === item.emailAddress).true === 1 &&
    isEmpty(joi.validate(item, userSchema).error)
  )
  const idsToUpdate = updateInputs.map(item => item.id)
  const updateWhereCondition = { [Op.and]: [...where[Op.and]] }
  updateWhereCondition[ Op.and ].push({ id: { [ Op.in ]: idsToUpdate } })

  const updatePromises = []
  const usersToUpdate = await db.User.findAll({ where: updateWhereCondition })

  for (const updateUser of usersToUpdate) {
    const updateArgs = updateInputs.find(item => item.id === updateUser.id)
    updateUser.set(updateArgs)
    updatePromises.push(updateUser.save())
  }

  try {
    const updateResult = await Promise.all(updatePromises)
    const updatedUsers = updateResult.map(result => result.dataValues)

    return {
      data: updatedUsers,
      count: updatedUsers.length
    }
  } catch (e) {
    return {
      data: [],
      count: 0
    }
  }
}
