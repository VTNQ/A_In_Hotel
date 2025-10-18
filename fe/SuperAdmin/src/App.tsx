import { Routes, Route } from 'react-router-dom'
import LoginPage from './page/LoginPage'
import HomePage from './components/HomePage'
import AdminLayout from './components/AdminLayout'
import AddHotelPage from './page/Hotel/AddHotelPage'
import HotelPage from './page/Hotel/HotelPage'
import AddBannerPage from './page/Banner/AddBannerPage'
import BannerPage from './page/Banner/BannerPagge'
import EditBannerPage from './page/Banner/EditBannerPage'
import CreateAdminPage from './page/Admin/CreateAdminPage'
import ListAdminPage from './page/Admin/ListAdminPage'
import ListSuperAdminPage from './page/ChildSuperAdmin/ListChildSuperAdminPage'
import CreateChildSuperAdminPage from './page/ChildSuperAdmin/CreateChildSuperAdminPage'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='Home' element={<AdminLayout />}>

          <Route index element={<HomePage />} />
          <Route path='ChildSuperAdmin/create' element={<CreateChildSuperAdminPage />} />
          <Route path='Admin' element={<ListAdminPage/>}/>
          <Route path='ChildSuperAdmin' element={<ListSuperAdminPage/>}/>
          <Route path='Admin/create' element={<CreateAdminPage />} />
          <Route path='hotel/create' element={<AddHotelPage />} />
          <Route path='Hotel' element={<HotelPage />} />
          <Route path='banner/create' element={<AddBannerPage />} />
          <Route path='banner' element={<BannerPage />} />
          <Route path='banner/edit/:id' element={<EditBannerPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
