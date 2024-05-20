const autoBind = require('auto-bind')

class PetOwnerHandler {
  constructor (service) {
    this._service = service

    autoBind(this)
  }

  async addPetOwnerHandler (request, h) {
    await this._service.verifyPetOwner(request.payload)

    const petOwnerId = await this._service.addPetOwner(request.payload)

    const response = h.response({
      status: 'success',
      message: 'Pet owner berhasil ditambahkan',
      data: {
        petOwnerId
      }
    })
    response.code(201)
    return response
  }

  async getPetOwnerByOwnerIdHandler (request) {
    const { ownerId } = request.params
    const { owner, pets } = await this._service.getPetOwnerByOwnerId(ownerId)

    return {
      status: 'success',
      data: {
        id: owner.id,
        owner_id: owner.owner_id,
        owner_name: owner.owner_name,
        register_code: owner.register_code,
        pet: pets
      }
    }
  }

  async deletePetOwnerByIdHandler (request) {
    const { id } = request.params

    await this._service.deletePetOwnerById(id)

    return {
      status: 'success',
      message: 'Kepemilikan peliharaan berhasil dihapus'
    }
  }
}

module.exports = PetOwnerHandler
