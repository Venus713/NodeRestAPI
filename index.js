const tracer = require('dd-trace').init({
  analytics: true,
  env: process.env.NODE_ENV || 'development'
})
const { getApp } = require('lib-core').server
const { HOST, PORT } = process.env
const path = require('path')
const keyPath = path.resolve('config', 'keys', 'svc-auth-public.pem')
const { server, app } = getApp({ keyPath })

// tracer.use('graphql', {
//   service: require('./package').name,
//   enabled: true
// })

global.tracer = tracer
// const fs = require('fs')
// const {importUsers} = require(path.resolve('app', 'helpers', 'importer'))
// const dataset = fs.readFileSync('user-list.json', 'utf-8')

// importUsers(
//   JSON.parse(dataset),
//   {
//     invitedBy: '2976d7d5-fed4-400a-abf0-840ded450015',
//     role: '506bf27d-8997-47b5-9eba-be2891428707',
//     status: 'ACTIVE'
//   }
// ).then((result) => {
//   console.log('we are done..')
// })

/*
role: '506bf27d-8997-47b5-9eba-be2891428707',
invitedBy: '2976d7d5-fed4-400a-abf0-840ded450015' // owner.id
*/

app.listen({
  port: PORT
}, () =>
  console.log(`🚀 Server ready at http://${HOST}:${PORT}${server.graphqlPath}`)
)
