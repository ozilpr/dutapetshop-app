const TransactionsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'transactions',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const transactionsHandler = new TransactionsHandler(service, validator)
    server.route(routes(transactionsHandler))
  }
}
