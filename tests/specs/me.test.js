const path = require('path')
const { login } = require(path.resolve('tests', 'helpers', 'login.js'))
const { gqlClient } = require(path.resolve('app', 'helpers', 'serviceClients.js'))
const auth = gqlClient('http://localhost:3000/graphql')

beforeAll(async () => {
  const response = await login()

  auth.setHeader('Authorization', `Bearer ${response.token}`)
})

test('Fetch my profile by me query', async () => {
  const query = `
    query {
      me {
        firstName
        role {
          name
          permissions
        }
      }
    }
  `
  const response = await auth.request(query)

  expect(response.me.firstName).toEqual('Owner')
  expect(response.me.role.name).toEqual('Owner')
  expect(response.me.role.permissions.includes('user_list')).toBeTruthy()
})
