const TABLE_NAME = 'users'
const COLUMN_NAME = 'last_login'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.DATE(),
      allowNull: true
    }),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME)
}
