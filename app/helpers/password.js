const crypto = require('crypto')

const hashPassword = ({ password, salt }) => {
  return crypto.pbkdf2Sync(
    [password, salt, password].join('.'), // password
    salt, // salt
    1000, // iterations
    64, // keylength
    'sha512' // digest
  ).toString('hex')
}

const generateSalt = (length = 16) => {
  return crypto.randomBytes(length).toString('hex')
}

module.exports = { hashPassword, generateSalt }
