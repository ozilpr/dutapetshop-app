const InvariantError = require('../../exceptions/InvariantError')
const { MedResourcesPayloadSchema } = require('./schema')

const MedResourcesValidator = {
  validateMedResourcePayload: (payload) => {
    const validationResult = MedResourcesPayloadSchema.validate(payload)
    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  }
}

module.exports = MedResourcesValidator
