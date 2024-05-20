const InvariantError = require('../../exceptions/InvariantError')
const { PetsPayloadSchema } = require('./schema')

const PetsValidator = {
  validatePetPayload: (payload) => {
    const validationResult = PetsPayloadSchema.validate(payload)
    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  }
}

module.exports = PetsValidator
