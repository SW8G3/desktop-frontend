import { Routes, Route, Navigate } from 'react-router-dom';
import MapToolPage from './Pages/MapToolPage';
import './App.css';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/map-tool" />} />
      <Route path="/map-tool" element={<MapToolPage />} />
    </Routes>
    </>
  );
}

export default App;