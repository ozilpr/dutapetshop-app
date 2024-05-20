// AuthenticationContext.js
import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '../../features/AuthService'
import PropTypes from 'prop-types'

const AuthenticationContext = createContext()

export const useAuth = () => useContext(AuthenticationContext)

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'))
  const navigate = useNavigate()

  const loggedIn = async (username, password) => {
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      return await login(username, password)
    }

    try {
      return await refreshAccessToken(refreshToken)
    } catch (error) {
      console.log(error)
      return login(username, password)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await AuthService.login(username, password)
      setAccessToken(response.data.accessToken)
      setRefreshToken(response.data.refreshToken)
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      navigate('/dashboard')
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout(refreshToken)
      setAccessToken(null)
      setRefreshToken(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error.message)
      throw new Error(error.message)
    }
  }

  const refreshAccessToken = async () => {
    try {
      const { data } = await AuthService.refreshToken(refreshToken)
      setAccessToken(data.accessToken)
      localStorage.setItem('accessToken', data.accessToken)
      navigate('/dashboard')
    } catch (error) {
      console.error('Token refresh failed:', error.message)
      throw new Error(error.message)
    }
  }

  return (
    <AuthenticationContext.Provider
      value={{ accessToken, loggedIn, login, logout, refreshAccessToken }}>
      {children}
    </AuthenticationContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}
