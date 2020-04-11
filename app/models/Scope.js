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
      type: DataType.STRING(),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataType.STRING(),
      allowNull: true
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
    createdAt: {
      field: 'created_at',
      type: DataType.DATE
    },
    updatedAt: {
      field: 'updated_at',
      type: DataType.DATE
    }
  },
  options: {
    underscored: true,
    paranoid: false,
    tableName: 'scopes',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
  }
}
