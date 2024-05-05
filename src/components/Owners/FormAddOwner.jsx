import React, { useState } from 'react'
import OwnersService from '../../features/OwnersService'
import { Link } from 'react-router-dom'
import { useAuth } from '../Authentications/Authentication'

const FormAddOwner = () => {
  const { accessToken } = useAuth()
  const [registerCode, setRegisterCode] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  // message
  const [msg, setMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Function to set message and clear after delay
  const setMessageWithDelay = (message, delay) => {
    setMsg(message)

    setTimeout(() => {
      setMsg('')
    }, delay)
  }

  async function saveData(e) {
    e.preventDefault()
    try {
      const response = await OwnersService.addOwner(accessToken, {
        registerCode: registerCode,
        name: name,
        phone: phone
      })

      setMessageWithDelay(response.message, 3000)

      setRegisterCode('')
      setName('')
      setPhone('')
    } catch (error) {
      setErrorMsg(`Owner ${error}`)
    }
  }

  const setNameHandler = async (name) => {
    if (name) {
      const regex = /^[\w\s'’\-()]+$/i
      if (name === '' || regex.test(name)) {
        const newValue = name
          .split(' ')
          .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          })
          .join(' ')

        setName(newValue)
      }
    } else {
      setName(name)
    }
  }

  const setPhoneHandler = async (numbers) => {
    if (numbers) {
      const regex = /^[0-9]{10,15}$/
      regex.test(numbers)
      setPhone(numbers)
    } else {
      setPhone(numbers)
    }
  }

  const setCode = async (code) => {
    if (code) {
      const newValue = code.toUpperCase()
      setRegisterCode(newValue)
    } else {
      setRegisterCode(code)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen mt-2 bg-gray-100 ">
      <div className="w-full sm:px-16 px-4 py-4 overflow-hidden bg-white rounded-lg lg:max-w-4xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold decoration-gray-400">Tambah Pemilik Baru</h1>
        </div>
        <div className="w-full px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <form name="userForm" autoComplete="off" onSubmit={saveData}>
            <p className="text-center text-md text-red-500">{errorMsg}</p>
            <p className="text-center text-md text-green-500">{msg}</p>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">
                Kode Registrasi
              </label>
              <input
                name="registerCode"
                className="p-2 block w-full mt-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Kode Registrasi"
                value={registerCode}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">Nama</label>

              <input
                className="p-2 block w-full my-1 bg-gray-200 border-gray-400 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setNameHandler(e.target.value)}
                placeholder="Nama Pemilik"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">No. Telp</label>

              <input
                className="p-2 block w-full my-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="number"
                pattern="[0-9]"
                name="phone"
                value={phone}
                onChange={(e) => setPhoneHandler(e.target.value)}
                placeholder="Nomor Telepon"
              />
            </div>

            <div className="flex items-center justify-start mt-4 gap-x-2">
              <button
                type="submit"
                className="px-6 py-2 mr-1 text-sm font-semibold rounded-md shadow-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
                Simpan
              </button>
              <Link to={'/owners'} className="mr-4 my-1">
                <button
                  type="button"
                  className="px-6 py-2 ml-1 text-sm font-semibold text-white bg-gray-400 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
                  Kembali
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormAddOwner
