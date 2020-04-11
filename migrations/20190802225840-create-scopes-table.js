const TABLE_NAME = 'scopes'

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
      resources: {
        field: 'resources',
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: []
      },
      createdBy: {
        field: 'created_by',
        type: DataType.UUID,
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
