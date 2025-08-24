import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import LoginPage from './page/LoginPage'
import HomePage from './components/HomePage'
import AdminLayout from './components/AdminLayout'
import AddHotel from './components/Hotel/AddHotel'
import ListHotel from './components/Hotel/ListHotel'





function App() {

  return (
    <>
    <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='Home' element={<AdminLayout/>}>
        <Route index  element={<HomePage/>}/>
        <Route path='hotel/create' element={<AddHotel/>}/>
        <Route path='Hotel' element={<ListHotel/>}/>
        </Route>
    </Routes>
    </>
  )
}

export default App
