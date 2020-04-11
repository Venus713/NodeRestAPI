const TABLE_NAME = 'roles'

module.exports = {
  up: (queryInterface, DataType) => queryInterface.createTable(
    TABLE_NAME,
    {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        field: 'name',
        type: DataType.STRING(),
        allowNull: false
      },
      permissions: {
        type: DataType.JSONB,
        allowNull: false
      },
      created_at: {
        field: 'created_at',
        type: DataType.DATE,
        defaultValue: DataType.NOW
      },
      updated_at: {
        field: 'updated_at',
        type: DataType.DATE,
        defaultValue: DataType.NOW
      }
    }
  ),
  down: (queryInterface) => queryInterface.dropTable(TABLE_NAME)
}
