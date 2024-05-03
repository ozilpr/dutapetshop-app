import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../Authentications/Authentication'

const Sidebar = () => {
  const auth = useAuth()

  const logout = async () => {
    await auth.logout()
  }

  return (
    <div>
      <aside className="menu pl-2 has-shadow">
        <div>
          <ul className="menu-list mt-4">
            <li className="px-1 m-3 border-orange-400 hover:border-gray-300 border-l-4 w-auto">
              <NavLink to={'/resources'}>
                <p className="text-black">Produk Kesehatan</p>
              </NavLink>
            </li>
            <li className="px-1 m-3 border-orange-400 hover:border-gray-300 border-l-4 w-auto">
              <NavLink to={'/owners'}>
                <p className="text-black">Pemilik Hewan</p>
              </NavLink>
            </li>
            <li className="px-1 m-3 border-orange-400 hover:border-gray-300 border-l-4 w-auto">
              <NavLink to={'/pets'}>
                <p className="text-black">Peliharaan</p>
              </NavLink>
            </li>
            <li className="px-1 m-3 border-orange-400 hover:border-gray-300 border-l-4 w-auto">
              <NavLink to={'/transaction/detail'}>
                <p className="text-black">Transaksi</p>
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <p className="menu-label">
            <li className="px-1 m-3 hover:border-gray-300 w-auto list-none">
              <button
                onClick={logout}
                className="button text-sm hover:bg-gray-300 bg-red-500 text-white">
                Log Out
              </button>
            </li>
          </p>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
