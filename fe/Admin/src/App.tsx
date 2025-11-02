import { Routes, Route } from 'react-router-dom'
import HomePage from './page/HomePage'
import ViewExtraServicePage from './page/ExtraService/ViewExtraServicePage'
import MainLayout from './components/Layout'
import LoginPage from './page/LoginPage'
import ViewCategoryPage from './page/Category/ViewCategoryPage'

function App() {
  return(
    <>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/Dashboard' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="facility/services" element={<ViewExtraServicePage/>} />
          <Route path='facility/categories' element={<ViewCategoryPage/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
