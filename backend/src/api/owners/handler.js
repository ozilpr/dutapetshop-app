const autoBind = require('auto-bind')

class OwnersHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async addOwnerHandler (request, h) {
    await this._validator.validateOwnerPayload(request.payload)

    const ownerId = await this._service.addOwner(request.payload)

    const response = h.response({
      status: 'success',
      message: 'Owner berhasil ditambahkan',
      data: {
        ownerId
      }
    })
    response.code(201)
    return response
  }

  async getOwnersHandler () {
    const owners = await this._service.getOwners()

    return {
      status: 'success',
      data: {
        owners
      }
    }
  }

  async getOwnerByIdHandler (request) {
    const owner = await this._service.getOwnerById(request.params)

    return {
      status: 'success',
      data: {
        owner
      }
    }
  }

  async editOwnerByIdHandler (request) {
    await this._validator.validateOwnerPayload(request.payload)
    const { id } = request.params

    await this._service.editOwnerById(id, request.payload)

    return {
      status: 'success',
      message: 'Owner berhasil diperbarui'
    }
  }

  async deleteOwnerByIdHandler (request) {
    const { id } = request.params

    await this._service.deleteOwnerById(id)

    return {
      status: 'success',
      message: 'Owner berhasil dihapus'
    }
  }
}

module.exports = OwnersHandler
