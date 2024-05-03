import React, { useState, useEffect } from 'react'
import TransactionsService from '../../features/TransactionsService'
import OwnersService from '../../features/OwnersService'
import ResourcesService from '../../features/ResourcesService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Authentications/Authentication'

const FormAddTransaction = () => {
  const user = useAuth()
  const nav = useNavigate()
  // from db
  const [rsc, setRsc] = useState([])
  const [owner, setOwner] = useState([])

  // selected option
  const [ownerId, setOwnerId] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [regCode, setRegCode] = useState('')

  const [resourceId, setResourceId] = useState('')
  const [rscName, setRscName] = useState('')
  const [price, setPrice] = useState(0)

  const [quantity, setQuantity] = useState(1)

  // message
  const [errorMsg, setErrorMsg] = useState('')
  const [msg, setMsg] = useState('')

  // added items
  const [displayedItems, setDisplayedItems] = useState([])
  const [transactionsData, setTransactionsData] = useState([])

  // filter
  const [ownerFilterText, setOwnerFilterText] = useState('')
  const [rscFilterText, setRscFilterText] = useState('')

  const fetchData = async (accessToken) => {
    try {
      const rscResponse = await ResourcesService.getResources(accessToken)
      const ownResponse = await OwnersService.getOwners(accessToken)

      setRsc(rscResponse.data.resources)
      setOwner(ownResponse.data.owners)
    } catch (error) {
      setErrorMsg(`Transaction ${error}`)
    }
  }

  useEffect(() => {
    fetchData(user.accessToken)
  }, [user])

  // Function to set message and clear after delay
  const setMessageWithDelay = (message, delay) => {
    setMsg(message)

    setTimeout(() => {
      setMsg('')
    }, delay)
  }

  const saveData = async (e) => {
    e.preventDefault()

    if (!ownerId || !ownerName) {
      setErrorMsg('Owner belum dipilih')
      return
    }
    if (transactionsData.length === 0) {
      setErrorMsg('Tidak ada item yang ditambahkan')
      return
    }

    try {
      await TransactionsService.addTransaction(user.accessToken, ownerId, transactionsData)

      setMessageWithDelay('Berhasil menambah transaksi', 5000)
    } catch (error) {
      setErrorMsg(`Transaction ${error}`)
    }
    setDisplayedItems([])
    setTransactionsData([])
    setErrorMsg('')
  }

  const addItemHandler = async (e) => {
    e.preventDefault()

    if (!resourceId || !quantity) {
      setErrorMsg('Item dan Jumlah harus diisi')
      return
    }

    const isItemExist = displayedItems.some((item) => item.resourceId === resourceId)
    if (isItemExist) {
      setErrorMsg('Item sudah ditambahkan')
      return
    }

    const newItem = {
      resourceId,
      rscName,
      price,
      quantity,
      ownerName: owner.find((o) => o.id === ownerId)?.name,
      regCode: owner.find((o) => o.id === ownerId)?.register_code
    }

    const newDisplayedItems = [...displayedItems, newItem]
    setDisplayedItems(newDisplayedItems)

    // Data untuk backend
    const newItemForBackend = {
      resourceId,
      quantity
    }

    const newTransactionData = [...transactionsData, newItemForBackend]
    setTransactionsData(newTransactionData)

    setMessageWithDelay('Item berhasil ditambahkan', 3000)

    // Reset input fields
    setResourceId('')
    setRscName('')
    setPrice(0)
    setQuantity(1)
    setErrorMsg('')
  }

  const removeItemHandler = (index) => {
    const updatedItems = [...displayedItems]
    updatedItems.splice(index, 1)
    setDisplayedItems(updatedItems)

    const updatedTransactionData = [...transactionsData]
    updatedTransactionData.splice(index, 1)
    setTransactionsData(updatedTransactionData)
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

  const renderItem = () => {
    return rsc
      .filter((item) => item.name.toLowerCase().includes(rscFilterText.toLowerCase()))
      .map((item) => (
        <option key={item.id} value={item.name} data-value={item.price} data-id={item.id}>
          {item.name}
        </option>
      ))
  }

  const RscHandler = async (e) => {
    const name = e.target.value
    const dataset = e.target.options[e.target.selectedIndex].dataset

    setRscName(name)
    setPrice(dataset.value)
    setResourceId(dataset.id)
  }

  const OwnHandler = async (e) => {
    const name = e.target.value
    const dataset = e.target.options[e.target.selectedIndex].dataset

    setOwnerName(name)
    setRegCode(dataset.value)
    setOwnerId(dataset.id)
  }

  const calculateTotal = () => {
    let total = 0
    displayedItems.forEach((item) => {
      total += Number(item.quantity) * Number(item.price)
    })
    return total
  }

  return (
    <div className="columns min-h-screen pt-4 bg-gray-100 sm:justify-center sm:pt-0">
      <div className="column m-4 px-4 bg-white rounded-lg">
        <div className="mb-4">
          <h1 className=" text-2xl font-bold decoration-gray-400">Buat Transaksi Baru</h1>
        </div>
        <div className="w-full px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
          <form name="userForm" autoComplete="off">
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
              <label className="block text-sm font-bold text-gray-700 mb-1 mt-4">Item</label>
              <input
                className="p-1 rounded-md block my-1 ring-1 ring-gray-900/10"
                type="text"
                placeholder="Cari item..."
                value={rscFilterText}
                onChange={(e) => setRscFilterText(e.target.value)}
              />
              <select
                className="w-1/3 p-1 text-sm inline border-gray-400 rounded-md border shadow-sm text-black"
                value={rscName}
                data-value={price}
                data-id={resourceId}
                onChange={(e) => RscHandler(e)}>
                <option value="">Pilih Item</option>
                {renderItem()}
              </select>
            </div>
            <div className="w-fit p-1 border-gray-400 rounded-md border-b text-black">
              <p className="inline">Harga:</p>
              <p className="inline mx-1">
                {parseFloat(price).toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                })}
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah</label>
              <input
                className="p-2 inline w-1/3 my-1 bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 placeholder:text-left focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="number"
                min={1}
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Jumlah item"
              />
              <button
                title="Add item"
                className="inline px-2 mx-4 py-1 bold border rounded-md text-white bg-green-500 hover:bg-green-400"
                onClick={(e) => addItemHandler(e)}>
                Tambah
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="column is-6 column mr-4 my-4 px-4 bg-white rounded-lg">
        <div className="mb-4">
          <h1 className=" text-2xl font-bold decoration-gray-400">List item</h1>
        </div>
        {displayedItems && (
          <div className="w-full px-1 py-2 text-xs bg-white overflow-auto">
            <div className="text-xs bg-white rounded shadow-md ring-1 ring-gray-900/10 overflow-auto">
              <table className="w-full overflow-auto">
                <thead>
                  <tr>
                    <th className="p-2">
                      <p className="text-center">Nama</p>
                    </th>
                    <th className="p-2">
                      <p className="text-center">Harga</p>
                    </th>
                    <th className="p-2">
                      <p className="text-center">Jumlah</p>
                    </th>
                    <th className="p-2">
                      <p className="text-center">Subtotal</p>
                    </th>

                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">{item.rscName}</td>
                      <td className="p-2">
                        {parseFloat(item.price).toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        })}
                      </td>
                      <td className="p-2">
                        <p className="text-center">{Number(item.quantity)}</p>
                      </td>
                      <td className="p-2">
                        {(Number(item.quantity) * Number(item.price)).toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        })}
                      </td>
                      <td className="p-2">
                        <button onClick={() => removeItemHandler(index)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="p-2" colSpan="3">
                      Total
                    </td>
                    <td className="p-2">
                      {calculateTotal().toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
        <div className="flex w-full items-center justify-start mt-4 gap-x-2">
          <button
            onClick={(e) => saveData(e)}
            className="p-1 mr-1 w-1/2 text-sm font-semibold rounded-md shadow-md text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
            Konfirmasi
          </button>
          <button
            onClick={() => nav(-1)}
            className="p-1 ml-1 w-auto text-sm font-semibold text-white bg-gray-400 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300">
            Kembali
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormAddTransaction
