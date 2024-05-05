import React, { useEffect, useState } from 'react'
import PetsService from '../../features/PetsService'
import OwnersService from '../../features/OwnersService'
import PetOwnerService from '../../features/PetOwnerService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Authentications/Authentication'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const FormAddPet = () => {
  const user = useAuth()
  const nav = useNavigate()
  const [owner, setOwner] = useState([])

  const [ownerId, setOwnerId] = useState('')
  const [regCode, setRegCode] = useState('')
  const [ownerName, setOwnerName] = useState('')

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [race, setRace] = useState('')
  const [gender, setGender] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [dateString, setDateString] = useState('')

  const [ownerFilterText, setOwnerFilterText] = useState('')

  // error message
  const [errorMsg, setErrorMsg] = useState('')
  const [msg, setMsg] = useState('')

  const fetchData = async (accessToken) => {
    try {
      const ownResponse = await OwnersService.getOwners(accessToken)

      setOwner(ownResponse.data.owners)
    } catch (error) {
      setErrorMsg(`Owner ${error}`)
    }
  }

  useEffect(() => {
    fetchData(user.accessToken)
  }, [user])

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
      const response = await PetsService.addPet(user.accessToken, {
        name: name,
        type: type,
        race: race,
        gender: gender,
        birthdate: dateString
      })
      console.log(response)
      const petId = response.data.petId

      if (ownerId) {
        await PetOwnerService.addPetOwner(user.accessToken, {
          ownerId,
          petId
        })
      }

      if (response) {
        setMessageWithDelay(response.message, 5000)

        setName('')
        setType('')
        setRace('')
        setGender('')
        setBirthdate('')

        setOwnerId('')
        setOwnerName('')
        setRegCode('')
      }
    } catch (error) {
      setErrorMsg(`Pet Owner ${error}`)
    }
  }

  const renderOwner = () => {
    return owner
      .filter((own) => {
        const lowerCaseFilterText = ownerFilterText.toLowerCase()
        return (
          own.name.toLowerCase().includes(lowerCaseFilterText) ||
          own.register_code.toLowerCase().includes(lowerCaseFilterText)
        )
      })
      .map((own) => (
        <option key={own.id} value={own.name} data-value={own.register_code} data-id={own.id}>
          {own.register_code + ' - ' + own.name}
        </option>
      ))
  }

  const OwnHandler = async (e) => {
    const name = e.target.value
    const dataset = e.target.options[e.target.selectedIndex].dataset

    setOwnerName(name)
    setRegCode(dataset.value)
    setOwnerId(dataset.id)
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
          <h1 className="text-2xl font-bold decoration-gray-400">Tambah Peliharaan Baru</h1>
        </div>
        <div className="w-full px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <form name="userForm" autoComplete="off" onSubmit={saveData}>
            <p className="text-center text-md text-red-500">{errorMsg}</p>
            <p className="text-center text-md text-green-500">{msg}</p>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">Owner</label>
              <input
                className="p-1 rounded-md block my-1 ring-1 ring-gray-900/10"
                type="text"
                placeholder="Cari owner..."
                value={ownerFilterText}
                onChange={(e) => setOwnerFilterText(e.target.value)}
              />
              <select
                className="w-1/3 p-1 text-sm block mt-1 border-gray-400 rounded-md border shadow-sm text-black focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={ownerName}
                data-value={regCode}
                data-id={ownerId}
                onChange={(e) => OwnHandler(e)}>
                <option value="">Pilih Owner</option>
                {renderOwner()}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">Nama</label>

              <input
                className="p-2 block w-full my-1 bg-gray-200 border-gray-400 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setNameHandler(e.target.value)}
                placeholder="Nama Peliharaan.."
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
                placeholder="Jenis Peliharaan.."
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
                placeholder="Ras Peliharaan.."
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

export default FormAddPet
