import React, { useState } from 'react'
import { useAuth } from '../components/Authentications/Authentication'

const Login = () => {
  const { loggedIn } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const handleLogin = async () => {
    try {
      await loggedIn(username, password)
    } catch (error) {
      setMsg(`Login ${error}`)
    }
  }

  const showPassword = () => {
    const pw = document.getElementById('password')
    if (pw.type === 'password') {
      pw.type = 'text'
    } else {
      pw.type = 'password'
    }
  }

  return (
    <div>
      <div className="bg-orange-300 h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <h1 className="font-bold text-3xl text-black m-7">Duta Pet Shop & Klinik</h1>
          <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Login
              </h1>
              <p className="text-red-500">{msg}</p>
              <form className="space-y-4 md:space-y-6" autoComplete="off">
                {/* {isError && <p className="text-center text-red-500">{message}</p>} */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 text-left">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Masukkan username Anda"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 text-left">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan Password Anda"
                    className="mb-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required
                  />
                  <div className="text-left">
                    <input type="checkbox" className="inline" onClick={() => showPassword()} />
                    <p className="inline items-center my-1 px-1 text-sm font-thin text-gray-700 text-left">
                      Show Password
                    </p>
                  </div>
                </div>
                <div className="text-center mt-5">
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-1/3 md:w-2/3 text-white bg-green-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {'Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
