const InvariantError = require('../../exceptions/InvariantError')
const { OwnersPayloadSchema } = require('./schema')

const OwnersValidator = {
  validateOwnerPayload: (payload) => {
    const validationResult = OwnersPayloadSchema.validate(payload)
    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  }
}

module.exports = OwnersValidator
