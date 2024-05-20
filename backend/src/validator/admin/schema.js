const Joi = require('joi')

const AdminPayloadSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': '"Username" tidak boleh kosong'
  }),
  password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/).messages({
    'string.pattern.base': '"Password" dengan nilai "{#value}" tidak sesuai pola yang diperlukan: hanya huruf dan angka, 3-30 karakter.',
    'any.required': '"Password" tidak boleh kosong'
  }),
  confPassword: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/).messages({
    'string.pattern.base': '"Konfirmasi Password" dengan nilai "{#value}" tidak sesuai pola yang diperlukan: hanya huruf dan angka, 3-30 karakter.',
    'any.required': '"Konfirmasi Password" tidak boleh kosong'
  }),
  fullname: Joi.string().required().messages({
    'any.required': '"Nama lengkap" tidak boleh kosong'
  })
})

const UpdateAdminPayloadSchema = Joi.object({
  username: Joi.string().allow(null, '').messages({
    'string.empty': '"Username" tidak boleh kosong'
  }),
  password: Joi.string().allow(null, '').pattern(/^[a-zA-Z0-9]{3,30}$/).messages({
    'string.pattern.base': '"Password" dengan nilai "{#value}" tidak sesuai pola yang diperlukan: hanya huruf dan angka, 3-30 karakter.'
  }),
  confPassword: Joi.string().allow(null, '').pattern(/^[a-zA-Z0-9]{3,30}$/).messages({
    'string.pattern.base': '"Password" dengan nilai "{#value}" tidak sesuai pola yang diperlukan: hanya huruf dan angka, 3-30 karakter.'
  }),
  fullname: Joi.string().allow(null, '').messages({
    'string.empty': '"Nama lengkap" tidak boleh kosong'
  })
})

module.exports = { AdminPayloadSchema, UpdateAdminPayloadSchema }
