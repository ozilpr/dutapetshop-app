import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TransactionService from '../../features/TransactionsService'
import { useAuth } from '../Authentications/Authentication'

const Trasanctions = () => {
  const user = useAuth()
  const [data, setData] = useState([])

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [msg, setMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [visibleItems, setVisibleItems] = useState(false)

  // Function to set message and clear after delay
  const setMessageWithDelay = (message, delay) => {
    setMsg(message) // Set message to 'succeed'

    setTimeout(() => {
      setMsg('') // Clear message after delay
    }, delay)
  }

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }

  const fetchData = async (accessToken) => {
    try {
      const response = await TransactionService.getTransactionDetails(accessToken)
      setData(response.data)
    } catch (error) {
      if (error.response) {
        setErrorMsg(`Transaction ${error}`)
      }
    }
  }

  useEffect(() => {
    fetchData(user.accessToken)
  }, [user])

  const deleteTransaction = async (id) => {
    try {
      const response = await TransactionService.deleteTransactionDetailById(user.accessToken, id)
      setMessageWithDelay(response, 3000)
      fetchData(user.accessToken)
    } catch (error) {
      if (error.response) {
        setErrorMsg(`Transaction ${error}`)
      }
    }
  }

  const deleteTransactionItem = async (id) => {
    try {
      const response = await TransactionService.deleteTransactionById(user.accessToken, id)
      setMessageWithDelay(response, 3000)
      fetchData(user.accessToken)
    } catch (error) {
      if (error.response) {
        setErrorMsg(`Transaction ${error}`)
      }
    }
  }

  const calculateTotalPrice = (transaction) => {
    let totalPrice = 0
    transaction.transactions.forEach((item) => {
      const totalItem = item.price * item.quantity
      totalPrice += totalItem
    })
    return totalPrice
  }

  const toggleShowItems = (e, transactionId) => {
    e.preventDefault()
    setVisibleItems((prevVisibleItems) => ({
      ...prevVisibleItems,
      [transactionId]: !prevVisibleItems[transactionId]
    }))
  }

  const formatDate = (date) => {
    const newDate = new Date(date)
    const formattedDate = newDate.toLocaleDateString('id-ID', dateOptions)
    return formattedDate
  }

  useEffect(() => {
    // Check if both start date and end date are set
    if (startDate && endDate) {
      // Convert strings to Date objects
      const startDateObj = new Date(startDate)
      const endDateObj = new Date(endDate)

      // Check if end date is earlier than start date
      if (endDateObj < startDateObj) {
        // If so, set end date to start date
        setEndDate(startDate)
      }
    }
  }, [startDate, endDate])

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value)
  }

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value)
  }

  const listTransaction = () => {
    const filteredData = data.filter((transaction) => {
      const transactionDate = new Date(transaction.transaction_date)
      return (
        (!startDate || transactionDate >= new Date(startDate)) &&
        (!endDate || transactionDate <= new Date(endDate))
      )
    })

    return filteredData.map((transaction, index) => {
      // Render transaction components here

      return (
        <React.Fragment key={transaction.transaction_id}>
          <tr className="hover:bg-black hover:text-white cursor-pointer">
            <td className="p-1 text-sm font-medium text-center border-y-2 border-gray-500 align-middle">
              <p className="text-center">{index + 1 + '.'}</p>
            </td>
            <td className="p-1 text-sm font-medium text-center text-white border-y-2 border-gray-500 align-middle">
              <Link to={`/owner-profile?ownerId=${transaction.owner_id}`} title="See owner info">
                <p className="inline px-2 text-center rounded-sm bg-black hover:border hover:border-black hover:text-black hover:bg-white">
                  {transaction.owner_name}
                </p>
              </Link>
            </td>
            <td className="p-1 text-sm font-medium text-center border-y-2 border-gray-500 align-middle">
              <p className="text-center">{transaction.register_code}</p>
            </td>
            <td className="p-1 text-sm font-medium text-center border-y-2 border-gray-500 align-middle">
              <p className="text-center">{formatDate(transaction.transaction_date)}</p>
            </td>
            <td className="py-1 px-3 text-sm font-medium text-center border-y-2 border-gray-500 align-middle">
              <p className="text-right">
                {calculateTotalPrice(transaction).toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                })}
              </p>
            </td>
            <td className="text-sm font-medium text-center border-y-2 border-gray-500 align-middle">
              <div className="text-center flex items-center justify-center sm:flex-row">
                <button
                  title="Show detail"
                  onClick={(e) => toggleShowItems(e, transaction.transaction_id)}
                  className="inline px-2 py-1 mx-2 bold border rounded-md text-white bg-black hover:bg-gray-700">
                  {visibleItems[transaction.transaction_id] ? '-' : '+'}
                </button>
                {/* <Link
                  to={`/edit-transaction/detail?transactionId=${transaction.transaction_id}`}
                  className="mx-1">
                  <button
                    title="Edit"
                    className="sm:text-sm bg-sky-500 hover:bg-sky-400 text-white font-semibold py-1 px-2 rounded-md  items-center">
                    <p className="rotate-45">✏</p>
                  </button>
                </Link> */}

                <button
                  title="Remove"
                  onClick={() => {
                    if (window.confirm(`Konfirmasi Hapus Transaksi`))
                      deleteTransaction(transaction.transaction_id)
                  }}
                  className="mx-1 sm:text-sm bg-red-500 hover:bg-red-400 text-white font-semibold py-1 px-2 rounded-md  items-center">
                  ×
                </button>
              </div>
            </td>
          </tr>
          {visibleItems[transaction.transaction_id] && (
            <tr>
              <td colSpan="6">
                <div className="float-right">
                  <h2 className="my-2 font-medium text-black border-b">List Item</h2>
                  <table className="w-full mx-auto mb-4">
                    <thead className="border">
                      <tr className="">
                        <th className="px-2 py-1 text-xs font-medium leading-4 md:w-auto text-black border-y border-gray-200 bg-gray-50">
                          <p className="text-center">Nama Item</p>
                        </th>
                        <th className="px-2 py-1 text-xs font-medium leading-4 md:w-auto text-black border-y border-gray-200 bg-gray-50">
                          <p className="text-center">Qty.</p>
                        </th>
                        <th className="px-2 py-1 text-xs font-medium leading-4 md:w-auto text-black border-y border-gray-200 bg-gray-50">
                          <p className="text-center">Harga</p>
                        </th>
                        <th className="px-2 py-1 text-xs font-medium leading-4 md:w-auto text-black border border-gray-200 bg-gray-50">
                          <p className="text-center">Sub Total</p>
                        </th>
                        <th className="px-2 py-1 text-xs font-medium leading-4 md:w-auto text-white border border-gray-200 bg-black">
                          <p className="text-center">Action</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.transactions.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 align-middle border-y bold text-gray-600">
                            <p className="text-left">{item.resource_name}</p>
                          </td>
                          <td className="px-3 align-middle border-y bold text-gray-600">
                            <p className="text-center">{item.quantity}</p>
                          </td>
                          <td className="px-3 align-middle border-y bold text-gray-600">
                            <p className="text-right">
                              {parseFloat(item.price).toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                              })}
                            </p>
                          </td>
                          <td className="px-3 align-middle border bold text-gray-600">
                            <p className="text-right">
                              {parseFloat(item.price * item.quantity).toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                              })}
                            </p>
                          </td>
                          <td className="align-middle text-sm font-medium text-center border text-black">
                            <div className="text-center flex items-center justify-center sm:flex-row">
                              {/* <Link to={`/edit-transaction?transactionId=${item.id}`}>
                                <button
                                  title="Edit"
                                  className="sm:text-sm bg-sky-500 hover:bg-sky-400 text-white font-semibold py-1 px-2 rounded-md  items-center">
                                  <p className="rotate-45">✏</p>
                                </button>
                              </Link> */}

                              <button
                                title="Remove"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Konfirmasi Hapus ${item.resource_name} pada Transaksi`
                                    )
                                  )
                                    deleteTransactionItem(item.id)
                                }}
                                className="sm:text-sm bg-red-500 hover:bg-red-400 text-white font-semibold py-1 px-2 rounded-md  items-center">
                                ×
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      )
    })
  }

  return (
    <div className="items-center min-h-screen pt-2 bg-gray-100 sm:justify-center sm:pt-0">
      <div className="w-full sm:px-16 px-4 py-2 overflow-hidden bg-white rounded-lg">
        <div className="flex is-justify-content-space-between">
          <div>
            <h2 className="inline text-2xl font-bold decoration-gray-400">List Transaksi</h2>
            <Link to={`/add-transaction`} title="Add Transaction">
              <button className="mx-3 text-white border bg-green-500 hover:bg-green-400 font-semibold px-2 rounded-md  items-center">
                Buat Transaksi Baru
              </button>
            </Link>
          </div>
          <div>
            <p className="inline mx-1">Start Date:</p>
            <input
              className="p-1 border rounded-sm border-slate-700"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Start Date"
            />
            <p className="inline mx-1">End Date:</p>
            <input
              className="p-1 border rounded-sm border-slate-700"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="End Date"
            />
          </div>
        </div>
        <div className="my-2">
          <p className="text-center text-xs text-red-500">{errorMsg}</p>
          <p className="text-center text-xs text-green-500">{msg}</p>
        </div>
        <div className="text-sm">
          <table className="min-w-full">
            <thead>
              <tr className="text-center">
                <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-600 uppercase border-b border-gray-200 bg-gray-50">
                  No.
                </th>
                <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-600 uppercase border-b border-gray-200 bg-gray-50">
                  Nama Owner
                </th>
                <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-600 uppercase border-b border-gray-200 bg-gray-50">
                  Kode Registrasi
                </th>
                <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-600 uppercase border-b border-gray-200 bg-gray-50">
                  Tanggal Transaksi
                </th>
                <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-gray-600 uppercase border-b border-gray-200 bg-gray-50">
                  Total
                </th>
                <th className="px-2 py-3 text-xs font-medium leading-4 md:w-auto text-white uppercase border-b border-gray-200 bg-black">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{listTransaction()}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Trasanctions
