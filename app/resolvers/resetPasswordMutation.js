const {
  error,
  token: TokenCreator
} = require('lib-core')
const path = require('path')
const userHelper = require(path.resolve('app', 'helpers', 'user'))
const passwordHelper = require(path.resolve('app', 'helpers', 'password'))
const {
  isEmpty
} = require('lodash')

module.exports = async (args, { token, user, db, logger }, ast) => {
  const { resetToken, newPassword, activateUser } = args

  if (!resetToken) {
    return error.BadRequestError()
  }

  const keyPath = path.resolve('config', 'keys', 'svc-auth-public.pem')

  try {
    const userPayload = await TokenCreator.verify({
      keyPath,
      token: resetToken,
      options: {
        algorithm: 'RS256'
      }
    })

    const userFound = await db.User.findOne({
      where: {
        id: userPayload.id
      },
      include: [ {
        model: db.Role,
        as: 'UserRole'
      } ]
    })

    if (isEmpty(userFound)) {
      return error('No user found', 400)
    }

    const hash = passwordHelper.generateSalt()
    const salt = passwordHelper.generateSalt()
    const newPasswordHashed = passwordHelper.hashPassword({
      salt,
      password: newPassword
    })
    let update = {
      password: newPasswordHashed,
      salt,
      hash
    }

    if (activateUser) {
      update = Object.assign({}, update, { status: 'ACTIVE' })
    }

    await userFound.update(update)

    const payload = {
      id: userFound.id,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      role: userFound.role,
      permissions: userFound.UserRole.permissions || [],
      scopes: userFound.scopes || [],
      internalId: userFound.internalId,
      isOwner: userHelper.isOwner(userFound)
    }
    const privateKeyPath = path.resolve('config', 'keys', 'svc-auth-private.pem')

    return {
      token: await TokenCreator.sign({
        payload,
        keyPath: privateKeyPath,
        options: {
          subject: userFound.id,
          expiresIn: '24h',
          issuer: 'topkamera',
          algorithm: 'RS256'
        }
      }),
      user: {
        ...userFound.get(),
        role: userFound.UserRole
      }
    }
  } catch (e) {
    logger.error(e)
    return error(e, 400)
  }
}
