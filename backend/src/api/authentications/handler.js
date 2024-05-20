const autoBind = require('auto-bind')

class AuthenticationsHandler {
  constructor (authenticationsService, adminService, tokenManager, validator) {
    this._authenticationsService = authenticationsService
    this._adminService = adminService
    this._tokenManager = tokenManager
    this._validator = validator

    autoBind(this)
  }

  async postAuthenticationHandler (request, h) {
    await this._validator.validateAuthenticationPayload(request.payload)

    const { username, password } = request.payload
    const id = await this._adminService.verifyCredential(username, password)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    const refreshToken = this._tokenManager.generateRefreshToken({ id })

    await this._authenticationsService.addRefreshToken(refreshToken)

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async putAuthenticationHandler (request, h) {
    const { refreshToken } = request.payload
    await this._authenticationsService.verifyRefreshToken(refreshToken)
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken
      }
    }
  }

  async deleteAuthenticationHandler (request, h) {
    const { refreshToken } = request.payload
    await this._authenticationsService.verifyRefreshToken(refreshToken)
    await this._authenticationsService.deleteRefreshToken(refreshToken)

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus'
    }
  }
}

module.exports = AuthenticationsHandler
