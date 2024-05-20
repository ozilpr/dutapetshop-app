const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const GetLocalTime = require('../../utils/getLocalTime')

class OwnersService {
  constructor () {
    this._pool = new Pool()
  }

  async verifyRegisterCode (registerCode) {
    try {
      const query = {
        text: 'SELECT register_code FROM owners WHERE register_code LIKE $1 AND deleted_at IS NULL',
        values: [registerCode]
      }

      const result = await this._pool.query(query)

      if (result.rows.length > 0) throw new InvariantError('Kode Register sudah digunakan')
    } catch (error) {
      console.log(error)
    }
  }

  async verifyEditRegisterCode (id, registerCode) {
    try {
      const query = {
        text: 'SELECT register_code FROM owners WHERE register_code LIKE $1 AND deleted_at IS NULL',
        values: [registerCode]
      }

      const queryFind = {
        text: 'SELECT register_code FROM owners WHERE id = $1 AND deleted_at IS NULL',
        values: [id]
      }

      const result = await this._pool.query(query)
      const found = await this._pool.query(queryFind)

      if (found.rows[0].register_code === registerCode) {
        return true
      } else if (result.rows.length > 0) {
        throw new InvariantError('Kode Register sudah digunakan')
      }
    } catch (error) {
      console.log(error)
    }
  }

  async addOwner ({ registerCode, name, phone }) {
    try {
      await this.verifyRegisterCode(registerCode)
      const id = `owner-${nanoid(8)}`
      const createdAt = await new GetLocalTime().getDate()

      const query = {
        text: 'INSERT INTO owners VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [id, registerCode, name, phone, createdAt]
      }

      const result = await this._pool.query(query)

      if (!result.rows[0].id) throw new InvariantError('Owner gagal ditambahkan')

      return result.rows[0].id
    } catch (error) {
      console.log(error)
    }
  }

  async getOwners () {
    try {
      const result = await this._pool.query(`
        SELECT
          id,
          register_code,
          name,
          phone,
          created_at
        FROM
          owners
        WHERE
          deleted_at IS NULL
        ORDER BY
          register_code
      `)

      return result.rows
    } catch (error) {
      console.log(error)
    }
  }

  async getOwnerById ({ id }) {
    try {
      const query = {
        text: 'SELECT id, register_code, name, phone, created_at FROM owners WHERE id = $1 AND deleted_at IS NULL',
        values: [id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Owner tidak ditemukan')

      return result.rows[0]
    } catch (error) {
      console.log(error)
    }
  }

  async editOwnerById (id, { registerCode, name, phone }) {
    try {
      await this.verifyEditRegisterCode(id, registerCode)
      const updatedAt = await new GetLocalTime().getDate()
      const query = {
        text: `
          UPDATE
            owners
          SET
            register_code = $1,
            name = $2,
            phone = $3,
            updated_at = $4
          WHERE
            id = $5
          AND
            deleted_at IS NULL
          RETURNING id
        `,
        values: [registerCode, name, phone, updatedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal memperbarui owner. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }

  async deleteOwnerById (id) {
    try {
      const deletedAt = await new GetLocalTime().getDate()
      const query = {
        text: 'UPDATE owners SET deleted_at = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING id',
        values: [deletedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal menghapus owner. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = OwnersService
