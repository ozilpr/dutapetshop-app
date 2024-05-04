import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminService from '../../features/AdminService'

const Admin = () => {
  const [admin, setAdmin] = useState([])

  // error message
  const [msg, setMsg] = useState('')

  const fetchData = async () => {
    try {
      const response = await AdminService.getAdminByName('')
      setAdmin(response.data.admin)
    } catch (error) {
      setMsg(`Admin ${error}`)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // const deleteAdmin = async (id) => {
  //   try {
  //     await AdminService.deleteAdminById(id)
  //     fetchData()
  //   } catch (error) {
  //     setMsg(error)
  //   }
  // }

  const renderTable = () => {
    return admin.map((admin) => {
      return (
        <tr key={admin.id} className="text-center hover:bg-black hover:text-white">
          <td className="px-2 py-1 border border-gray-500 text-center align-middle">
            {admin.username}
          </td>
          <td className="px-2 py-1 border border-gray-500 align-middle">{admin.fullname}</td>
          <td className="text-sm font-medium text-center border-b border-gray-500 nowrap whitespace-nowrap">
            <div className="text-center px-2 py-1">
              <Link to={`/edit-admin?adminId=${admin.id}`}>
                <button
                  title="Edit"
                  className="sm:text-sm w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-1  mb-1 rounded-md  items-center">
                  Edit
                </button>
              </Link>
              {/* <div
                title="Remove"
                className="sm:text-sm w-full bg-red-500 hover:bg-red-400 text-white font-semibold py-1 mt-1 rounded-md  items-center"
                onClick={() => {
                  if (window.confirm(`Konfirmasi Hapus ${admin.fullname} sebagai admin`))
                    deleteAdmin(admin.id)
                }}
              /> */}
            </div>
          </td>
        </tr>
      )
    })
  }

  return (
    <div className="p-5 mb-5">
      <h1 className="sm:text-3xl font-bold decoration-gray-400">Data Admin</h1>
      <div className=" mt-5 mb-4">
        <Link
          to={'/add-admin'}
          className="px-6 py-2 text-sm font-semibold rounded-md shadow-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
          Tambah baru
        </Link>

        <div className="flex flex-col my-3">
          <div className="overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
              <p className="text-center text-md text-red-500">{msg}</p>
              <table id="admin" className="min-w-full">
                <thead>
                  <tr className="text-center">
                    <th className="px-2 py-3 text-xs font-medium leading-4  md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      Username
                    </th>
                    <th className="px-2 py-3 text-xs font-medium leading-4  md:w-auto text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      Fullname
                    </th>
                    <th className='px-2 py-3 text-sm text-center text-white md:w-auto border-b border-gray-200 bg-black colspan="3"'>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>{renderTable()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
