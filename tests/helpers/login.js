const path = require('path')
const { gqlClient } = require(path.resolve('app', 'helpers', 'serviceClients.js'))
const { DEFAULT_OWNER_PASSWORD } = process.env
const auth = gqlClient('http://localhost:3000/graphql')
const subDomain = 'beta'

const login = async () => {
  const email = 'owner@viso.ai'
  const query = `
    mutation {
      login(emailAddress: "${email}" password: "${DEFAULT_OWNER_PASSWORD}" subDomain: "${subDomain}") {
        token
      }
    }  
  `
  const response = await auth.request(query)

  return response.login
}

module.exports = { login }
