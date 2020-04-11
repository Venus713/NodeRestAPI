const TABLE_NAME = 'roles'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    'name',
    {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    'name',
    {
      type: Sequelize.STRING,
      allowNull: false
    })
}
