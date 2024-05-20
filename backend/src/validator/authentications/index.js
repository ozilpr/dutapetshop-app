const InvariantError = require('../../exceptions/InvariantError')
const { AuthenticationsPayloadSchema } = require('./schema')

const AuthenticationsValidator = {
  validateAuthenticationPayload: (payload) => {
    const validationResult = AuthenticationsPayloadSchema.validate(payload)
    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  }
}

module.exports = AuthenticationsValidator
