import React, { useState, useEffect } from 'react'
import ResourcesService from '../../features/ResourcesService'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../Authentications/Authentication'

const FormEditResource = () => {
  const user = useAuth()

  const [data, setData] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [price, setPrice] = useState('0')
  const [count, setCount] = useState(0)
  const [searchParams] = useSearchParams()
  const resourceId = searchParams.get('resourceId')
  const nav = useNavigate()
  // const [capitalEachWord, setCapitalEachWord] = useState(true)

  // error message
  const [msg, setMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Function to set message and clear after delay
  const setMessageWithDelay = (message, delay) => {
    setMsg(message)

    setTimeout(() => {
      setMsg('')
    }, delay)
  }

  useEffect(() => {
    const fetchData = async (accessToken) => {
      try {
        const response = await ResourcesService.getResourceById(accessToken, resourceId)
        setData(response.data.resource)
        setName(response.data.resource.name)
        setDescription(response.data.resource.description)
        setType(response.data.resource.type)
        setPrice(response.data.resource.price)
      } catch (error) {
        setErrorMsg(error)
      }
    }

    fetchData(user.accessToken)
  }, [user, resourceId])

  async function saveData(e) {
    const updatedName = name === '' || name === null ? data.name : name
    const updatedDescription =
      description === '' || description === null ? data.description : description
    const updatedType = type === '' || type === null ? data.type : type
    const updatedPrice = price === '' || price === null ? data.price : price

    e.preventDefault()
    try {
      const response = await ResourcesService.updateResourceById(user.accessToken, resourceId, {
        name: updatedName,
        description: updatedDescription,
        type: updatedType,
        price: updatedPrice
      })
      setMessageWithDelay(response.message, 3000)
    } catch (error) {
      setErrorMsg(`Resource ${error}`)
    }
  }

  const setNameHandler = async (name) => {
    // if (name && capitalEachWord) {
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

  // const handleState = () => {
  //   setCapitalEachWord((prevState) => !prevState)
  // }

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
          <h1 className=" text-2xl font-bold decoration-gray-400">Ubah Item</h1>
        </div>
        <div className="w-full px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <form name="userForm" autoComplete="off" onSubmit={saveData}>
            <p className="text-center text-md text-red-500">{errorMsg}</p>
            <p className="text-center text-md text-green-500">{msg}</p>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">
                Nama
                {/* <input type="checkbox" checked={capitalEachWord} onChange={handleState} /> */}
              </label>

              <input
                className="p-2 block w-full my-1 bg-gray-200 border-gray-400 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setNameHandler(e.target.value)}
                placeholder={data.name}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">Description</label>
              <textarea
                name="description"
                className="p-2 block w-full my-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="4"
                maxLength={400}
                placeholder={data.description}
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
                placeholder={data.type}
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
                placeholder={data.price}
              />
              <p>{formattedPrice(price)}</p>
            </div>
            <div className="flex items-center justify-start mt-4 gap-x-2">
              <button
                type="submit"
                className="px-6 py-2 mr-1 text-sm font-semibold rounded-md shadow-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
                Ubah
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

export default FormEditResource
