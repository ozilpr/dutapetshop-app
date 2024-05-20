const routes = (handler) => [
  {
    method: 'POST',
    path: '/pet',
    handler: handler.addPetHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'GET',
    path: '/pet',
    handler: handler.getPetsHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'GET',
    path: '/pet/without-owner',
    handler: handler.getPetsWithoutOwnerHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'GET',
    path: '/pet/{id}',
    handler: handler.getPetByIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/pet/{id}',
    handler: handler.editPetByIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/pet/{id}',
    handler: handler.deletePetByIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  }
]

module.exports = routes
