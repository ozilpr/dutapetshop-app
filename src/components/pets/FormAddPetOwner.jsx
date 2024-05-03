import React, { useEffect, useState } from 'react'
import PetsService from '../../features/PetsService'
import OwnersService from '../../features/OwnersService'
import PetOwnerService from '../../features/PetOwnerService'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../Authentications/Authentication'

const FormAddPetOwner = () => {
  const user = useAuth()
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const getOwnerId = searchParams.get('ownerId')
  const getOwnerName = searchParams.get('ownerName')
  const getRegCode = searchParams.get('regCode')

  const [owner, setOwner] = useState([])
  const [pet, setPet] = useState([])

  const [ownerId, setOwnerId] = useState('')
  const [regCode, setRegCode] = useState('')
  const [ownerName, setOwnerName] = useState('')

  const [petId, setPetId] = useState('')
  const [petName, setPetName] = useState('')

  const [ownerFilterText, setOwnerFilterText] = useState('')
  const [petFilterText, setPetFilterText] = useState('')

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
      const ownResponse = await OwnersService.getOwners(accessToken)
      setOwner(ownResponse.data.owners)

      const petResponse = await PetsService.getPetsWithoutOwner(accessToken)
      setPet(petResponse.data.pets)
    } catch (error) {
      setErrorMsg(`Owner ${error}`)
    }
  }

  useEffect(() => {
    if (getOwnerId && getOwnerName && getRegCode) {
      setOwnerId(getOwnerId)
      setOwnerName(getOwnerName)
      setRegCode(getRegCode)
    }
    fetchData(user.accessToken)
  }, [user, getOwnerId, getOwnerName, getRegCode])

  async function saveData(e) {
    e.preventDefault()
    try {
      if (ownerId && petId) {
        const response = await PetOwnerService.addPetOwner(user.accessToken, {
          ownerId,
          petId
        })

        if (response) {
          fetchData(user.accessToken)
          setMessageWithDelay(response.message, 5000)

          setPetName('')
          setPetId('')

          setOwnerId('')
          setOwnerName('')
          setRegCode('')
        }
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

  const renderPet = () => {
    return pet
      .filter((pet) => {
        const lowerCaseFilterText = petFilterText.toLowerCase()
        return pet.name.toLowerCase().includes(lowerCaseFilterText)
      })
      .map((pet) => (
        <option key={pet.id} value={pet.name} data-id={pet.id}>
          {pet.name}
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

  const PetHandler = async (e) => {
    const name = e.target.value
    const dataset = e.target.options[e.target.selectedIndex].dataset

    setPetName(name)
    setPetId(dataset.id)
  }

  return (
    <div className="flex flex-col items-center min-h-screen mt-2 bg-gray-100 ">
      <div className="w-full sm:px-16 px-4 py-4 overflow-hidden bg-white rounded-lg lg:max-w-4xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold decoration-gray-400">Tambah Kepemilikan peliharaan</h1>
        </div>
        <div className="w-full px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <form name="userForm" autoComplete="off" onSubmit={saveData}>
            <p className="text-center text-xs text-red-500">{errorMsg}</p>
            <p className="text-center text-xs text-green-500">{msg}</p>
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
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">Peliharaan</label>
              <input
                className="p-1 rounded-md block my-1 ring-1 ring-gray-900/10"
                type="text"
                placeholder="Cari peliharaan..."
                value={petFilterText}
                onChange={(e) => setPetFilterText(e.target.value)}
              />
              <select
                className="w-1/3 p-1 text-sm block mt-1 border-gray-400 rounded-md border shadow-sm text-black focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={petName}
                data-id={petId}
                onChange={(e) => PetHandler(e)}>
                <option value="">Pilih Peliharaan</option>
                {renderPet()}
              </select>
            </div>

            <div className="flex items-center justify-start mt-4 gap-x-2">
              <button
                type="submit"
                className="px-6 py-2 mr-1 text-sm font-semibold rounded-md shadow-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
                Simpan
              </button>

              <button
                onClick={() => nav(-1)}
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

export default FormAddPetOwner
