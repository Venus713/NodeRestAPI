const path = require('path')
const { login } = require(path.resolve('tests', 'helpers', 'login.js'))
const { gqlClient } = require(path.resolve('app', 'helpers', 'serviceClients.js'))
const auth = gqlClient('http://localhost:3000/graphql')

beforeAll(async () => {
  const response = await login()

  auth.setHeader('Authorization', `Bearer ${response.token}`)
})

test('Fetch roles with default limit', async () => {
  const query = `
    query {
      roles {
        count
        data {
          id
          name
        }
      }
    }
  `
  const response = await auth.request(query)

  expect(response.roles.count).toBeGreaterThan(1)
})

test('Fetch roles limit by 2', async () => {
  const query = `
    query {
      roles(limit: 2) {
        count
        data {
          id
          name
        }
      }
    }
  `
  const response = await auth.request(query)

  expect(response.roles.data.length).toEqual(2)
})

test('Fetch roles and User Counts', async () => {
  const query = `
    query {
      roles(name: "Owner" limit: 1) {
        count
        data {
          id
          name
          usersCount
        }
      }
    }
  `
  const response = await auth.request(query)

  expect(response.roles.data[0].name).toEqual('Owner')
  expect(response.roles.data[0].id).toEqual('73589151-a6d7-438c-881b-bccf7127afb6')
  expect(response.roles.data[0].usersCount).toBeGreaterThanOrEqual(1)
})
