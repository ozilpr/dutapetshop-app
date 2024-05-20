const routes = (handler) => [
  {
    method: 'POST',
    path: '/owner',
    handler: handler.addOwnerHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'GET',
    path: '/owner',
    handler: handler.getOwnersHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'GET',
    path: '/owner/{id}',
    handler: handler.getOwnerByIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/owner/{id}',
    handler: handler.editOwnerByIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/owner/{id}',
    handler: handler.deleteOwnerByIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  }
]

module.exports = routes
