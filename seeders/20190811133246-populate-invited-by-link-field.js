const path = require('path')
const { User } = require(path.resolve('app', 'models'))
const { find, isEmpty } = require('lodash')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll()
    const promises = []

    for (let user of users) {
      const invitingUser = find(users, { id: user.invitedBy })

      user.invitedByLink = {
        id: (!isEmpty(invitingUser)) ? invitingUser.id : user.invitedBy,
        firstName: (!isEmpty(invitingUser)) ? invitingUser.firstName : 'Unknown',
        lastName: (!isEmpty(invitingUser)) ? invitingUser.lastName : 'User'
      }

      promises.push(user.save())
    }

    return Promise.all(promises)
  },

  down: async (queryInterface, Sequelize) => {
    const users = await User.findAll()
    const promises = []

    for (let user of users) {
      user.invitedByLink = {}
      promises.push(user.save())
    }

    return Promise.all(promises)
  }
}
