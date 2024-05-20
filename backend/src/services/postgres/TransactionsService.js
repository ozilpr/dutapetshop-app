const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const GetLocalTime = require('../../utils/getLocalTime')

class TransactionsService {
  constructor () {
    this._pool = new Pool()
  }

  async addTransactionDetail (ownerId) {
    const id = `transaction-${nanoid(8)}`
    const transactionDate = await new GetLocalTime().getDate()
    const client = await this._pool.connect()

    try {
      await client.query('BEGIN')

      const query = {
        text: 'INSERT INTO transaction_details VALUES($1, $2, $3) RETURNING id',
        values: [id, ownerId, transactionDate]
      }

      const result = await client.query(query)

      if (!result.rows[0].id) throw new InvariantError('Detail transaksi gagal ditambahkan')

      await client.query('COMMIT')
      return result.rows[0].id
    } catch (error) {
      await client.query('ROLLBACK')
      console.log(error)
      throw new InvariantError('Detail transaksi gagal ditambahkan: ', error)
    } finally {
      client.release()
    }
  }

  async getResourcePriceByResourceId (resourceId) {
    try {
      const query = {
        text: 'SELECT price FROM med_resources WHERE id = $1 AND deleted_at IS NULL',
        values: [resourceId]
      }

      const result = await this._pool.query(query)

      if (!result.rows[0].price) throw new NotFoundError('Resource id tidak ditemukan')

      return result.rows[0].price
    } catch (error) {
      console.log(error)
    }
  }

  async getTransactionDetails () {
    try {
      const transactionDetailResult = await this._pool.query(`
        SELECT DISTINCT
          td.id,
          o.id AS owner_id,
          o.name AS owner_name,
          o.register_code,
          td.transaction_date,
          td.updated_at
        FROM
          transaction_details td
          INNER JOIN transactions t ON td.id = t.transaction_id
          INNER JOIN med_resources r ON t.resource_id = r.id
          INNER JOIN owners o ON td.owner_id = o.id
        WHERE 
          td.deleted_at IS NULL
          AND t.deleted_at IS NULL
        ORDER BY
          td.transaction_date
        DESC
      `)

      const transactionsResult = await this._pool.query(`
        SELECT DISTINCT
          t.id,
          t.transaction_id,
          r.name AS resource_name,
          t.quantity,
          t.price
        FROM
          transaction_details td
          INNER JOIN transactions t ON td.id = t.transaction_id
          INNER JOIN med_resources r ON t.resource_id = r.id
          INNER JOIN owners o ON td.owner_id = o.id
        WHERE
          td.deleted_at IS NULL
          AND t.deleted_at IS NULL
        ORDER BY
          r.name
      `)

      const data = transactionDetailResult.rows.map(transactionDetail => {
        const transactions = transactionsResult.rows.filter(transaction => transaction.transaction_id === transactionDetail.id)
        return {
          transaction_id: transactionDetail.id,
          owner_id: transactionDetail.owner_id,
          owner_name: transactionDetail.owner_name,
          register_code: transactionDetail.register_code,
          transaction_date: transactionDetail.transaction_date,
          transactions: transactions.map(transaction => ({
            id: transaction.id,
            resource_name: transaction.resource_name,
            quantity: transaction.quantity,
            price: transaction.price
          }))
        }
      })
      return data
    } catch (error) {
      console.log(error)
    }
  }

  async getTransactionDetailById (id) {
    try {
      const queryTransactionDetail = {
        text: `
          SELECT DISTINCT
            td.id,
            o.id AS owner_id,
            o.name AS owner_name,
            o.register_code,
            td.transaction_date,
            td.updated_at
          FROM
            transaction_details td
            INNER JOIN transactions t ON td.id = t.transaction_id
            INNER JOIN med_resources r ON t.resource_id = r.id
            INNER JOIN owners o ON td.owner_id = o.id
          WHERE
            td.id = $1 
            AND td.deleted_at IS NULL
            AND t.deleted_at IS NULL
          ORDER BY
            td.transaction_date
        `,
        values: [id]
      }

      const queryTransactions = {
        text: `
          SELECT DISTINCT
            t.id,
            t.transaction_id,
            r.name AS resource_name, 
            t.quantity,
            t.price
          FROM
            transaction_details td
            INNER JOIN transactions t ON td.id = t.transaction_id
            INNER JOIN med_resources r ON t.resource_id = r.id
            INNER JOIN owners o ON td.owner_id = o.id
          WHERE
            td.id = $1
            AND td.deleted_at IS NULL 
            AND t.deleted_at IS NULL
          ORDER BY
            r.name
        `,
        values: [id]
      }

      const transactionDetailResult = await this._pool.query(queryTransactionDetail)

      if (!transactionDetailResult.rows.length) throw new NotFoundError('Transaksi tidak ditemukan')

      const transactionResult = await this._pool.query(queryTransactions)

      const data = transactionDetailResult.rows.map(transactionDetail => {
        const transactions = transactionResult.rows.filter(transaction => transaction.transaction_id === transactionDetail.id)
        return {
          transaction_id: transactionDetail.id,
          owner_id: transactionDetail.owner_id,
          owner_name: transactionDetail.owner_name,
          register_code: transactionDetail.register_code,
          transaction_date: transactionDetail.transaction_date,
          transactions: transactions.map(transaction => ({
            id: transaction.id,
            resource_name: transaction.resource_name,
            quantity: transaction.quantity,
            price: transaction.price
          }))
        }
      })

      return data[0]
    } catch (error) {
      console.log(error)
    }
  }

