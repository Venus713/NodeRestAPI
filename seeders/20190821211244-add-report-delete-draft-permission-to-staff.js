const path = require('path')
const { Role } = require(path.resolve('app', 'models'))
const { pullAll } = require('lodash')
const permissions = [
  'report_delete_draft'
]
const ID = '506bf27d-8997-47b5-9eba-be2891428707'

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
