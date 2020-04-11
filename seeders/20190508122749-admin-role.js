const path = require('path')
const TABLE_NAME = 'roles'
const id = '2e3c7fb2-786f-4060-a799-b311b48b19b4'
const permissions = require(path.resolve('config', 'permissions'))

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    TABLE_NAME,
    [{
      id,
      name: 'Admin',
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
