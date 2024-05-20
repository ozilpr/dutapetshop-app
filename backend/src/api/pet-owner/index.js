const PetOwnerHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'pet-owner',
  version: '1.0.0',
  register: async (server, { service }) => {
    const petOwnerHandler = new PetOwnerHandler(service)
    server.route(routes(petOwnerHandler))
  }
}
