require('dotenv').config()
const path = require('path')
const { User, Scope, UserGroup } = require(path.resolve('app', 'models'))
const WORKSPACE_ID = 'e2917824-882c-418c-9c62-cd1ac866dca0'

const updateEntitiesWithWorkspaceId = async () => {
  await User.update({ workspaceId: WORKSPACE_ID }, { where: {} })
  await Scope.update({ workspaceId: WORKSPACE_ID }, { where: {} })
  await UserGroup.update({ workspaceId: WORKSPACE_ID }, { where: {} })
}

updateEntitiesWithWorkspaceId()
  .catch(e => console.error(e))
