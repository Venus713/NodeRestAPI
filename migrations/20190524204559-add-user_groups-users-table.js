const TABLE_NAME = 'users'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    TABLE_NAME,
    'user_groups',
    {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: []
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(TABLE_NAME, 'user_groups')
}
