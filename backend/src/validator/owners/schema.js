const Joi = require('joi')

const OwnersPayloadSchema = Joi.object({
  registerCode: Joi.string().required(),
  name: Joi.string().required(),
  phone: Joi.string()
    .allow(null, '')
    .regex(/^[0-9]{10,15}$/)
    .messages({
      'string.pattern.base': `
        "Nomor telepon" dengan nilai "{#value}"
        tidak sesuai pola yang diperlukan: harus berupa angka antara 10 hingga 15 digit.
      `
    })
})

module.exports = { OwnersPayloadSchema }
