const path = require('path')
const uuid = require('uuid')
const passwordHelper = require(path.resolve('app', 'helpers', 'password'))
const TABLE_NAME = 'users'
const id = '2976d7d5-fed4-400a-abf0-840ded450015'
const OWNER_ROLE_ID = '73589151-a6d7-438c-881b-bccf7127afb6'
const { DEFAULT_OWNER_PASSWORD } = process.env

module.exports = {
  up: (queryInterface) => {
    const hash = passwordHelper.generateSalt()
    const salt = passwordHelper.generateSalt()
    const password = passwordHelper.hashPassword({
      salt,
      password: DEFAULT_OWNER_PASSWORD
    })

    return queryInterface.bulkInsert(
      TABLE_NAME,
      [{
        id,
        first_name: 'Owner',
        email_address: 'owner@viso.ai',
        password,
        salt,
        hash,
        status: 'ACTIVE',
        role: OWNER_ROLE_ID,
        invited_by: uuid.v4(), // fake id
        created_at: new Date(),
        updated_at: new Date()
      }],
      {}
    )
  },
  down: (queryInterface) => queryInterface.bulkDelete(
    TABLE_NAME,
    { id },
    {}
  )
}
