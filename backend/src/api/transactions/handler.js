const autoBind = require('auto-bind')

class TransactionsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async addTransactionDetailHandler (ownerId) {
    const transactionDetailId = await this._service.addTransactionDetail(ownerId)
    return transactionDetailId
  }

  async getTransactionDetailsHandler () {
    const transactions = await this._service.getTransactionDetails()

    return {
      status: 'success',
      data: transactions
    }
  }

  async getTransactionDetailByIdHandler (request) {
    const { id } = request.params
    const transaction = await this._service.getTransactionDetailById(id)

    return {
      status: 'success',
      data: transaction
    }
  }

  async getTransactionDetailByOwnerIdHandler (request) {
    const { ownerId } = request.params
    const transaction = await this._service.getTransactionDetailByOwnerId(ownerId)

    return {
      status: 'success',
      data: transaction
    }
  }

  async editTransactionDetailByIdHandler (request) {
    const { id } = request.params

    await this._service.editTransactionDetailById(id, request.payload)

    return {
      status: 'success',
      message: 'Detail transaksi berhasil diperbarui'
    }
  }

  async deleteTransactionDetailByIdHandler (request) {
    const { id } = request.params

    await this._service.deleteTransactionDetailById(id)

    return {
      status: 'success',
      message: 'Transaksi berhasil dihapus'
    }
  }

  async addTransactionHandler (request, h) {
    await this._validator.validateTransactionPayload(request.payload)

    const { ownerId } = request.payload
    const transactionId = await this.addTransactionDetailHandler(ownerId)
    const { transactionsData } = request.payload
    const transactionDetailId = await this._service.addTransaction(transactionId, transactionsData)

    const response = h.response({
      status: 'success',
      messagge: 'Transaksi berhasil ditambahkan',
      data: {
        transactionDetailId
      }
    })
    response.code(201)
    return response
  }

  async getTransactionsHandler () {
    const transactions = await this._service.getTransactions()

    return {
      status: 'success',
      data: {
        transactions
      }
    }
  }

  async getTransactionByIdHandler (request) {
    const { id } = request.params
    const transaction = await this._service.getTransactionById(id)

    return {
      status: 'success',
      data: {
        transaction
      }
    }
  }

  async editTransactionByIdHandler (request) {
    const { id } = request.params

    await this._service.editTransactionById(id, request.payload)

    return {
      status: 'success',
      message: 'Transaksi berhasil diperbarui'
    }
  }

  async deleteTransactionByIdHandler (request) {
    const { id } = request.params

    await this._service.deleteTransactionById(id)

    return {
      status: 'success',
      message: 'Transaksi berhasil dihapus'
    }
  }
}

module.exports = TransactionsHandler
