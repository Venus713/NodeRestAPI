const path = require('path')
const ownerId = '73589151-a6d7-438c-881b-bccf7127afb6'
const { flatten, isObject } = require('lodash')
const { Op } = require('sequelize')
const isOwner = (user) => {
  if (isObject(user.role)) {
    return user.role.id === ownerId
  }

  return user.role === ownerId
}
const getAssignedResources = async (user, resourceType) => {
  // TODO: Move this out of function
  const { Scope } = require(path.resolve('app', 'models'))
  const where = {
    id: { [ Op.in ]: user.scopes }
  }
  const scopes = await Scope.findAll({ where })

  return flatten(scopes.map(
    scope => scope.resources.filter(resource => resource.type === resourceType)
  ))
}
const getIndividualUserGroupOrQuery = (resources) => {
  const allowedUserGroupResources = []

  for (const resource of resources) {
    allowedUserGroupResources.push({
      userGroups: {
        [ Op.contains ]: resource.id
      }
    })
  }

  return allowedUserGroupResources
}

module.exports = {
  isOwner,
  getAssignedResources,
  getIndividualUserGroupOrQuery
}
