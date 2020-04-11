const TABLE_NAME = 'roles'
const id = '6ef0bb67-3ab8-4301-b006-24bfffe32fd1'
const permissions = [
  'user_invite',
  'user_list',
  'user_update_own',
  'user_update_any',
  'role_list',
  'user_group_create',
  'user_group_update',
  'user_group_list',
  'user_group_delete',
  'device_group_create',
  'device_group_update',
  'device_group_list',
  'device_group_delete',
  'device_create',
  'device_update_own',
  'device_update_any',
  'device_list',
  'device_archive',
  'release_create',
  'release_execute',
  'release_list',
  'report_update_own',
  'report_update_any',
  'report_list_own',
  'report_archive_own',
  'analytics_dashboard'
]

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    TABLE_NAME,
    [{
      id,
      name: 'Manager',
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
