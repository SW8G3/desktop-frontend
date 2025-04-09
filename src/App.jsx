import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import './App.css';

function App() {
  const navigate = useNavigate(); // Initialize useNavigate
  const URLPath = window.location.pathname; // Get the current URL path

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirectFrom=' + URLPath); // Redirect to /login with redirectFrom query parameter
      }
  }, [navigate]);

  return (
      <div>
        
      </div>
  );
}

export default App;