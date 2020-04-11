const DataType = require('sequelize')
const path = require('path')
const userHelper = require(path.resolve('app', 'helpers', 'user'))

module.exports = {
  fields: {
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
    phoneNumber: {
      field: 'phone_number',
      type: DataType.STRING(),
      allowNull: true,
      defaultValue: null
    },
    address: {
      type: DataType.STRING(),
      allowNull: true,
      defaultValue: null
    },
    tags: {
      type: DataType.JSONB()
    },
    language: {
      type: DataType.STRING(),
      allowNull: false,
      defaultValue: 'de'
    },
    status: {
      type: DataType.ENUM('INVITED', 'ACTIVE', 'INACTIVE'),
      defaultValue: 'INVITED'
    },
    role: {
      type: DataType.UUID,
      allowNull: false
    },
    invitedBy: {
      field: 'invited_by',
      type: DataType.UUID,
      allowNull: true
    },
    userGroups: {
      field: 'user_groups',
      type: DataType.JSONB,
      allowNull: false,
      defaultValue: []
    },
    scopes: {
      field: 'scopes',
      type: DataType.JSONB,
      allowNull: false,
      defaultValue: []
    },
    invitedByLink: {
      field: 'invited_by_link',
      type: DataType.JSONB,
      allowNull: true
    },
    createdAt: {
      field: 'created_at',
      type: DataType.DATE,
      defaultValue: DataType.NOW,
      allowNull: false
    },
    lastLogin: {
      field: 'last_login',
      type: DataType.DATE,
      defaultValue: null
    },
    workspaceId: {
      field: 'workspace_id',
      type: DataType.STRING(),
      allowNull: true
    },
    updatedAt: {
      field: 'updated_at',
      type: DataType.DATE,
      defaultValue: DataType.NOW,
      allowNull: false
    },
    isOwner: {
      type: DataType.VIRTUAL,
      get () {
        return userHelper.isOwner(this)
      }
    }
  },
  options: {
    underscored: true,
    paranoid: false,
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
  }
}
