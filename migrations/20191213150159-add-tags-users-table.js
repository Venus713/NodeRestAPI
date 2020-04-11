const TABLE_NAME = 'users'
const COLUMN_NAME = 'tags'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: []
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME)
}
