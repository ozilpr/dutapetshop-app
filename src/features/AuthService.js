import axios from 'axios'

const AUTH_URL = 'http://localhost:5000/authentications'

const AuthService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(
        `${AUTH_URL}`,
        {
          username: username,
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      if (response.status === 201) return response.data
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  },
  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.put(
        `${AUTH_URL}`,
        {
          refreshToken: refreshToken
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      if (response.status === 200) return response.data
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  },
  logout: async (refreshToken) => {
    try {
      const response = await axios.delete(`${AUTH_URL}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        data: {
          refreshToken: refreshToken
        }
      })

      if (response.status === 200) return response.data.message
    } catch (error) {
      if (error.response) throw new Error(error.response.data.message)
    }
  }
}

export default AuthService
