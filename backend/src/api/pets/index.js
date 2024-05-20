const PetsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'pets',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const petsHandler = new PetsHandler(service, validator)
    server.route(routes(petsHandler))
  }
}
