import { Routes,Route } from 'react-router-dom'
import Layout from './components/layouts/Layout'
import HomePage from './pages/HomePage'
import EventPromotionPage from './pages/EventPromotionPage'
import RoomPage from './pages/RoomPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLeftBar from './components/AdminLeftBar'
import AdminLayout from './components/layouts/AdminLayout'
function App() {

  return (
  <Routes>
    <Route element={<Layout/>}>
    <Route path='/' element={<HomePage/>}/>
   
    <Route path="/event-promotion" element={<EventPromotionPage />} />
    <Route path='/Room' element={<RoomPage/>}/>
    <Route path='/Login' element={<LoginPage/>}/>
    <Route path="/Register" element={<RegisterPage/>} />
    </Route>
     <Route path='/leftBar' element={<AdminLayout/>}/>
  </Routes>
  )
}

export default App
