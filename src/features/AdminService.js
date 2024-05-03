import axios from 'axios'

const ADM_URL = 'http://localhost:5000/admin'

const AdminService = {
  addAdmin: async ({ username, password, confPassword, fullname }) => {
    try {
      const response = await axios.post(
        `${ADM_URL}`,
        {
          username: username,
          password: password,
          confPassword: confPassword,
          fullname: fullname
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      if (response.status === 201) return response.data.message
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  },
  getAdminById: async (id) => {
    try {
      const response = await axios.get(`${ADM_URL}/${id}`, {
        headers: {
          Accept: 'application/json'
        }
      })

      if (response.status === 200) return response.data
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  },
  getAdminByName: async (name) => {
    try {
      const response = await axios.get(`${ADM_URL}?name=${name}`, {
        headers: {
          Accept: 'application/json'
        }
      })

      if (response.status === 200) return response.data
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message)
      }
    }
  },
  updateAdminById: async (id, { username, password, confPassword, fullname }) => {
    try {
      const response = await axios.put(
        `${ADM_URL}/${id}`,
        {
          username: username,
          password: password,
          confPassword: confPassword,
          fullname: fullname
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      if (response.status === 200) console.log(response.data.message)
      return response.data
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  },
  deleteAdminById: async (id) => {
    try {
      const response = await axios.delete(`${ADM_URL}/${id}`, {
        headers: {
          Accept: 'application/json'
        }
      })

      if (response.status === 200) return response.data.message
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  }
}

export default AdminService
