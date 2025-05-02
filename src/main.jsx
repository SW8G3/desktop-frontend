import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './Home.jsx';
import LogIn from './LogIn.jsx';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import MapToolPage from './Pages/MapToolPage.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={< LogIn />} />
        <Route path="/map" element={<MapToolPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
