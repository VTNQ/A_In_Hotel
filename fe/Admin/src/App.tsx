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
import ViewPromotion from './page/Promotion/ViewPromotion'
import ViewVoucherPage from './page/Voucher/ViewVoucherPage'
import ViewCustomerPage from './page/Customer/ViewCustomerPage'
import CustomerDetailPage from './page/Customer/CustomerDetailPage'

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
          <Route path='customer' element={<ViewCustomerPage/>}/>
          <Route path='customer/:id' element={<CustomerDetailPage/>}/>
          <Route path='booking' element={<ViewBooking/>}/>
          <Route path='booking/create' element={<CreateBooking/>}/>
          <Route path='post/banner' element={<ViewBanner/>}/>
          <Route path='post/blog' element={<ViewBlogPage/>}/>
          <Route path='coupon/promotion' element={<ViewPromotion/>}/>
          <Route path='coupon/voucher' element={<ViewVoucherPage/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
