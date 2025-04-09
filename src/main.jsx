import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './Home.jsx';
import MapView from './MapView.jsx';
import LogIn from './LogIn.jsx';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={< LogIn />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
</StrictMode>,
);
