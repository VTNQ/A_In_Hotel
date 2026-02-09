import { Routes, Route } from 'react-router-dom'
import LoginPage from './page/LoginPage'
import HomePage from './components/HomePage'
import AdminLayout from './components/AdminLayout'
import AddHotelPage from './page/Hotel/AddHotelPage'
import HotelPage from './page/Hotel/HotelPage'
import CreateAdminPage from './page/Admin/CreateAdminPage'
import ListAdminPage from './page/Admin/ListAdminPage'
import ListSuperAdminPage from './page/ChildSuperAdmin/ListChildSuperAdminPage'
import CreateChildSuperAdminPage from './page/ChildSuperAdmin/CreateChildSuperAdminPage'
import ResetPasswordPage from './page/ResetPasswordPage'
import AboutHotelContent from './page/SystemContent/AboutHotelContent'
import FacilityPage from './page/Facility/FacilityPage'
import CreateFacilityForm from './page/Facility/CreateFacilityForm'
import CreateCategoryPage from './page/category/CreateCategoryPage'
import ViewCategoryPage from './page/category/ViewCategoryPage'
import ExtraServicePage from './page/ExtraService/ExtraServicePage'
import CreateExtraServicePage from './page/ExtraService/CreateExtraServicePage'
import AssetPage from './page/Asset/AssetPage'
import CreateAssetPage from './page/Asset/CreateAssetPage'
import RoomPage from './page/Room/RoomPage'
import CreateRoomPage from './page/Room/CreateRoomPage'
import CreateBanner from './page/Banner/CreateBanner'
import BannerPage from './page/Banner/BannerPage'
import ViewBlogPage from './page/Blog/ViewBlogPage'
import CreateBlogPage from './page/Blog/CreateBlogPage'
import CreateBookingPage from './page/Booking/CreateBookingPage'
import ViewBookingPage from './page/Booking/ViewBookingPage'
import ViewStaffPage from './page/Staff/ViewStaffPage'
import  CreateStaffPage from './page/Staff/CreateStaffPage'
import PromotionPage from './page/Promotion/PromotionPage'
import CreatePromotionPage from './page/Promotion/CreatePromotionPage'
import ViewVoucherPage from './page/Voucher/ViewVoucherPage'
import CreateVoucherPage from './page/Voucher/CreateVoucherPage'
import ViewCustomerPage from './page/Customer/ViewCustomerPage'
import CustomerDetailPage from './page/Customer/CustomerDetailPage'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/reset' element={<ResetPasswordPage/>}/>
        <Route path='Home' element={<AdminLayout />}>

          <Route index element={<HomePage />} />
          <Route path='system-content/about-hotel' element={<AboutHotelContent/>}/>
          <Route path='ChildSuperAdmin/create' element={<CreateChildSuperAdminPage />} />
          <Route path='Admin' element={<ListAdminPage/>}/>
          <Route path='ChildSuperAdmin' element={<ListSuperAdminPage/>}/>
          <Route path='category' element={<ViewCategoryPage/>}/>
          <Route path='category/create' element={<CreateCategoryPage/>}/>
          <Route path='room' element={<RoomPage/>}/>
          <Route path='room/create' element={<CreateRoomPage/>}/>
          <Route path='staff' element={<ViewStaffPage/>}/>
          <Route path='staff/create' element={<CreateStaffPage/>}/>
          <Route path='post/banner/create' element={<CreateBanner/>}/>
          <Route path='coupon/promotion' element={<PromotionPage/>}/>
          <Route path='coupon/voucher' element={<ViewVoucherPage/>}/>
          <Route path='coupon/voucher/create' element={<CreateVoucherPage/>}/>
          <Route path='coupon/promotion/create' element={<CreatePromotionPage/>}/>
          <Route path='post/banner' element={<BannerPage/>}/>
          <Route path='customer' element={<ViewCustomerPage/>}/>
          <Route path='customer/:id' element={<CustomerDetailPage/>}/>
          <Route path='service' element={<ExtraServicePage/>}/>
          <Route path='service/create' element={<CreateExtraServicePage/>}/>
          <Route path='asset' element={<AssetPage/>}/>
          <Route path='asset/create' element={<CreateAssetPage/>}/>
          <Route path='booking/create' element={<CreateBookingPage/>}/>
          <Route path='booking' element={<ViewBookingPage/>}/>
          <Route path='Admin/create' element={<CreateAdminPage />} />
          <Route path='facility' element={<FacilityPage/>}/>
          <Route path='facility/create' element={<CreateFacilityForm/>}/>
          <Route path='post/blog' element={<ViewBlogPage/>}/>
          <Route path='post/blog/create' element={<CreateBlogPage/>}/>
          <Route path='hotel/create' element={<AddHotelPage />} />
          <Route path='Hotel' element={<HotelPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
