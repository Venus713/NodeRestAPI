const path = require('path')
const { Role } = require(path.resolve('app', 'models'))
const { nameToIdMap } = require(path.resolve('app', 'helpers', 'roleMap'))
const { pullAll } = require('lodash')
const permissions = [
  'drs_create',
  'drs_update_any',
  'drs_update_own',
  'drs_update_draft',
  'drs_update_submitted',
  'drs_delete_any',
  'drs_delete_own',
  'drs_list_any',
  'drs_list_own',
  'drs_list_draft',
  'drs_list_submitted'
]
const ID = nameToIdMap.owner

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const role = await Role.findOne({ where: { id: ID } })

    role.permissions = [ ...role.permissions, ...permissions ]

    return role.save()
  },

  down: async (queryInterface, Sequelize) => {
    const role = await Role.findOne({ where: { id: ID } })

    pullAll(role.permissions, permissions)

    return role.save()
  }
}
