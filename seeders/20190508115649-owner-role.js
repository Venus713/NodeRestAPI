const path = require('path')
const TABLE_NAME = 'roles'
const id = '73589151-a6d7-438c-881b-bccf7127afb6'
const permissions = require(path.resolve('config', 'permissions'))

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    TABLE_NAME,
    [{
      id,
      name: 'Owner',
      permissions: JSON.stringify(permissions),
      created_at: new Date(),
      updated_at: new Date()
    }],
    {}
  ),
  down: (queryInterface) => queryInterface.bulkDelete(
    TABLE_NAME,
    { id },
    {}
  )
}
