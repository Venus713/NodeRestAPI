const path = require('path')
const { gqlClient } = require(path.resolve('app', 'helpers', 'serviceClients.js'))
const { DEFAULT_OWNER_PASSWORD } = process.env
const auth = gqlClient('http://localhost:3000/graphql')
const subDomain = 'beta'

test('Login from Owner account', async () => {
  const email = 'owner@viso.ai'
  const query = `
    mutation {
      login(emailAddress: "${email}" password: "${DEFAULT_OWNER_PASSWORD}" subDomain: "${subDomain}") {
        user {
          firstName
          id
          lastName
        }
      }
    }  
  `
  const response = await auth.request(query)

  expect(response.login.user.firstName).toEqual('Owner')
})

test('Update last login value when logging in using the owner account', async () => {
  const email = 'owner@viso.ai'
  const current = new Date()
  const query = `
    mutation {
      login(emailAddress: "${email}" password: "${DEFAULT_OWNER_PASSWORD}" subDomain: "${subDomain}") {
        user {
          lastLogin
        }
      }
    }  
  `
  const response = await auth.request(query)
  expect(new Date(response.login.user.lastLogin).getTime()).toBeGreaterThan(new Date(current).getTime())
})
