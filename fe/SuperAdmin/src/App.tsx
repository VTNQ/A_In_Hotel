import { Routes,Route } from 'react-router-dom'
import LoginPage from './page/LoginPage'
import HomePage from './components/HomePage'
import AdminLayout from './components/AdminLayout'
import AddHotelPage from './page/Hotel/AddHotelPage'
import HotelPage from './page/Hotel/HotelPage'
import AddBannerPage from './page/Banner/AddBannerPage'
import BannerPage from './page/Banner/BannerPagge'
import EditBannerPage from './page/Banner/EditBannerPage'






function App() {

  return (
    <>
    <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='Home' element={<AdminLayout/>}>
        <Route index  element={<HomePage/>}/>
        <Route path='hotel/create' element={<AddHotelPage/>}/>
        <Route path='Hotel' element={<HotelPage/>}/>
        <Route path='banner/create' element={<AddBannerPage/>}/>
        <Route path='banner' element={<BannerPage/>}/>
        <Route path='banner/edit/:id' element={<EditBannerPage/>}/>
        </Route>
    </Routes>
    </>
  )
}

export default App
