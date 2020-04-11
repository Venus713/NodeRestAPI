const TABLE_NAME = 'roles'
const COLUMN_NAME = 'workspace_id'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.STRING(),
      allowNull: true
    }),
  down: (queryInterface) => queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME)
}
