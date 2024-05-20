import React, { useEffect, useState } from 'react'
import PetsService from '../../features/PetsService'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../Authentications/Authentication'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const FormEditPet = () => {
  const user = useAuth()
  const [data, setData] = useState([])
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [race, setRace] = useState('')
  const [gender, setGender] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [dateString, setDateString] = useState('')
  const [searchParams] = useSearchParams()
  const petId = searchParams.get('petId')
  const nav = useNavigate()

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

  useEffect(() => {
    const fetchData = async (accessToken) => {
      try {
        const response = await PetsService.getPetById(accessToken, petId)
        setData(response.data.pet)

        const { pet } = response.data
        setName(pet.name)
        setType(pet.type)
        setRace(pet.race)
        setGender(pet.gender)
        setDateString(pet.birthdate)
        setErrorMsg('')
      } catch (error) {
        setErrorMsg(error)
      }
    }
    fetchData(user.accessToken)
  }, [user, petId])

  async function saveData(e) {
    const updatedBOD = dateString === '' || dateString === null ? data.birthdate : dateString
    e.preventDefault()
    try {
      const response = await PetsService.updatePetById(user.accessToken, petId, {
        name: name,
        type: type,
        race: race,
        gender: gender,
        birthdate: updatedBOD
      })

      setMessageWithDelay(response.message, 3000)
      setErrorMsg('')
    } catch (error) {
      setErrorMsg(`Pet ${error}`)
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

  useEffect(() => {
    setDateString(birthdate.toString())
  }, [birthdate])

  return (
    <div className="flex flex-col items-center min-h-screen mt-2 bg-gray-100 ">
      <div className="w-full sm:px-16 px-4 py-4 overflow-hidden bg-white rounded-lg lg:max-w-4xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold decoration-gray-400">Ubah Data Peliharaan</h1>
        </div>
        <div className="w-full px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <form name="userForm" autoComplete="off" onSubmit={saveData}>
            <p className="text-center text-md text-green-500">{msg}</p>
            <p className="text-center text-md text-red-500">{errorMsg}</p>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">Nama</label>

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
              <label className="block text-sm font-bold text-gray-700 mb-1">Jenis</label>

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
              <label className="block text-sm font-bold text-gray-700 mb-1">Ras</label>

              <input
                className="p-2 block w-full my-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="text"
                name="race"
                value={race}
                onChange={(e) => setRace(e.target.value)}
                placeholder={data.race}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Jenis Kelamin</label>
              <select
                className="p-2 my-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={gender}
                onChange={(e) => setGender(e.target.value)}>
                <option value="">Pilih gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Lahir</label>

              <DatePicker
                className="px-2 py-1 border border-gray-500 rounded text-sm  outline-none  focus:ring-0 bg-transparent"
                name="birthdate"
                selected={birthdate}
                onChange={(date) => setBirthdate(Date.parse(date))}
                showYearDropdown
                isClearable
                maxDate={new Date()}
                dateFormatCalendar="MMMM"
                yearDropdownItemNumber={70}
                scrollableYearDropdown
              />
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

export default FormEditPet
