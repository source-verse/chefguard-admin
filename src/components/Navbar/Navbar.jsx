import React from 'react'
import Sidebar from './Sidebar/Sidebar'
import Header from './Header/Header'
import Products from '../../pages/AdminPanel/Products/Products'
import { Route, Routes } from 'react-router-dom'
import CategoryPage from '../../pages/AdminPanel/CategoryPage/CategoryPage'
import BannerPage from '../../pages/AdminPanel/Banner/BannerPage'
import Dashboard from '../../pages/AdminPanel/Dashboard/Dashboard'
import Testimonials from '../../pages/AdminPanel/Testimonials/Testimonials'
import EmployeePage from '../../pages/AdminPanel/Employee/Employee'

function MainLayout() {
  return (
    <>
    <Sidebar />

    <div className="body-wrapper">

      <Header />

      <div className="container-fluid">
        {/* <div className="card">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-4">Sample Page</h5>
            <p className="mb-0">This is a sample page </p>
          </div>
        </div> */}
        <Routes>
        {/* <Route path='/home' element={<Home />}></Route> */}
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/products' element={<Products />}></Route>
        <Route path='/categories' element={<CategoryPage />}></Route>
        <Route path='/banners' element={<BannerPage />}></Route>
        <Route path='/testimonials' element={<Testimonials />}></Route>
        <Route path='/employees' element={<EmployeePage />}></Route>
        </Routes>
      </div>
    </div>
    {/* </div> */}
  </>
  )
}

export default MainLayout