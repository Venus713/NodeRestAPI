const { error } = require('lib-core')
const path = require('path')
const passwordHelper = require(path.resolve('app', 'helpers', 'password'))

module.exports = async (args, { token, user, db }, ast) => {
  const { password, currentPassword } = args
  const userFound = await db.User.findOne({ where: { id: user.id } })

  const oldHashedPassword = passwordHelper.hashPassword(
    { password: currentPassword, salt: userFound.salt }
  )

  if (oldHashedPassword !== userFound.password) {
    return error('Current Password is incorrect', 400)
  }

  const hash = passwordHelper.generateSalt()
  const salt = passwordHelper.generateSalt()
  const newPassword = passwordHelper.hashPassword({
    salt,
    password
  })

  try {
    await userFound.update({ password: newPassword, salt, hash })
  } catch (e) {
    return error(e, 400)
  }

  return 'OK'
}
