const TABLE_NAME = 'users'
const COLUMN_NAME = 'address'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.STRING(),
      allowNull: true,
      defaultValue: null
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME)
}
