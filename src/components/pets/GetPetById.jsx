import React, { useEffect, useState } from 'react'
import PetsService from '../../features/PetsService'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../Authentications/Authentication'
import 'react-datepicker/dist/react-datepicker.css'

const GetPetById = () => {
  const user = useAuth()
  const nav = useNavigate()
  const [data, setData] = useState([])
  const [dateString, setDateString] = useState('')
  const [searchParams] = useSearchParams()
  const petId = searchParams.get('petId')

  // message
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const fetchData = async (accessToken) => {
      try {
        const response = await PetsService.getPetById(accessToken, petId)
        setData(response.data.pet)
        setMsg('')
      } catch (error) {
        setMsg(`Pet ${error}`)
      }
    }
    fetchData(user.accessToken)
  }, [user, petId])

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }

  const formatBirthdate = (bod) => {
    if (bod) {
      const birthdateTimestamp = parseInt(bod)
      const currentDate = new Date()

      const ageInMilliseconds = currentDate - birthdateTimestamp
      const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24))

      let age = ''

      let years = Math.floor(ageInDays / 365)
      let months = Math.floor((ageInDays % 365) / 30)
      const weeks = Math.floor(((ageInDays % 365) % 30) / 7)
      // const days = ((ageInDays % 365) % 30) % 7

      if (months > 0 || years > 0) {
        if (months === 12) {
          months -= 12
          years += 1
        }
        if (years > 0) age += `${years} tahun `

        if (months > 0) age += `${months} bulan `
      }

      if (weeks > 0) {
        age += `${weeks} minggu `
      }

      // if (days > 0) {
      //   age += `${days} hari`
      // }

      // Trim any trailing space
      age = age.trim()

      return age
    }
  }

  useEffect(() => {
    if (data && data.birthdate) {
      const birthTimestamp = parseInt(data.birthdate, 10) // Convert string to integer
      const birthDate = new Date(birthTimestamp)

      if (!isNaN(birthDate.getTime())) {
        // Check if the parsed date is valid
        const formattedDateString = birthDate.toLocaleDateString('id-ID', dateOptions) // Format the date as a localized string
        setDateString(formattedDateString)
      } else {
        setDateString('Invalid Date')
      }
    }
  }, [data, dateOptions])

  return (
    <div className="flex flex-col items-center min-h-screen mt-2 bg-gray-100 ">
      <div className="w-full sm:px-16 px-4 py-4 overflow-hidden bg-white rounded-lg lg:max-w-4xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold decoration-gray-400">Data Peliharaan</h1>
        </div>
        <div className="w-full px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <p className="text-center text-md text-red-500">{msg}</p>

          <div>
            <label className="text-sm text-gray-700 mb-1 mt-4">Nama: </label>
            <label className="inline text-sm font-bold text-gray-700 mb-1 mt-4">{data.name}</label>
          </div>
          <div className="mt-4">
            <label className="text-sm text-gray-700 mb-1">Jenis: </label>
            <label className="inline text-sm font-bold text-gray-700 mb-1">{data.type}</label>
          </div>
          <div className="mt-4">
            <label className="text-sm text-gray-700 mb-1">Ras: </label>
            <label className="inline text-sm font-bold text-gray-700 mb-1">{data.race}</label>
          </div>
          <div className="mt-4">
            <label className="text-sm text-gray-700 mb-1">Jenis Kelamin: </label>
            <label className="inline text-sm font-bold text-gray-700 mb-1">{data.gender}</label>
          </div>
          <div className="mt-4">
            <label className="text-sm text-gray-700 mb-1">Tanggal Lahir: </label>
            <label className="inline text-sm font-bold text-gray-700 mb-1">
              {dateString + ' (Umur: ' + formatBirthdate(data.birthdate) + ')'}
            </label>
          </div>

          <div className="flex items-center justify-start mt-4 gap-x-2">
            <Link to={`/edit-pet?petId=${data.id}`} className="mr-4 my-1">
              <button className="px-6 py-2 ml-1 text-sm font-semibold text-white bg-green-400 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
                Ubah
              </button>
            </Link>

            <button
              onClick={() => nav(-1)}
              className="px-6 py-2 ml-1 mr-4 my-1 text-sm font-semibold text-white bg-gray-400 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GetPetById
