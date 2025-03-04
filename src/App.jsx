import { Routes, Route, Navigate } from 'react-router-dom';
import MapToolPage from './Pages/MapToolPage';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/map-tool" />} />
        <Route path="/map-tool" element={<MapToolPage />} />
      </Routes>
    </>
  );
}

export default App;