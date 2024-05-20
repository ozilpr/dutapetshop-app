const InvariantError = require('../../exceptions/InvariantError')
const { AdminPayloadSchema, UpdateAdminPayloadSchema } = require('./schema')

const AdminValidator = {
  validateAdminPayload: (payload) => {
    const validationResult = AdminPayloadSchema.validate(payload)
    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  },
  validateUpdateAdminPayload: (payload) => {
    const validationResult = UpdateAdminPayloadSchema.validate(payload)
    if (validationResult.error) throw new InvariantError(validationResult.error.message)
  }
}

module.exports = AdminValidator
