const {
  error,
  token: TokenCreator
} = require('lib-core')
const path = require('path')
const {
  isEmpty
} = require('lodash')
const emailHelper = require(path.resolve('app', 'helpers', 'email'))

module.exports = async (args, {
  token,
  user,
  db,
  logger,
  req
}, ast) => {
  const {
    email
  } = args
  const userFound = await db.User.findOne({
    where: {
      emailAddress: email
    }
  })

  if (isEmpty(userFound)) {
    return error('No user found for this email address', 400)
  }

  const keyPath = path.resolve('config', 'keys', 'svc-auth-private.pem')
  const resetPasswordToken = await TokenCreator.sign({
    payload: {
      id: userFound.id,
      email: userFound.emailAddress
    },
    keyPath,
    options: {
      expiresIn: '24h',
      issuer: 'topkamera',
      audience: 'reset-password',
      algorithm: 'RS256'
    }
  })
  const link = `${req.protocol}://${req.get('host')}/#/reset-password?token=${resetPasswordToken}`

  logger.info(`user has requested to reset password`)

  emailHelper.sendResetPasswordEmail({
    to: email,
    payload: {
      link
    }
  })

  return 'OK'
}
