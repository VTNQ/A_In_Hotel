import { Routes,Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import EventPromotionPage from './pages/EventPromotionPage'
import RoomPage from './pages/RoomPage'
function App() {

  return (
  <Routes>
    <Route element={<Layout/>}>
    <Route path='/' element={<HomePage/>}/>
    <Route path="/event-promotion" element={<EventPromotionPage />} />
    <Route path='/Room' element={<RoomPage/>}/>
    </Route>
  </Routes>
  )
}

export default App
