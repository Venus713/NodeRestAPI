const path = require('path')
const passwordHelper = require(path.resolve('app', 'helpers', 'password'))
const uuid = require('uuid')
const models = require(path.resolve('app', 'models'))

const importUsers = async (data, { invitedBy, role, status }) => {
  const records = []

  for (const row of data) {
    // const {
    //   first_name,
    //   last_name,
    //   email,
    //   internal_id
    // } = row
    const salt = passwordHelper.generateSalt()
    const password = passwordHelper.hashPassword({
      salt,
      password: row['internal_id']
    })
    const hash = passwordHelper.generateSalt(32)

    records.push({
      id: uuid.v4(),
      firstName: String(row['first_name'] || row['internal_id']),
      lastName: 'Benutzer',
      emailAddress: row['email'] || `${row['internal_id']}@diepost.ch`,
      internalId: row['internal_id'],
      status,
      salt,
      password,
      hash,
      role,
      invitedBy
    })
  }

  return models.User.bulkCreate(records)
}

module.exports = { importUsers }
