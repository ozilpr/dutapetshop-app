const OwnersHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'owners',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const ownersHandler = new OwnersHandler(service, validator)
    server.route(routes(ownersHandler))
  }
}
