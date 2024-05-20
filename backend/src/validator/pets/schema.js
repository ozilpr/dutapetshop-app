const Joi = require('joi')

const PetsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().allow(null, ''),
  race: Joi.string().allow(null, ''),
  gender: Joi.string().allow(null, ''),
  birthdate: Joi.string().allow(null, '')
})

module.exports = { PetsPayloadSchema }
