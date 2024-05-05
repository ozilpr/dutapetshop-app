import React, { useState } from 'react'
import ResourcesService from '../../features/ResourcesService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Authentications/Authentication'

const FormAddResource = () => {
  const { accessToken } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [price, setPrice] = useState('0')
  const [count, setCount] = useState(0)
  const nav = useNavigate()

  // error message
  const [errorMsg, setErrorMsg] = useState('')
  const [msg, setMsg] = useState('')

  // Function to set message and clear after delay
  const setMessageWithDelay = (message, delay) => {
    setMsg(message) // Set message to 'succeed'

    setTimeout(() => {
      setMsg('') // Clear message after delay
    }, delay)
  }

  async function saveData(e) {
    e.preventDefault()
    try {
      const response = await ResourcesService.addResource(accessToken, {
        name: name,
        description: description,
        type: type,
        price: price
      })
      setMessageWithDelay(response.message, 3000)
      setName('')
      setType('')
      setDescription('')
      setPrice('0')
      setCount(0)

      // nav('/resources')
    } catch (error) {
      if (error.response) {
        setErrorMsg(`Resource ${error}`)
      }
    }
  }

  const setNameHandler = async (name) => {
    // if (name) {
    //   const regex = /^[\w\s'’\-()]+$/i
    //   if (name === '' || regex.test(name)) {
    //     const newValue = name
    //       .split(' ')
    //       .map((word) => {
    //         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    //       })
    //       .join(' ')

    //     setName(newValue)
    //   }
    // } else {
    setName(name)
    // }
  }

  const setDescriptionHandler = (value) => {
    const { length } = value
    setCount(length)
    setDescription(value)
  }

  const handleInputPrice = (value) => {
    if (value.length === 1 && value === '0') {
      // Allow single zero
      setPrice(value)
    } else if (value.length > 1 && value.startsWith('0')) {
      // If more than one character and starts with zero, remove leading zero
      value = value.replace(/^0+/, '') // Remove leading zeros
      setPrice(value)
    } else if (!isNaN(value)) {
      // Allow valid numeric input
      setPrice(value)
    }
  }

  const formattedPrice = (value) => {
    if (!isNaN(value) && value !== '') {
      return parseFloat(value).toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      })
    } else {
      return ''
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-4 bg-gray-100 sm:justify-center sm:pt-0">
      <div className="w-full sm:px-16 px-4 py-10 overflow-hidden bg-white rounded-lg lg:max-w-4xl">
        <div className="mb-4">
          <h1 className=" text-2xl font-bold decoration-gray-400">Tambah Item Baru</h1>
        </div>
        <div className="w-full px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <form name="userForm" autoComplete="off" onSubmit={saveData}>
            <p className="text-center text-md text-red-500">{errorMsg}</p>
            <p className="text-center text-md text-green-400">{msg}</p>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">Nama</label>

              <input
                className="p-2 block w-full my-1 bg-gray-200 border-gray-400 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setNameHandler(e.target.value)}
                placeholder="Nama"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700">Description</label>
              <textarea
                name="description"
                className="p-2 block w-full mt-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="4"
                placeholder="Deskripsi..."
                value={description}
                onChange={(e) => setDescriptionHandler(e.target.value)}></textarea>
              <p>{count + '/400'}</p>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Tipe</label>

              <input
                className="p-2 block w-full my-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="text"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Tipe produk"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Harga</label>

              <input
                className="p-2 block w-full my-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="number"
                name="price"
                pattern="[0-9]*"
                value={price}
                onChange={(e) => handleInputPrice(e.target.value)}
                placeholder="Harga produk"
              />
              <p>{formattedPrice(price)}</p>
            </div>
            <div className="flex items-center justify-start mt-4 gap-x-2">
              <button
                type="submit"
                className="px-6 py-2 mr-1 text-sm font-semibold rounded-md shadow-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
                Simpan
              </button>
              <button
                onClick={() => nav(-1)}
                type="button"
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

export default FormAddResource
