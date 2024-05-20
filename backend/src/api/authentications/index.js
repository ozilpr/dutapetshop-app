const AuthenticationsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'Authentications',
  version: '1.0.0',
  register: async (server, {
    authenticationsService,
    adminService,
    tokenManager,
    validator
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      adminService,
      tokenManager,
      validator
    )

    server.route(routes(authenticationsHandler))
  }
}
