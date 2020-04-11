const sequelize = require('sequelize')

module.exports = {
  fields: {
    id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true
    },
    class: {
      type: sequelize.STRING,
      defaultValue: 'CUSTOM'
    },
    type: {
      type: sequelize.STRING,
      defaultValue: 'STATIC'
    },
    description: {
      type: sequelize.STRING
    },
    createdAt: {
      field: 'created_at',
      type: sequelize.DATE
    },
    updatedAt: {
      field: 'updated_at',
      type: sequelize.DATE
    }
  },
  options: {
    underscored: true,
    paranoid: false,
    tableName: 'user_groups',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
  }
}
