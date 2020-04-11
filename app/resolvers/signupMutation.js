const path = require('path')
const workspaceHelper = require(path.resolve('app', 'helpers', 'workspace'))
const passwordHelper = require(path.resolve('app', 'helpers', 'password'))
const { error, token: TokenCreator } = require('lib-core')
const userHelper = require(path.resolve('app', 'helpers', 'user'))
const permissions = require(path.resolve('config', 'permissions'))
const OWNER_ROLE_ID = '73589151-a6d7-438c-881b-bccf7127afb6'
const { get, isNil } = require('lodash')

module.exports = async (args, { token, db, logger }, ast) => {
  const { workspace, user } = args
  let existingWorkspaceResource

  try {
    existingWorkspaceResource = await workspaceHelper
      .getWorkSpaceBySubDomain(workspace.subDomain)
  } catch (e) {
    logger.error(e)

     // return error(e)
  }

  if (!isNil(existingWorkspaceResource)) {
    return error('A workspace already exist with this sub-domain', 400)
  }

  const salt = passwordHelper.generateSalt()
  const password = passwordHelper.hashPassword({ salt, password: user.password })
  const hash = passwordHelper.generateSalt(32)

  const userResource = new db.User(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      role: OWNER_ROLE_ID,
      password,
      hash,
      salt
    }
  )
  let createdWorkSpaceResource
  let role

  try {
    createdWorkSpaceResource = await workspaceHelper.createWorkSpace(
      workspace.name,
      workspace.subDomain,
      userResource.id
    )
  } catch (e) {
    logger.error(e)
    return error(e, 400)
  }

  userResource.set('workspaceId', createdWorkSpaceResource.id)
  userResource.set('lastLogin', new Date())

  try {
    await userResource.save()
  } catch (e) {
    logger.error(e)
    return error(e)
  }

  try {
    await db.Role.create({
      name: 'Owner',
      description: '(default) High-level role.',
      permissions,
      createdBy: userResource.id,
      workspaceId: createdWorkSpaceResource.id
    })
    await db.Role.create({
      name: 'Admin',
      description: '(default) High-level role.',
      permissions,
      createdBy: userResource.id,
      workspaceId: createdWorkSpaceResource.id
    })
  } catch (e) {
    logger.error(e)
  }

  const payload = {
    id: userResource.id,
    firstName: userResource.firstName,
    lastName: userResource.lastName,
    role: userResource.role,
    permissions: get(role, 'permissions', []),
    scopes: userResource.scopes || [],
    internalId: userResource.internalId,
    isOwner: userHelper.isOwner(userResource),
    workspaceId: createdWorkSpaceResource.id
  }
  const keyPath = path.resolve('config', 'keys', 'svc-auth-private.pem')

  return {
    token: await TokenCreator.sign({
      payload,
      keyPath,
      options: {
        subject: userResource.id,
        expiresIn: '24h',
        issuer: 'topkamera',
        algorithm: 'RS256'
      }
    }),
    user: {
      ...userResource.get(),
      role
    }
  }
}
