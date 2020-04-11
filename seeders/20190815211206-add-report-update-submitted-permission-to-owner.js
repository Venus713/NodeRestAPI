const path = require('path')
const { Role } = require(path.resolve('app', 'models'))
const { pullAll } = require('lodash')
const permissions = [
  'report_update_submitted'
]
const ID = '73589151-a6d7-438c-881b-bccf7127afb6'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ownerRole = await Role.findOne({ where: { id: ID } })

    ownerRole.permissions = [ ...ownerRole.permissions, ...permissions ]

    return ownerRole.save()
  },

  down: async (queryInterface, Sequelize) => {
    const ownerRole = await Role.findOne({ where: { id: ID } })

    pullAll(ownerRole.permissions, permissions)

    return ownerRole.save()
  }
}
