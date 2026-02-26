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
import BookingSuccess from './pages/BookingSuccess';
import OAuth2Success from './pages/OAuth2SuccessPage';
import BookingContentSection from './pages/BookingContentSection';
import PromotionPage from './pages/PromotionPage';
import PromotionDetailPage from './pages/PromotionDetailPage';
import MyBookingsPage from './pages/MyBookingPage';
import BookingDetailPage from './pages/BookingDetailPage';
function App() {

  return (
  <Routes>
    <Route element={<Layout/>}>
    <Route path='/' element={<HomePage/>}/>
   <Route path="/oauth2/success" element={<OAuth2Success />} />
    <Route path="/event-promotion" element={<EventPromotionPage />} />
    <Route path='/Room' element={<RoomPage/>}/>
    <Route path='/Hotel/Room/:id' element={<HotelRoomPage/>}/>
    <Route path='/confirmBooking' element={<ConfirmBooking/>} />
    <Route path='/gallery' element={<GalleryPage/>}/>
    <Route path='/my-booking/:id' element={<BookingDetailPage/>}/>
    <Route path='/Room/:id' element={<RoomDetailPage/>}/>
    <Route path='/Login' element={<LoginPage/>}/>
    <Route path='/promotion' element={<PromotionPage/>}/>
    <Route path='/my-booking' element={<MyBookingsPage/>}/>
    <Route path='/promotion/:id' element={<PromotionDetailPage/>}/>
    <Route path="/Register" element={<RegisterPage/>} />
    <Route path="/booking-success" element={<BookingSuccess />} />
    <Route path='/booking-v2' element={<BookingContentSection/>}/>
    </Route>
  
  </Routes>
  )
}

export default App
