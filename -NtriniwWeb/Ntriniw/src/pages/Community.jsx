import React, { useEffect } from 'react'
import { storiesData } from '../data';
import { FaPlusCircle } from "react-icons/fa"
import Home2 from '../components/Communityy/Home2.jsx';
import AuthService from '../services/api';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <Home2 />
    </>
  )
}

export default Community