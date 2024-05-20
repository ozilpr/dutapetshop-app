import axios from 'axios'

const RESC_URL = 'http://localhost:5000/resource'

const ResourcesService = {
  addResource: async (accessToken, { name, description, type, price }) => {
    try {
      const response = await axios.post(
        `${RESC_URL}`,
        {
          name: name,
          description: description,
          type: type,
          price: price
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
  getResources: async (accessToken) => {
    try {
      const response = await axios.get(`${RESC_URL}`, {
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
  getResourceById: async (accessToken, id) => {
    try {
      const response = await axios.get(`${RESC_URL}/${id}`, {
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
  updateResourceById: async (accessToken, id, { name, description, type, price }) => {
    try {
      const response = await axios.put(
        `${RESC_URL}/${id}`,
        {
          name: name,
          description: description,
          type: type,
          price: price
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (response.status === 200) return response.data
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  },
  deleteResourceById: async (accessToken, id) => {
    try {
      const response = await axios.delete(`${RESC_URL}/${id}`, {
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

export default ResourcesService
