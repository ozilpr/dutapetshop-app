const routes = (handler) => [
  {
    method: 'POST',
    path: '/pet-owner',
    handler: handler.addPetOwnerHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'GET',
    path: '/pet-owner/{ownerId}',
    handler: handler.getPetOwnerByOwnerIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/pet-owner/{id}',
    handler: handler.deletePetOwnerByIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  }
]

module.exports = routes
