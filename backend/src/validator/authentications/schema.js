const Joi = require('joi')

const AuthenticationsPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/)
})

module.exports = { AuthenticationsPayloadSchema }
