import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const Home = () => {
   const navigate = useNavigate(); // Initialize useNavigate

   useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login?redirectFrom=' + window.location.pathname); // Redirect to /login with redirectFrom query parameter
    }
}, [navigate]);

    return (
      <div>
          
      </div>
    );
};

export default Home;