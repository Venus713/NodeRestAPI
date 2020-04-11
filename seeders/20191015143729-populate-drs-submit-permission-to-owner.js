const path = require('path')
const { Role } = require(path.resolve('app', 'models'))
const { nameToIdMap } = require(path.resolve('app', 'helpers', 'roleMap'))
const { pullAll } = require('lodash')
const permissions = [
  'drs_submit_own',
  'drs_submit_any'
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
