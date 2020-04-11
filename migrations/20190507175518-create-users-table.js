const TABLE_NAME = 'users'

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
      internalId: {
        field: 'internal_id',
        type: DataType.STRING(),
        allowNull: true
      },
      firstName: {
        field: 'first_name',
        type: DataType.STRING(),
        allowNull: false
      },
      lastName: {
        field: 'last_name',
        type: DataType.STRING(),
        allowNull: true
      },
      emailAddress: {
        field: 'email_address',
        type: DataType.STRING(),
        allowNull: false
      },
      password: {
        type: DataType.STRING(),
        allowNull: false
      },
      salt: {
        type: DataType.STRING(),
        allowNull: false
      },
      hash: {
        type: DataType.STRING(),
        allowNull: false
      },
      status: DataType.ENUM('INVITED', 'ACTIVE', 'INACTIVE'),
      role: {
        type: DataType.UUID,
        allowNull: false
      },
      invitedBy: {
        field: 'invited_by',
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
