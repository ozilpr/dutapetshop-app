import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../Authentications/Authentication'
import OwnersService from '../../features/OwnersService'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import PetOwnerService from '../../features/PetOwnerService'

const OwnerProfile = () => {
  const user = useAuth()
  const [ownerData, setOwnerData] = useState([])
  const [petOwnerData, setPetOwnerData] = useState([])
  const [searchParams] = useSearchParams()
  const ownerId = searchParams.get('ownerId')
  const nav = useNavigate()

  const [petStatus, setPetStatus] = useState('')
  const [msg, setMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Function to set message and clear after delay
  const setMessageWithDelay = (message, delay) => {
    setMsg(message) // Set message to 'succeed'

    setTimeout(() => {
      setMsg('') // Clear message after delay
    }, delay)
  }

  const fetchData = useCallback(
    async (accessToken) => {
      try {
        const ownerResponse = await OwnersService.getOwnerById(accessToken, ownerId)
        setOwnerData(ownerResponse.data.owner)

        const petOwnerResponse = await PetOwnerService.getPetOwnerByOwnerId(accessToken, ownerId)
        setPetOwnerData(petOwnerResponse.data.pet)
      } catch (error) {
        setPetStatus(error.message)
      }
    },
    [ownerId]
  )

  useEffect(() => {
    fetchData(user.accessToken)
  }, [user, fetchData])

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
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
  }

  const navigateHandler = async (e, petId) => {
    e.preventDefault()
    nav(`/pet?petId=${petId}`)
  }

  const deletePetOwner = async (id) => {
    try {
      const response = await PetOwnerService.deletePetOwnerById(user.accessToken, id)
      setMessageWithDelay(response, 3000)
      fetchData(user.accessToken)
    } catch (error) {
      setErrorMsg(`Pet ${error}`)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen mt-2 bg-gray-100 ">
      <div className="w-full sm:px-16 px-4 py-4 overflow-hidden bg-white rounded-lg lg:max-w-4xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold decoration-gray-400">Profil Owner</h1>
        </div>
        <div className="w-full px-4 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <p className="text-center text-md text-green-500">{msg}</p>
          <p className="text-center text-md text-red-500">{errorMsg}</p>
          <h2>
            Kode Registrasi:{'  '}
            <p className="inline has-text-weight-semibold">{ownerData.register_code}</p>
          </h2>
          <h2>
            Nama:{'  '}
            <p className="inline has-text-weight-semibold">{ownerData.name}</p>
          </h2>
          <h2>
            No. Hp:{'  '}
            <p className="inline has-text-weight-semibold">{formatPhoneNumber(ownerData.phone)} </p>
          </h2>
          <Link title="Edit Owner" to={`/edit-owner?ownerId=${ownerData.id}`}>
            <div className="w-fit inline-block my-2 px-2 py-1 bg-sky-500 hover:bg-sky-400 text-white rounded mb-4">
              <p>Ubah data</p>
            </div>
          </Link>
        </div>
        <div className="w-full my-2 px-4 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <h1 className="py-1">Peliharaan</h1>
          <div className="my-2">
            {petOwnerData.length > 0 ? (
              <React.Fragment>
                {petOwnerData.map((petOwner) => (
                  <div
                    key={petOwner.id}
                    title="Show pet"
                    className="w-fit inline content-center mr-2 px-2 py-2 bg-white hover:bg-black hover:text-white rounded shadow-md ring-1 ring-gray-200 cursor-pointer">
                    <p onClick={(e) => navigateHandler(e, petOwner.pet_id)} className="inline">
                      {petOwner.pet_name}
                    </p>
                    <button
                      title="Remove"
                      onClick={() => {
                        if (window.confirm(`Konfirmasi Hapus Kepemilikan`))
                          deletePetOwner(petOwner.id)
                      }}
                      className="inline content-center mx-1 sm:text-sm bg-red-500 hover:bg-red-400 text-white font-semibold px-1 rounded-md  items-center">
                      ×
                    </button>
                  </div>
                ))}
              </React.Fragment>
            ) : (
              <p>{petStatus}</p>
            )}
          </div>

          <Link
            title="Add new pet"
            to={`/add-pet-owner?ownerId=${ownerData.id}&ownerName=${ownerData.name}&regCode=${ownerData.register_code}`}>
            <div className="w-fit inline-block my-2 px-2 py-1 text-white bg-green-500 hover:bg-green-400 rounded mb-4">
              <p>Tambah peliharaan</p>
            </div>
          </Link>
        </div>
        <div className="w-full px-4 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <div>Data Transaksi Owner</div>
          <Link
            title="View Owner Transactions"
            to={`/transaction/detail/owner?ownerId=${ownerData.id}`}>
            <div className="w-fit inline-block my-2 px-2 py-1 text-white bg-black hover:bg-gray-700 rounded mb-4">
              <p>Lihat</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OwnerProfile
