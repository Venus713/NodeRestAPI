const TABLE_NAME = 'scopes'
const COLUMN_NAME = 'workspace_id'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.STRING(),
      allowNull: true
    }),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME)
}
