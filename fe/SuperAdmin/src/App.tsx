import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import LoginPage from './page/LoginPage'
import HomePage from './components/HomePage'
import AdminLayout from './components/AdminLayout'
import AddHotel from './components/Hotel/AddHotel'




function App() {

  return (
    <>
    <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='Home' element={<AdminLayout/>}>
        <Route index  element={<HomePage/>}/>
        <Route path='AddHotel' element={<AddHotel/>}/>
        </Route>
    </Routes>
    </>
  )
}

export default App
