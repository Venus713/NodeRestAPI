const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env

const create = (payload, { expiresIn = JWT_EXPIRES_IN, audience }) => {
  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn,
      audience: audience || 'client'
    }
  )
}
module.exports = { create }
