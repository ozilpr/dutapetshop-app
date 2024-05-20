const Joi = require('joi')

const MedResourcesPayloadSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  type: Joi.string().allow(null, ''),
  price: Joi.string().required()
})

module.exports = { MedResourcesPayloadSchema }
