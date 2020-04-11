const path = require('path')
const { Role } = require(path.resolve('app', 'models'))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = await Role.findAll()
    const promises = []

    for (let role of roles) {
      role.set('createdBy', '73589151-a6d7-438c-881b-bccf7127afb6')
      promises.push(role.save())
    }

    return Promise.all(promises)
  },

  down: async (queryInterface, Sequelize) => {
    const roles = await Role.findAll()
    const promises = []

    for (let role of roles) {
      role.set('createdBy', null)
      promises.push(role.save())
    }

    return Promise.all(promises)
  }
}
