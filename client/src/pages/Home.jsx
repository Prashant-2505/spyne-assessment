import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/cars');
  }, [navigate]);

  return null; // No content needed as this redirects immediately
};

export default Home;
