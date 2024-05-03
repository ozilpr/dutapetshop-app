import React, { useEffect, useState } from 'react'
import AdminService from '../../features/AdminService'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FormEditAdmin = () => {
  const [data, setData] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  const [fullname, setFullname] = useState('')
  const [searchParams] = useSearchParams()
  const adminId = searchParams.get('adminId')
  const nav = useNavigate()

  // error message
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await AdminService.getAdminById(adminId)
      setData(response.data.admin)
    }
    fetchData()
  }, [adminId])

  async function saveData(e) {
    e.preventDefault()
    try {
      await AdminService.updateAdminById(adminId, {
        username: username,
        password: password,
        confPassword: confPassword,
        fullname: fullname
      })
      nav('/admin')
    } catch (error) {
      setMsg(`Admin ${error}`)
    }
  }

  const setFullnameHandler = async (fullname) => {
    if (fullname) {
      const regex = /^[A-Za-z ]+$/
      if (fullname === '' || regex.test(fullname)) {
        const newValue = fullname
          .split(' ')
          .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          })
          .join(' ')

        setFullname(newValue)
      }
    } else {
      setFullname(username)
    }
  }

  const showPassword = () => {
    let pw = document.getElementById('password')
    if (pw.type === 'password') {
      pw.type = 'text'
    } else {
      pw.type = 'password'
    }
  }
  const showConfPassword = () => {
    let pw = document.getElementById('confPassword')
    if (pw.type === 'password') {
      pw.type = 'text'
    } else {
      pw.type = 'password'
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-6 bg-gray-100 sm:justify-center sm:pt-0">
      <div className="w-full sm:px-16 px-4 py-10 my-6 overflow-hidden bg-white rounded-lg lg:max-w-4xl">
        <div className="mb-4">
          <h1 className=" text-2xl font-bold decoration-gray-400">Update Admin</h1>
        </div>
        <div className="w-full px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <form name="userForm" autoComplete="off" onSubmit={saveData}>
            <p className="text-center text-xs text-red-500">{msg}</p>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>

              <input
                className="p-2 block w-full my-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="text"
                name="fullname"
                value={fullname}
                onChange={(e) => setFullnameHandler(e.target.value)}
                placeholder={data.fullname}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">Username</label>

              <input
                className="p-2 block w-full my-1 bg-gray-200 border-gray-400 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={data.username}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input
                id="password"
                className="p-2 block w-full my-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="password"
                name="userName"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <input type="checkbox" className="inline" onClick={() => showPassword()} />
              <p className="inline items-center text-sm font-thin text-gray-700 mb-1 ml-1">
                Show Password
              </p>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Konfirmasi Password
              </label>

              <input
                id="confPassword"
                className="p-2 block w-full my-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="password"
                name="confPassword"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="Konfirmasi Password"
              />
              <input type="checkbox" className="inline" onClick={() => showConfPassword()} />
              <p className="inline items-center text-sm font-thin text-gray-700 mb-1 ml-1">
                Show Password
              </p>
            </div>

            <div className="flex items-center justify-start mt-4 gap-x-2">
              <button
                type="submit"
                className="px-6 py-2 mr-1 text-sm font-semibold rounded-md shadow-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
                Ubah
              </button>
              <button
                onClick={() => nav(-1)}
                className="px-6 py-2 ml-1 mr-4 my-1 text-sm font-semibold text-white bg-gray-400 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
                Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormEditAdmin
