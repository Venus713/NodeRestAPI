const nodemailer = require('nodemailer')
const mandrillTransport = require('nodemailer-mandrill-transport')
const {
  MANDRILL_API_KEY,
  EMAIL_NO_REPLY
} = process.env
const transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: MANDRILL_API_KEY
  }
}))

const sendEmail = ({
  to,
  subject,
  html
}) => {
  return transport.sendMail({
    from: EMAIL_NO_REPLY,
    to,
    subject,
    html
  })
}

const sendInviteEmail = async ({
  to,
  payload
}) => {
  const html = `
    <p>
      Please click this <a href="${payload.link}">link</a> to accept an invite.
    </p>
  `
  return sendEmail({
    subject: 'You are invited at viso.ai',
    to,
    html
  })
}

const sendResetPasswordEmail = async ({
  to,
  payload
}) => {
  const html = `
    <p>
      Please click this <a href="${payload.link}">link</a> to reset your password.
    </p>
  `
  return sendEmail({
    subject: 'Reset your password | viso.ai',
    to,
    html
  })
}

module.exports = {
  sendInviteEmail,
  sendResetPasswordEmail
}
