const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT
} = process.env

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    dialect: DB_DIALECT,
    host: DB_HOST,
    port: DB_PORT
  }
)
const models = {}

fs.readdirSync(path.resolve('app', 'models'))
  .filter((file) => (file !== 'index.js'))
  .forEach((file) => {
    const modelName = file.substring(0, file.indexOf('.'))
    const { fields, options } = require(path.resolve('app', 'models', file))

    const model = sequelize.define(
      modelName.toLowerCase(),
      fields,
      options
    )

    models[ modelName ] = model
  })

models[ 'User' ].hasOne(
  models[ 'Role' ],
  {
    foreignKey: 'id',
    as: 'UserRole',
    sourceKey: 'role'
  }
)

models[ 'Scope' ].hasOne(
  models[ 'User' ],
  {
    foreignKey: 'id',
    as: 'user',
    sourceKey: 'createdBy'
  }
)

models[ 'Role' ].hasMany(
  models[ 'User' ],
  {
    sourceKey: 'id',
    as: 'users',
    foreignKey: 'role'
  }
)

// models['User'].destroy(
//   {
//     where: {
//       role: '506bf27d-8997-47b5-9eba-be2891428707'
//     }
//   }
// ).then(console.log)

module.exports = models
module.exports.sequelize = sequelize
