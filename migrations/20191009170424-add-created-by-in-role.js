const TABLE_NAME = 'roles'
const COLUMN_NAME = 'created_by'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.STRING(),
      defaultValue: null
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME)
}
