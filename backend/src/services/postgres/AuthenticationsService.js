const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')

class AuthenticationsService {
  constructor () {
    this._pool = new Pool()
  }

  async addRefreshToken (token) {
    try {
      const query = {
        text: 'INSERT INTO authentications VALUES($1)',
        values: [token]
      }

      await this._pool.query(query)
    } catch (error) {
      console.log(error)
    }
  }

  async verifyRefreshToken (token) {
    try {
      const query = {
        text: 'SELECT token FROM authentications WHERE token = $1',
        values: [token]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new InvariantError('Refresh token tidak valid')
    } catch (error) {
      console.log(error)
    }
  }

  async deleteRefreshToken (token) {
    try {
      const query = {
        text: 'DELETE FROM authentications WHERE token = $1',
        values: [token]
      }

      await this._pool.query(query)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = AuthenticationsService
