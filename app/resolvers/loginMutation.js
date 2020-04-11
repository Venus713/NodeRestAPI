const path = require('path')
const passwordHelper = require(path.resolve('app', 'helpers', 'password'))
const userHelper = require(path.resolve('app', 'helpers', 'user'))
const workspaceHelper = require(path.resolve('app', 'helpers', 'workspace'))
const { isEmpty } = require('lodash')
const { error, token: TokenCreator } = require('lib-core')

module.exports = async (args, { token, user, db, req, logger }, ast) => {
  const { emailAddress, password, subDomain } = args
  let workspace

  try {
    workspace = await workspaceHelper.getWorkSpaceBySubDomain(subDomain)
  } catch (e) {
    logger.error(e)
    return error(e, 400)
  }

  if (isEmpty(workspace)) {
    return error('Workspace does not exist for provided client', 400)
  }

  const userFound = await db.User.findOne({
    where: {
      workspaceId: workspace.id,
      emailAddress
    },
    include: [
      {
        model: db.Role,
        as: 'UserRole'
      }
    ]
  })

  if (isEmpty(userFound)) {
    return error.NotFoundError()
  }

  const hashPassword = passwordHelper.hashPassword({
    password,
    salt: userFound.salt
  })

  if (hashPassword !== userFound.password) {
    return error('Email or Password is incorrect', 400)
  }

  userFound.set({ lastLogin: new Date() })

  try {
    await userFound.save()
  } catch (e) {
    logger.error(e)
    return error(e)
  }

  const payload = {
    id: userFound.id,
    firstName: userFound.firstName,
    lastName: userFound.lastName,
    role: userFound.role,
    permissions: userFound.UserRole.permissions || [],
    scopes: userFound.scopes || [],
    internalId: userFound.internalId,
    isOwner: userHelper.isOwner(userFound),
    workspaceId: workspace.id
  }
  const keyPath = path.resolve('config', 'keys', 'svc-auth-private.pem')

  return {
    token: await TokenCreator.sign({
      payload,
      keyPath,
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
}
