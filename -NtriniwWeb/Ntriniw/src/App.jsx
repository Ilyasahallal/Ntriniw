import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import Community from './pages/Community.jsx'

function App() {
  const location = useLocation();

  // Define routes where the landing page navbar should NOT appear
  const hideNavbarRoutes = [
    '/Community',
    '/Profile',
    '/search',
    '/messages',
    '/Login'
  ];

  // Check if current path starts with any of the hidden routes (to handle dynamic routes like /Profile/:id)
  const shouldHideNavbar = hideNavbarRoutes.some(route => {
    if (route === '/') return location.pathname === '/'; // Exact match for home if we wanted to hide it there (we don't)
    return location.pathname.toLowerCase().startsWith(route.toLowerCase());
  });

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Outlet />
    </>
  )
}

export default App
