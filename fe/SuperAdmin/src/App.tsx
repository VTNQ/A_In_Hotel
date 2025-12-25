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
          <Route path='Admin/create' element={<CreateAdminPage />} />
          <Route path='facility' element={<FacilityPage/>}/>
          <Route path='facility/create' element={<CreateFacilityForm/>}/>
          <Route path='hotel/create' element={<AddHotelPage />} />
          <Route path='Hotel' element={<HotelPage />} />
          {/* <Route path='banner/create' element={<AddBannerPage />} />
          <Route path='banner' element={<BannerPage />} />
          <Route path='banner/edit/:id' element={<EditBannerPage />} /> */}
        </Route>
      </Routes>
    </>
  )
}

export default App
