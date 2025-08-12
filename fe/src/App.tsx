import { Routes,Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import RoomPage from './pages/RoomPage'
function App() {

  return (
  <Routes>
    <Route element={<Layout/>}>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/Room' element={<RoomPage/>}/>
    </Route>
  </Routes>
  )
}

export default App
