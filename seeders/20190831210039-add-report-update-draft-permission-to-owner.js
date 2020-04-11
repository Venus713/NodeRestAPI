const path = require('path')
const { Role } = require(path.resolve('app', 'models'))
const { pullAll } = require('lodash')
const permissions = [
  'report_update_draft'
]
const ID = '73589151-a6d7-438c-881b-bccf7127afb6'

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
