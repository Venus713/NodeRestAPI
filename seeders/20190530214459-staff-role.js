const TABLE_NAME = 'roles'
const id = '506bf27d-8997-47b5-9eba-be2891428707'
const permissions = [
  'user_update_own',
  'report_list_own',
  'report_archive_own'
]

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    TABLE_NAME,
    [{
      id,
      name: 'Staff',
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
