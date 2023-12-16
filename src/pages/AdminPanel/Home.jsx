import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      console.log("loggedin exists")
      navigate('/login')
      return;
    }
  }, []);
  return (
    <div>Home</div>
  )
}

export default Home