const DataType = require('sequelize')

module.exports = {
  fields: {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      field: 'name',
      type: DataType.STRING(),
      unique: true,
      allowNull: false
    },
    description: {
      field: 'description',
      type: DataType.STRING(),
      allowNull: false
    },
    permissions: {
      type: DataType.JSONB,
      allowNull: false
    },
    createdBy: {
      field: 'created_by',
      type: DataType.UUID,
      allowNull: true
    },
    createdAt: {
      field: 'created_at',
      type: DataType.DATE
    },
    updatedAt: {
      field: 'updated_at',
      type: DataType.DATE
    },
    workspaceId: {
      field: 'workspace_id',
      type: DataType.UUID
    }
  },
  options: {
    underscored: true,
    paranoid: false,
    tableName: 'roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
  }
}
