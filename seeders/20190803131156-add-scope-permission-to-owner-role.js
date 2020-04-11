const path = require('path')
const { Role } = require(path.resolve('app', 'models'))
const { pullAll } = require('lodash')
const scopePermissions = [
  'scope_create',
  'scope_list_own',
  'scope_list_any',
  'scope_update_own',
  'scope_update_any',
  'scope_delete_own',
  'scope_delete_any'
]
const ID = '73589151-a6d7-438c-881b-bccf7127afb6'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ownerRole = await Role.findOne({ where: { id: ID } })

    ownerRole.permissions = [ ...ownerRole.permissions, ...scopePermissions ]

    return ownerRole.save()
  },

  down: async (queryInterface, Sequelize) => {
    const ownerRole = await Role.findOne({ where: { id: ID } })

    pullAll(ownerRole.permissions, scopePermissions)

    return ownerRole.save()
  }
}
