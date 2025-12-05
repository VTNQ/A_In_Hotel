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

function App() {
  return(
    <>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/Dashboard' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="facility/services" element={<ViewExtraServicePage/>} />
          <Route path='facility/categories' element={<ViewCategoryPage/>}/>
          <Route path='facility/rooms' element={<ViewRoomPage/>}/>
          <Route path='facility/assets' element={<ViewAssetPage/>}/>
          <Route path='booking' element={<ViewBooking/>}/>
          <Route path='staffs' element={<ViewStaffPage/>}/>
          <Route path='post/blogs' element={<ViewBlogPage/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
