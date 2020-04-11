const path = require('path')
const { login } = require(path.resolve('tests', 'helpers', 'login.js'))
const { gqlClient } = require(path.resolve('app', 'helpers', 'serviceClients.js'))
const auth = gqlClient('http://localhost:3000/graphql')
const permissions = require(path.resolve('config/permissions.json'))

beforeAll(async () => {
  const response = await login()

  auth.setHeader('Authorization', `Bearer ${response.token}`)
})

test('Fetch permissions', async () => {
  const query = `
    query {
      permissions
    }
  `
  const response = await auth.request(query)

  expect(response.permissions).toHaveLength(permissions.length)
})
