const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const GetLocalTime = require('../../utils/getLocalTime')

class PetOwnerService {
  constructor () {
    this._pool = new Pool()
  }

  async verifyPetOwner ({ ownerId, petId }) {
    try {
      const query = {
        text: 'SELECT owner_id, pet_id FROM pet_owner WHERE owner_id = $1 AND pet_id = $2',
        values: [ownerId, petId]
      }

      const result = await this._pool.query(query)

      if (result.rows.length) throw new InvariantError('Peliharaan sudah ditambahkan')
    } catch (error) {
      console.log(error)
    }
  }

  async addPetOwner ({ ownerId, petId }) {
    try {
      const id = `powner-${nanoid(8)}`
      const createdAt = await new GetLocalTime().getDate()

      const query = {
        text: 'INSERT INTO pet_owner VALUES($1, $2, $3, $4) RETURNING id',
        values: [id, ownerId, petId, createdAt]
      }

      const result = await this._pool.query(query)

      if (!result.rows[0].id) throw InvariantError('Kepemilikan peliharaan gagal ditambahkan')

      return result.rows[0]
    } catch (error) {
      console.log(error)
    }
  }

  async getPetOwnerByOwnerId (ownerId) {
    try {
      const queryOwner = {
        text: `
          SELECT DISTINCT
            po.owner_id,
            o.name AS owner_name,
            o.register_code
          FROM
            pet_owner po
            INNER JOIN owners o ON po.owner_id = o.id
            INNER JOIN pets p ON po.pet_id = p.id
          WHERE
            po.owner_id = $1
          AND
            o.deleted_at IS NULL
          AND
            p.deleted_at IS NULL
        `,
        values: [ownerId]
      }

      const queryPet = {
        text: `
          SELECT DISTINCT
            po.id,
            po.pet_id,
            p.name AS pet_name
          FROM
            pet_owner po
            INNER JOIN owners o ON po.owner_id = o.id
            INNER JOIN pets p ON po.pet_id = p.id
          WHERE
            po.owner_id = $1
          AND
            o.deleted_at IS NULL
          AND
            p.deleted_at IS NULL
        `,
        values: [ownerId]
      }

      const resultOwner = await this._pool.query(queryOwner)

      if (!resultOwner.rows.length) throw new NotFoundError('Owner belum memiliki peliharaan')

      const resultPet = await this._pool.query(queryPet)

      return ({
        owner: resultOwner.rows[0],
        pets: resultPet.rows
      })
    } catch (error) {
      console.log(error)
    }
  }

  async deletePetOwnerById (id) {
    try {
      const query = {
        text: 'DELETE FROM pet_owner WHERE id = $1 AND deleted_at IS NULL RETURNING id',
        values: [id]
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) throw new NotFoundError('Gagal menghapus kepemilikan peliharaan. Id tidak ditemukan')
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = PetOwnerService
