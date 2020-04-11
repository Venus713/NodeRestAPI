const path = require('path')
const { workspaceGqlClientNonTokenized } = require(
  path.resolve('app', 'helpers', 'serviceClients')
)
const { get } = require('lodash')
const getWorkSpaceBySubDomain = async (subDomain) => {
  const query = `
    query {
      workspace(subDomain: "${subDomain}") {
        id
      }
    }
  `

  const response = await workspaceGqlClientNonTokenized().request(query)

  return get(response, 'workspace', [])
}
const createWorkSpace = async (name, subDomain, owner) => {
  const query = `
    mutation {
      createWorkspace(
        subDomain: "${subDomain}" 
        name: "${name}" 
        owner: "${owner}"
       ) {
        id
      }
    }
  `

  const response = await workspaceGqlClientNonTokenized().request(query)

  return get(response, 'createWorkspace', {})
}

module.exports = { getWorkSpaceBySubDomain, createWorkSpace }
