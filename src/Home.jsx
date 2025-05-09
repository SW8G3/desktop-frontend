import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import './Home.css';

function Home() {
  const navigate = useNavigate(); // Initialize useNavigate
  const URLPath = window.location.pathname; // Get the current URL path

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirectFrom=' + URLPath); // Redirect to /login with redirectFrom query parameter
      }
  }, [navigate, URLPath]); // Add URLPath to the dependency array

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is a WIP page.</p>
      <button onClick={() => navigate('/map')}>Go to Map Tool</button>
    </div>
  );
}

export default Home;