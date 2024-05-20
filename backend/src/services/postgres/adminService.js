const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const bcryptjs = require('bcryptjs')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthenticationError = require('../../exceptions/AuthenticationsError')
const GetLocalTime = require('../../utils/getLocalTime')

class AdminService {
  constructor () {
    this._pool = new Pool()
  }

  async addAdmin ({ username, password, confPassword, fullname }) {
    try {
      await this.verifyPassword(password, confPassword)
      await this.verifyNewUsername(username)

      const id = `admin-${nanoid(8)}`

      const createdAt = await new GetLocalTime().getDate()

      const hashedPassword = await bcryptjs.hash(password, 10)
      const query = {
        text: 'INSERT INTO admin VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [id, username, hashedPassword, fullname, createdAt]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new InvariantError('Admin gagal ditambahkan')

      return result.rows[0].id
    } catch (error) {
      console.log(error)
    }
  }

  async getAdminById (id) {
    try {
      const query = {
        text: 'SELECT id, username, fullname, created_at FROM admin WHERE id = $1 AND deleted_at IS NULL',
        values: [id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Admin tidak ditemukan')

      return result.rows[0]
    } catch (error) {
      console.log(error)
    }
  }

  async getAdminByName ({ name }) {
    try {
      const query = {
        text: `
          SELECT
            id,
            username,
            fullname,
            created_at
          FROM
            admin
          WHERE
            (username LIKE $1
            OR fullname LIKE $1)
            AND deleted_at IS NULL
          ORDER BY
            username
        `,
        values: [`%${name}%`]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Admin tidak ditemukan')

      return result.rows
    } catch (error) {
      console.log(error)
    }
  }

  async verifyPassword (password, confPassword) {
    if (password !== confPassword) throw new InvariantError('Password dan Konfirmasi password tidak cocok')
  }

  async verifyNewUsername (username) {
    try {
      const query = {
        text: 'SELECT username FROM admin WHERE username LIKE $1 AND deleted_at IS NULL',
        values: [username]
      }

      const result = await this._pool.query(query)
      if (result.rows.length > 0) throw new InvariantError('Username sudah digunakan')
    } catch (error) {
      console.log(error)
    }
  }

  async verifyEditNewUsername (username, id) {
    try {
      const query = {
        text: 'SELECT username FROM admin WHERE username LIKE $1 AND deleted_at IS NULL',
        values: [username]
      }

      const queryFind = {
        text: 'SELECT username FROM admin WHERE id = $1 AND deleted_at IS NULL',
        values: [id]
      }

      const result = await this._pool.query(query)
      const found = await this._pool.query(queryFind)

      if (found.rows[0].username === username) {
        return true
      } else if (result.rows.length > 0) {
        throw new InvariantError('Username sudah digunakan')
      }
    } catch (error) {
      console.log(error)
    }
  }

  async verifyCredential (username, password) {
    try {
      const query = {
        text: 'SELECT id, username, password FROM admin WHERE username = $1 AND deleted_at IS NULL',
        values: [username]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new AuthenticationError('Kredensial yang Anda berikan salah')

      const { id, password: hashedPassword } = result.rows[0]

      const match = await bcryptjs.compare(password, hashedPassword)

      if (!match) throw new AuthenticationError('Kredensial yang Anda berikan salah')

      return id
    } catch (error) {
      console.log(error)
    }
  }

  async verifyEditAdmin (id, username, fullname, password) {
    try {
      const newAdmin = {}

      // Check if username, fullname, and password are provided
      if (username !== '' && username !== null) {
        newAdmin.username = username
      }

      if (fullname !== '' && fullname !== null) {
        newAdmin.fullname = fullname
      }

      if (password !== '' && password !== null) {
        const hashedPassword = await bcryptjs.hash(password, 10)
        newAdmin.password = hashedPassword
      }

      const oldAdmin = await this.getAdminById(id)

      if (!oldAdmin) throw new NotFoundError('Id admin tidak ditemukan')

      if (username === '' || username === null) {
        newAdmin.username = oldAdmin.username
      }

      if (fullname === '' || fullname === null) {
        newAdmin.fullname = oldAdmin.fullname
      }
      if (password === '' || password === null) {
        const query = {
          text: 'SELECT password FROM admin WHERE id = $1 AND deleted_at IS NULL',
          values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) throw new NotFoundError('Admin tidak ditemukan')

        newAdmin.password = result.rows[0].password
      }

      return newAdmin
    } catch (error) {
      console.log(error)
    }
  }

  async editAdminById (id, { username, password, confPassword, fullname }) {
    try {
      await this.verifyPassword(password, confPassword)
      await this.verifyEditNewUsername(username, id)
      const newAdmin = await this.verifyEditAdmin(id, username, fullname, password)

      const updatedAt = await new GetLocalTime().getDate()

      const query = {
        text: 'UPDATE admin SET username = $1, password = $2, fullname = $3, updated_at = $4 WHERE id = $5 AND deleted_at IS NULL RETURNING id',
        values: [newAdmin.username, newAdmin.password, newAdmin.fullname, updatedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal memperbarui admin. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }

  async deleteAdminById (id) {
    try {
      const deletedAt = await new GetLocalTime().getDate()
      const query = {
        text: 'UPDATE admin SET deleted_at = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING id',
        values: [deletedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal menghapus admin. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = AdminService
