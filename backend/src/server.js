require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const ClientError = require('./exceptions/ClientError')

// medical resources
const medresources = require('./api/med-resources')
const MedResourcesService = require('./services/postgres/MedResourcesService')
const MedResourcesValidator = require('./validator/med-resources')

// owners
const owners = require('./api/owners')
const OwnersService = require('./services/postgres/OwnersService')
const OwnersValidator = require('./validator/owners')

// pets
const pets = require('./api/pets')
const PetsService = require('./services/postgres/PetsService')
const PetsValidator = require('./validator/pets')

// admin
const admin = require('./api/admin')
const AdminService = require('./services/postgres/AdminService')
const AdminValidator = require('./validator/admin')

// authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

// transactions
const transactions = require('./api/transactions')
const TransactionsService = require('./services/postgres/TransactionsService')
const TransactionsValidator = require('./validator/transactions')

// pet owner
const petOwner = require('./api/pet-owner')
const PetOwnerService = require('./services/postgres/PetOwnerService')

const init = async () => {
  const resourcesService = new MedResourcesService()
  const ownersService = new OwnersService()
  const petsService = new PetsService()
  const adminService = new AdminService()
  const authenticationsService = new AuthenticationsService()
  const transactionsService = new TransactionsService()
  const petOwnerService = new PetOwnerService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: Jwt
    }
  ])

  server.auth.strategy('dutapetshop_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: false
  })

  await server.register([
    {
      plugin: authentications,
      options: {
        authenticationsService,
        adminService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    },
    {
      plugin: medresources,
      options: {
        service: resourcesService,
        validator: MedResourcesValidator
      }
    },
    {
      plugin: owners,
      options: {
        service: ownersService,
        validator: OwnersValidator
      }
    },
    {
      plugin: pets,
      options: {
        service: petsService,
        validator: PetsValidator
      }
    },
    {
      plugin: admin,
      options: {
        service: adminService,
        validator: AdminValidator
      }
    },
    {
      plugin: transactions,
      options: {
        service: transactionsService,
        validator: TransactionsValidator
      }
    },
    {
      plugin: petOwner,
      options: {
        service: petOwnerService
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      newResponse.code(500)
      return newResponse
    }
    return h.continue
  })

  await server.start()
  console.log(`server berjalan pada ${server.info.uri}`)
}

init()
