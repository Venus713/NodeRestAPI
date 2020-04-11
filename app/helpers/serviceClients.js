const { GraphQLClient } = require('graphql-request')
const { WORKSPACE_SERVICE } = process.env

const gqlClient = (url) => {
  return new GraphQLClient(url)
}
const workspaceGqlClientNonTokenized = () => {
  return new GraphQLClient(WORKSPACE_SERVICE)
}
const workspaceGqlClientTokenized = (token) => {
  return new GraphQLClient(WORKSPACE_SERVICE, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
}

module.exports = { gqlClient, workspaceGqlClientNonTokenized, workspaceGqlClientTokenized }
