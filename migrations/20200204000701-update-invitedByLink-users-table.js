const TABLE_NAME = 'users'
const COLUMN_NAME = 'invited_by_link'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.JSONB,
      allowNull: true
    }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.JSONB,
      allowNull: false
    })
}
