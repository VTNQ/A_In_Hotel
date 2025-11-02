import { Routes, Route } from 'react-router-dom'
import HomePage from './page/HomePage'
import ViewExtraServicePage from './page/ExtraService/ViewExtraServicePage'
import MainLayout from './components/Layout'
import LoginPage from './page/LoginPage'

function App() {
  return(
    <>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/Dashboard' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="facility/services" element={<ViewExtraServicePage/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
