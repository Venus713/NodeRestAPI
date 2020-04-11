const path = require('path')
const passwordHelper = require(path.resolve('app', 'helpers', 'password'))
const emailHelper = require(path.resolve('app', 'helpers', 'email'))
const { UniqueConstraintError } = require('sequelize')
const { error, token: TokenCreator } = require('lib-core')
const { APP_INVITE_URL } = process.env

module.exports = async (args, { user, db }) => {
  const { emailAddress, firstName, lastName, role, userGroups } = args

  if (user.permissions.includes('user_invite') === false) {
    return error.AccessDeniedError()
  }

  const existingUser = await db.User.findOne({ where: { emailAddress } })

  if (existingUser) {
    return error('The user with following email already exists.')
  }

  const salt = passwordHelper.generateSalt()
  const password = passwordHelper.hashPassword({ salt, password: 'FAKE_PWD' })
  const hash = passwordHelper.generateSalt(32)
  const record = new db.User({
    firstName,
    lastName,
    emailAddress,
    salt,
    userGroups,
    password,
    hash,
    role,
    invitedBy: user.id,
    invitedByLink: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    }
  })

  try {
    await record.save()
  } catch (e) {
    if (e.name.includes(UniqueConstraintError.name)) {
      return error('User with such email already exists!', 400)
    }
  }

  const keyPath = path.resolve('config', 'keys', 'svc-auth-private.pem')
  const inviteToken = await TokenCreator.sign({
    payload: {
      id: record.id
    },
    keyPath,
    options: {
      expiresIn: '24h',
      issuer: 'topkamera',
      audience: 'invitation',
      algorithm: 'RS256'
    }
  })
  const link = `${APP_INVITE_URL}?token=${inviteToken}`

  // send in non-blocking mode
  emailHelper.sendInviteEmail({
    to: emailAddress,
    payload: { link }
  })

  return record
}
