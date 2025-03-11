import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import UserView from './UserView.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} /> {/* Admin View */}
      <Route path="/user" element={<UserView />} /> {/* User View */}
    </Routes>
    </BrowserRouter>
  </StrictMode>,
);
