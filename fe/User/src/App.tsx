import { Routes,Route } from 'react-router-dom'
import Layout from './components/layouts/Layout'
import HomePage from './pages/HomePage';
import EventPromotionPage from './pages/EventPromotionPage'
import RoomPage from './pages/RoomPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HotelRoomPage from './pages/HotelRoomPage';
import RoomDetailPage from './pages/RoomDetailPage';
import ConfirmBooking from './pages/ConfirmBooking';
import GalleryPage from './pages/GalleryPage';
function App() {

  return (
  <Routes>
    <Route element={<Layout/>}>
    <Route path='/' element={<HomePage/>}/>
   
    <Route path="/event-promotion" element={<EventPromotionPage />} />
    <Route path='/Room' element={<RoomPage/>}/>
    <Route path='/Hotel/Room/:id' element={<HotelRoomPage/>}/>
    <Route path='/confirmBooking' element={<ConfirmBooking/>} />
    <Route path='/gallery' element={<GalleryPage/>}/>
    <Route path='/Room/:id' element={<RoomDetailPage/>}/>
    <Route path='/Login' element={<LoginPage/>}/>
    <Route path="/Register" element={<RegisterPage/>} />
    </Route>
  
  </Routes>
  )
}

export default App
