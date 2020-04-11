const TABLE_NAME = 'users'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    'invited_by',
    {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    TABLE_NAME,
    'invited_by',
    {
      type: Sequelize.UUID,
      allowNull: false
    })
}
