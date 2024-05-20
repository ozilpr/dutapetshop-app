import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ResourcesService from '../../features/ResourcesService'
import { useAuth } from '../Authentications/Authentication'

const Resources = () => {
  const user = useAuth()
  const [data, setData] = useState([])
  const [searchInput, setSearchInput] = useState('')

  // message
  const [errorMsg, setErrorMsg] = useState('')
  const [msg, setMsg] = useState('')

  // Function to set message and clear after delay
  const setMessageWithDelay = (message, delay) => {
    setMsg(message) // Set message to 'succeed'

    setTimeout(() => {
      setMsg('') // Clear message after delay
    }, delay)
  }

  const fetchData = async (accessToken) => {
    try {
      const response = await ResourcesService.getResources(accessToken)
      setData(response.data.resources)
      setErrorMsg('')
    } catch (error) {
      setErrorMsg(`Resources ${error}`)
    }
  }

  useEffect(() => {
    fetchData(user.accessToken)
  }, [user])

  const deleteResource = async (id) => {
    try {
      const response = await ResourcesService.deleteResourceById(user.accessToken, id)
      setMessageWithDelay(response, 3000)
      setErrorMsg('')
      fetchData(user.accessToken)
    } catch (error) {
      if (error.response) {
        setMsg(`Resource ${error}`)
      }
    }
  }

  const searchHandler = (e) => {
    setSearchInput(e.target.value)
  }

  const filterData = data.filter((rsc) => {
    return (
      rsc.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      rsc.description.toLowerCase().includes(searchInput.toLowerCase()) ||
      rsc.type.toLowerCase().includes(searchInput.toLowerCase()) ||
      rsc.price.toLowerCase().includes(searchInput.toLowerCase())
    )
  })

  const renderTable = () => {
    return filterData.map((rsc, index) => {
      return (
        <tr key={rsc.id} className="hover:bg-black hover:text-white">
          <td className="px-1 py-1 mx-auto border border-gray-500 align-top">
            <div style={{ textAlign: 'center' }}>{index + 1}</div>
          </td>
          <td className="px-2 py-1 border border-gray-500 align-top">
            <p className="text-justify">{rsc.name}</p>
          </td>
          <td className="px-3 py-1 border border-gray-500 align-top">
            <p className="text-justify">{rsc.description}</p>
          </td>
          <td className="px-3 py-1 border border-gray-500 align-top">
            <p className="text-center">{rsc.type}</p>
          </td>
          <td className="px-2 py-1 border border-gray-500 align-top">
            <p className="text-justify">
              {parseFloat(rsc.price).toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              })}
            </p>
          </td>

          <td className="text-sm font-medium text-center border border-gray-500 align-middle">
            <div className="text-center py-1 flex items-center justify-center sm:flex-row">
              <Link to={`/edit-resource?resourceId=${rsc.id}`}>
                <button
                  title="Edit"
                  className="sm:text-sm bg-sky-500 hover:bg-sky-400 text-white font-semibold py-1 px-2 rounded-md  items-center">
                  Edit
                </button>
              </Link>

              <button
                title="Remove"
                onClick={() => {
                  if (window.confirm(`Konfirmasi Hapus ${rsc.name}`)) deleteResource(rsc.id)
                }}
                className="sm:text-sm bg-red-500 hover:bg-red-400 text-white font-semibold py-1 px-2 rounded-md  items-center">
                Delete
              </button>
            </div>
          </td>
        </tr>
      )
    })
  }

  return (
    <div className="p-5 mb-5">
      <h1 className="sm:text-3xl font-bold decoration-gray-400">Produk Kesehatan</h1>
      <div className=" mt-5 mb-4">
        <div className="is-justify-content-space-between flex">
          <Link
            to={'/add-resource'}
            className="inline px-6 py-2 w-fit text-sm font-semibold rounded-md shadow-md text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
            Tambah baru
          </Link>
          <input
            className="inline px-2 bg-gray-200 border-gray-400 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={searchInput}
            onChange={searchHandler}
            placeholder="Search"
          />
        </div>
        <div className="flex flex-col my-3">
          <div className="overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
              <p className="text-center text-md text-red-500">{errorMsg}</p>
              <p className="text-center text-md text-green-500">{msg}</p>
              <table id="rsc" className="min-w-full">
                <thead>
                  <tr className="text-center">
                    <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      No
                    </th>
                    <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      Nama
                    </th>
                    <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      Deskripsi
                    </th>
                    <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      Tipe
                    </th>
                    <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      Harga
                    </th>
                    <th className='px-2 py-3 text-sm text-white md:w-auto border-b border-gray-200 bg-black colspan="3"'>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white">{renderTable()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resources
