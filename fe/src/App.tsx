import { Routes,Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import EventPromotionPage from './pages/EventPromotionPage'
function App() {

  return (
  <Routes>
    <Route element={<Layout/>}>
    <Route path='/' element={<HomePage/>}/>
    <Route path="/event-promotion" element={<EventPromotionPage />} />
    </Route>
  </Routes>
  )
}

export default App
