import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../components/Authentications/Authentication'

const PrivateRoute = () => {
  const user = useAuth()
  if (!user.accessToken) return <Navigate to="/" />
  return <Outlet />
}

export default PrivateRoute
