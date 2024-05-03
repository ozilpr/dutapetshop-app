import axios from 'axios'

const PET_OWN_URL = 'http://localhost:5000/pet-owner'

const PetOwnerService = {
  addPetOwner: async (accessToken, { ownerId, petId }) => {
    try {
      const response = await axios.post(
        `${PET_OWN_URL}`,
        {
          ownerId: ownerId,
          petId: petId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (response.status === 201) return response.data
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  },
  getPetOwnerByOwnerId: async (accessToken, ownerId) => {
    try {
      const response = await axios.get(`${PET_OWN_URL}/${ownerId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (response.status === 200) return response.data
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  },
  deletePetOwnerById: async (accessToken, id) => {
    try {
      const response = await axios.delete(`${PET_OWN_URL}/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (response.status === 200) return response.data.message
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  }
}

export default PetOwnerService
