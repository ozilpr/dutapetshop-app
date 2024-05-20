const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const GetLocalTime = require('../../utils/getLocalTime')

class MedResourcesService {
  constructor () {
    this._pool = new Pool()
  }

  async addResource ({ name, description, type, price }) {
    try {
      const id = `resource-${nanoid(8)}`
      const date = await new GetLocalTime().getDate()

      const query = {
        text: 'INSERT INTO med_resources VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
        values: [id, name, description, type, price, date]
      }

      const result = await this._pool.query(query)

      if (!result.rows[0].id) throw new InvariantError('Resource gagal ditambahkan')

      return result.rows[0].id
    } catch (error) {
      console.log(error)
    }
  }

  async getResources () {
    try {
      const result = await this._pool.query(`
        SELECT id, name, description, type, price, created_at
        FROM med_resources
        WHERE deleted_at IS NULL
        ORDER BY name
      `)

      return result.rows
    } catch (error) {
      console.log(error)
    }
  }

  async getResourceById (id) {
    try {
      const query = {
        text: 'SELECT id, name, description, type, price, created_at FROM med_resources WHERE id = $1 AND deleted_at IS NULL',
        values: [id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Resource tidak ditemukan')

      return result.rows[0]
    } catch (error) {
      console.log(error)
    }
  }

  async editResourceById (id, { name, description, type, price }) {
    try {
      const updatedAt = await new GetLocalTime().getDate()
      const query = {
        text: 'UPDATE med_resources SET name = $1, description = $2, type = $3, price = $4, updated_at = $5 WHERE id = $6 AND deleted_at IS NULL RETURNING id',
        values: [name, description, type, price, updatedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal memperbarui resource. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }

  async deleteResourceById (id) {
    try {
      const deletedAt = await new GetLocalTime().getDate()
      const query = {
        text: 'UPDATE med_resources set deleted_at = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING id',
        values: [deletedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal menghapus resource. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = MedResourcesService
