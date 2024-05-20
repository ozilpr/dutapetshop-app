import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './components/Authentications/Authentication'
import PrivateRoute from './router/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminPage from './pages/Admin/AdminPage'
import AddAdmin from './pages/Admin/AddAdmin'
import EditAdmin from './pages/Admin/EditAdmin'
import ResourcesPage from './pages/Resources/ResourcesPage'
import AddResource from './pages/Resources/AddResource'
import EditResource from './pages/Resources/EditResource'
import OwnersPage from './pages/Owners/OwnersPage'
import AddOwner from './pages/Owners/AddOwner'
import EditOwner from './pages/Owners/EditOwner'
// import
import AddPet from './pages/Pets/AddPet'
import PetsPage from './pages/Pets/PetsPage'
import EditPet from './pages/Pets/EditPet'
import TransactionsPage from './pages/Transactions/TransactionsPage'
import AddTransaction from './pages/Transactions/AddTransaction'
import OwnerProfilePage from './pages/Owners/OwnerProfilePage'
import OwnerTransactionPage from './pages/Transactions/OwnerTransactionPage'
import PetById from './pages/Pets/PetById'
import AddPetOwner from './pages/Pets/AddPetOwner'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/add-admin" element={<AddAdmin />} />
              <Route path="/edit-admin" element={<EditAdmin />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/add-resource" element={<AddResource />} />
              <Route path="/edit-resource" element={<EditResource />} />
              <Route path="/owners" element={<OwnersPage />} />
              <Route path="/owner-profile" element={<OwnerProfilePage />} />
              <Route path="/add-owner" element={<AddOwner />} />
              <Route path="/edit-owner" element={<EditOwner />} />
              <Route path="/pets" element={<PetsPage />} />
              <Route path="/pet" element={<PetById />} />
              <Route path="/add-pet" element={<AddPet />} />
              <Route path="/add-pet-owner" element={<AddPetOwner />} />
              <Route path="/edit-pet" element={<EditPet />} />
              <Route path="/transaction/detail" element={<TransactionsPage />} />
              <Route path="/add-transaction" element={<AddTransaction />} />
              <Route path="/transaction/detail/owner" element={<OwnerTransactionPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
