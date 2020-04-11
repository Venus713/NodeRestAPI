const TABLE_NAME = 'scopes'
const COLUMN_NAME = 'name'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    COLUMN_NAME,
    {
      type: Sequelize.STRING,
      allowNull: false
    })
}
