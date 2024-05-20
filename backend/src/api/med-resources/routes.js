const routes = (handler) => [
  {
    method: 'POST',
    path: '/resource',
    handler: handler.addResourceHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'GET',
    path: '/resource',
    handler: handler.getResourcesHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'GET',
    path: '/resource/{id}',
    handler: handler.getResourceByIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/resource/{id}',
    handler: handler.editResourceByIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/resource/{id}',
    handler: handler.deleteResourceByIdHandler,
    options: {
      auth: 'dutapetshop_jwt'
    }
  }
]

module.exports = routes
