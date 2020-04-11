const path = require('path')
const { Role } = require(path.resolve('app', 'models'))
const { nameToIdMap } = require(path.resolve('app', 'helpers', 'roleMap'))
const { pullAll } = require('lodash')
const permissions = [
  'drs_media_detach_own',
  'drs_media_detach_any',
  'drs_media_attach_own',
  'drs_media_attach_any',
  'drs_media_attach_draft',
  'drs_media_detach_draft',
  'drs_media_attach_submitted',
  'drs_media_detach_submitted',
  'report_media_detach_own',
  'report_media_attach_own',
  'report_media_detach_any',
  'report_media_attach_any',
  'report_media_attach_draft',
  'report_media_detach_draft',
  'report_media_attach_submitted',
  'report_media_detach_submitted'
]
const ID = nameToIdMap.manager

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const role = await Role.findOne({ where: { id: ID } })

    role.permissions = [ ...role.permissions, ...permissions ]

    return role.save()
  },

  down: async (queryInterface, Sequelize) => {
    const role = await Role.findOne({ where: { id: ID } })

    pullAll(role.permissions, permissions)

    return role.save()
  }
}
