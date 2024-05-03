import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OwnersService from '../../features/OwnersService'
import { useAuth } from '../Authentications/Authentication'

const Owners = () => {
  const user = useAuth()
  const [data, setData] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const nav = useNavigate()

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

  const fetchData = async (accessToken) => {
    try {
      const response = await OwnersService.getOwners(accessToken)
      setData(response.data.owners)
    } catch (error) {
      setErrorMsg(`Owner ${error}`)
    }
  }

  useEffect(() => {
    fetchData(user.accessToken)
  }, [user])

  const deleteOwner = async (id) => {
    try {
      const response = await OwnersService.deleteOwnerById(user.accessToken, id)
      setMessageWithDelay(response, 3000)
      fetchData(user.accessToken)
      console.log(response)
    } catch (error) {
      setErrorMsg(`Owner ${error}`)
    }
  }

  const searchHandler = (e) => {
    setSearchInput(e.target.value)
  }

  const filterData = data.filter((user) => {
    return (
      user.register_code.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchInput.toLowerCase())
    )
  })

  // Function to format phone numbers
  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.length > 12) {
      return (
        phoneNumber.slice(0, 4) +
        '-' +
        phoneNumber.slice(4, 8) +
        '-' +
        phoneNumber.slice(8, 12) +
        '-' +
        phoneNumber.slice(12)
      )
    } else if (phoneNumber.length <= 12) {
      return phoneNumber.slice(0, 4) + '-' + phoneNumber.slice(4, 8) + '-' + phoneNumber.slice(8)
    }
  }
  const ownerClickHandler = (e, ownerId) => {
    e.preventDefault()

    nav(`/owner-profile?ownerId=${ownerId}`)
  }

  const renderTable = () => {
    return filterData.map((owner, index) => {
      return (
        <tr key={owner.id} className="hover:bg-black hover:text-white">
          <td className="px-1 py-1 mx-auto border border-gray-500 align-top">
            <div style={{ textAlign: 'center' }}>{index + 1}</div>
          </td>
          <td
            onClick={(e) => ownerClickHandler(e, owner.id)}
            className="px-2 py-1 border border-gray-500 align-top">
            <p className="text-center">{owner.register_code}</p>
          </td>
          <td
            onClick={(e) => ownerClickHandler(e, owner.id)}
            className=" border border-gray-500 align-top">
            <p className="px-3 py-1 text-justify">{owner.name}</p>
          </td>
          <td
            onClick={(e) => ownerClickHandler(e, owner.id)}
            className="px-3 py-1 border border-gray-500 align-top">
            <p className="text-center">{formatPhoneNumber(owner.phone)}</p>
          </td>

          <td className="text-sm font-medium text-center border border-gray-500 align-middle">
            <div className="text-center py-1 flex items-center justify-center sm:flex-row">
              <Link to={`/edit-owner?ownerId=${owner.id}`}>
                <button
                  title="Edit"
                  className="sm:text-sm bg-sky-500 hover:bg-sky-400 text-white font-semibold py-1 px-2 rounded-md  items-center">
                  Edit
                </button>
              </Link>

              <button
                title="Remove"
                onClick={() => {
                  if (window.confirm(`Konfirmasi Hapus ${owner.name}`)) deleteOwner(owner.id)
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
      <h1 className="sm:text-3xl font-bold decoration-gray-400">Daftar Owner</h1>
      <div className=" mt-5 mb-4">
        <div className="is-justify-content-space-between flex">
          <Link
            to={'/add-owner'}
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
              <p className="text-center text-xs text-red-500">{errorMsg}</p>
              <p className="text-center text-xs text-green-500">{msg}</p>
              <table id="owner" className="min-w-full">
                <thead>
                  <tr className="text-center">
                    <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      No
                    </th>
                    <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      Kode Registrasi
                    </th>
                    <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      Nama
                    </th>
                    <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      No. Telp
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

export default Owners
