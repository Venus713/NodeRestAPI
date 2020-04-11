const TABLE_NAME = 'users'
const COLUMN_NAME = 'invited_by'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.UUID,
      allowNull: true
    }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.UUID,
      allowNull: false
    })
}
