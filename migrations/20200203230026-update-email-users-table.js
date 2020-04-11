const TABLE_NAME = 'users'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    'email_address',
    {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false
    }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    'email_address',
    {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    })
}
