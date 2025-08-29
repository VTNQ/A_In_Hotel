import { Routes,Route } from 'react-router-dom'
import LoginPage from './page/LoginPage'
import HomePage from './components/HomePage'
import AdminLayout from './components/AdminLayout'
import AddHotelPage from './page/Hotel/AddHotelPage'
import HotelPage from './page/Hotel/HotelPage'





function App() {

  return (
    <>
    <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='Home' element={<AdminLayout/>}>
        <Route index  element={<HomePage/>}/>
        <Route path='hotel/create' element={<AddHotelPage/>}/>
        <Route path='Hotel' element={<HotelPage/>}/>
        </Route>
    </Routes>
    </>
  )
}

export default App
