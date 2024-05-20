const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const GetLocalTime = require('../../utils/getLocalTime')

class PetsService {
  constructor () {
    this._pool = new Pool()
  }

  async addPet ({ name, type, race, gender, birthdate }) {
    try {
      const id = `pet-${nanoid(8)}`
      const createdAt = await new GetLocalTime().getDate()
      const query = {
        text: 'INSERT INTO pets VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        values: [id, name, type, race, gender, birthdate, createdAt]
      }

      const result = await this._pool.query(query)

      if (!result.rows[0].id) throw new InvariantError('Peliharaan gagal ditambahkan')

      return result.rows[0].id
    } catch (error) {
      console.log(error)
    }
  }

  async getPets () {
    try {
      const result = await this._pool.query(`
        SELECT DISTINCT
          p.id,
          p.name,
          p.type,
          p.race,
          p.gender,
          p.birthdate,
          p.created_at,
          o.id AS owner_id,
          o.name AS owner_name,
          o.register_code
        FROM
          pets p
          LEFT JOIN pet_owner po on po.pet_id = p.id
          LEFT JOIN owners o on po.owner_id = o.id
        WHERE 
          p.deleted_at IS NULL
        AND 
          o.deleted_at IS NULL
        ORDER BY
          p.name
      `)

      return result.rows
    } catch (error) {
      console.log(error)
    }
  }

  async getPetsWithoutOwner () {
    try {
      const result = await this._pool.query(`
        SELECT DISTINCT
          p.id,
          p.name,
          p.type,
          p.race,
          p.gender,
          p.birthdate,
          p.created_at,
          o.id AS owner_id,
          o.name AS owner_name,
          o.register_code
        FROM
          pets p
          LEFT JOIN pet_owner po on po.pet_id = p.id
          LEFT JOIN owners o on po.owner_id = o.id
        WHERE 
          po.owner_id IS NULL
        AND
          po.pet_id IS NULL
        AND
          o.deleted_at is null
        AND 
          p.deleted_at is null
        ORDER BY p.name
      `)

      return result.rows
    } catch (error) {
      console.log(error)
    }
  }

  async getPetById (id) {
    try {
      const query = {
        text: 'SELECT id, name, type, race, gender, birthdate, created_at FROM pets WHERE id = $1 AND deleted_at IS NULL',
        values: [id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Peliharaan tidak ditemukan')

      return result.rows[0]
    } catch (error) {
      console.log(error)
    }
  }

  async editPetById (id, { name, type, race, gender, birthdate }) {
    try {
      const updatedAt = await new GetLocalTime().getDate()
      const query = {
        text: 'UPDATE pets SET name = $1, type = $2, race = $3, gender = $4, birthdate = $5, updated_at = $6 WHERE id = $7 AND deleted_at IS NULL RETURNING id',
        values: [name, type, race, gender, birthdate, updatedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal memperbarui peliharaan. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }

  async deletePetById (id) {
    try {
      const deletedAt = await new GetLocalTime().getDate()
      const query = {
        text: 'UPDATE pets SET deleted_at = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING id',
        values: [deletedAt, id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal menghapus peliharaan. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = PetsService