  async getTransactionDetailByOwnerId (ownerId) {
    try {
      const queryOwner = {
        text: `
          SELECT
            id AS owner_id,
            name AS owner_name,
            register_code
          FROM
            owners 
          WHERE
            id = $1
        `,
        values: [ownerId]
      }
      const queryTransactions = {
        text: `
          SELECT DISTINCT
            td.id,
            td.transaction_date,
            td.updated_at,
            t.id,
            t.transaction_id,
            r.name AS resource_name, 
            t.quantity,
            t.price
          FROM
            transaction_details td
            INNER JOIN transactions t ON td.id = t.transaction_id
            INNER JOIN med_resources r ON t.resource_id = r.id
            INNER JOIN owners o ON td.owner_id = o.id
          WHERE
            td.owner_id = $1
            AND td.deleted_at IS NULL 
            AND t.deleted_at IS NULL
          ORDER BY
            r.name
        `,
        values: [ownerId]
      }

      const ownerResult = await this._pool.query(queryOwner)

      const transactionResult = await this._pool.query(queryTransactions)

      return ({
        owner: ownerResult.rows,
        transactions: transactionResult.rows
      })
    } catch (error) {
      console.log(error)
    }
  }

  async editTransactionDetailById (id, { ownerId }) {
    try {
      const updatedAt = await new GetLocalTime().getDate()
      const query = {
        text: `
          UPDATE
            transaction_details
          SET
            owner_id = $1,
            updated_at = $2
          WHERE
            id = $3
            AND deleted_at IS NULL
          RETURNING id
        `,
        values: [ownerId, updatedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal memperbarui detail transaksi. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }

  async deleteTransactionDetailById (id) {
    try {
      const deletedAt = await new GetLocalTime().getDate()
      const queryTransactions = {
        text: `
          UPDATE
            transactions
          SET
            deleted_at = $1
          WHERE
            transaction_id = $2
            AND deleted_at IS NULL
          RETURNING id
        `,
        values: [deletedAt, id]
      }

      const resultTransaction = await this._pool.query(queryTransactions)

      if (!resultTransaction.rows.length) throw new NotFoundError('Gagal menghapus transaksi. Id tidak ditemukan')

      const queryTransactionDetail = {
        text: `
          UPDATE
            transaction_details
          SET
            deleted_at = $1
          WHERE
            id = $2
            AND deleted_at IS NULL
          RETURNING id
        `,
        values: [deletedAt, id]
      }
      const resultTransDetail = await this._pool.query(queryTransactionDetail)

      if (!resultTransDetail.rows.length) throw new NotFoundError('Gagal menghapus detail transaksi. Id tidak ditemukan.')
    } catch (error) {
      console.log(error)
    }
  }

  async addTransaction (transactionId, transactionsData) {
    const createdAt = await new GetLocalTime().getDate()
    const client = await this._pool.connect()

    let iterationCount = 0

    const transactionItems = []

    try {
      await client.query('BEGIN')

      for (const transaction of transactionsData) {
        const price = await this.getResourcePriceByResourceId(transaction.resourceId)

        const id = `trans_item-${nanoid(8)}`
        const query = {
          text: 'INSERT INTO transactions VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
          values: [id, transactionId, transaction.resourceId, transaction.quantity, price, createdAt]
        }

        const result = await client.query(query)
        iterationCount++

        if (!result.rows[0].id) throw new InvariantError(`Transaksi ke: ${iterationCount},gagal ditambahkan`)

        transactionItems.push({ trans_item: result.rows[0].id })
      }
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error adding transactions: ', error)
      throw new InvariantError('Transaksi gagal ditambahkan')
    } finally {
      client.release()
    }
    return { transactionId, transactionItems }
  }

  async getTransactions () {
    try {
      const result = await this._pool.query(`
        SELECT
          t.id,
          t.transaction_id,
          t.resource_id,
          r.name AS resource_name,
          t.quantity,
          t.price,
          t.created_at,
          t.updated_at
        FROM
          transactions t
          INNER JOIN med_resources r ON t.resource_id = r.id
        WHERE
          t.deleted_at IS NULL
          AND r.deleted_at IS NULL
        ORDER BY
          t.created_at
        `)

      return result.rows
    } catch (error) {
      console.log(error)
    }
  }

  async editTransactionById (id, { resourceId, quantity }) {
    try {
      const price = await this.getResourcePriceByResourceId(resourceId)

      const updatedAt = await new GetLocalTime().getDate()

      const query = {
        text: `
          UPDATE
            transactions
          SET 
            resource_id = $1,
            quantity = $2,
            price = $3,
            updated_at = $4
          WHERE
            id = $5
            AND deleted_at IS NULL
          RETURNING id
        `,
        values: [resourceId, quantity, price, updatedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal memperbarui Transaksi. Id transaksi tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }

  async deleteTransactionById (id) {
    try {
      const deletedAt = await new GetLocalTime().getDate()
      const query = {
        text: `
          UPDATE
            transactions
          SET
            deleted_at = $1
          WHERE
            id = $2
            AND deleted_at IS NULL
          RETURNING id
        `,
        values: [deletedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal menghapus transaksi. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = TransactionsService
