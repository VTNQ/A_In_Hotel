import { Routes, Route } from 'react-router-dom'
import HomePage from './page/HomePage'
import ViewExtraServicePage from './page/ExtraService/ViewExtraServicePage'
import MainLayout from './components/Layout'
import LoginPage from './page/LoginPage'
import ViewCategoryPage from './page/Category/ViewCategoryPage'
import ViewRoomPage from './page/Room/ViewRoomPage'
import ViewAssetPage from './page/Asset/ViewAssetPage'
import ViewStaffPage from './page/Staff/ViewStaffPage'
import ViewBlogPage from './page/Blog/ViewBlogPage'
import ViewBooking from './page/Booking/ViewBooking'
import ViewBanner from './page/Banner/ViewBanner'
import CreateBooking from './page/Booking/CreateBooking'

function App() {
  return(
    <>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/Dashboard' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="facility/service" element={<ViewExtraServicePage/>} />
          <Route path='facility/category' element={<ViewCategoryPage/>}/>
          <Route path='facility/room' element={<ViewRoomPage/>}/>
          <Route path='facility/asset' element={<ViewAssetPage/>}/>
          <Route path='booking' element={<ViewBooking/>}/>
          <Route path='staff' element={<ViewStaffPage/>}/>
          <Route path='booking' element={<ViewBooking/>}/>
          <Route path='booking/create' element={<CreateBooking/>}/>
          <Route path='post/banner' element={<ViewBanner/>}/>
          <Route path='post/blog' element={<ViewBlogPage/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
