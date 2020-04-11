const path = require('path')
const { error } = require('lib-core')

module.exports = async (args, { user }, ast) => {
  if (user.isAnonymous) {
    return error.AccessDeniedError()
  }

  return require(path.resolve('config/permissions.json'))
}
