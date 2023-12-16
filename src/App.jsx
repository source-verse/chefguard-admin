import { useState } from 'react'
import './App.css'
import '../src/stylesheets/style.css'
import { Navigate, Route, Routes } from 'react-router-dom'
// import Dashboard from './pages/AdminPanel/AdminPanel'
import AdminPanel from './pages/AdminPanel/AdminPanel'
import Login from './pages/Login/Login'

function App() {
  const [count, setCount] = useState(0)
// console.log(process.env.apiKey)
  return (
    <>
    
    
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route path='/admin/*' element={<AdminPanel />}></Route>
      <Route path='/login' element={<Login />}></Route>
    </Routes>
      {/* </div> */}
    </>
  )
}

export default App
