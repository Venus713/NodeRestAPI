const path = require('path')
const { Role } = require(path.resolve('app', 'models'))
const { pullAll } = require('lodash')
const permissions = [
  'report_update_submitted'
]
const ID = '6ef0bb67-3ab8-4301-b006-24bfffe32fd1'

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
