import { MapContainer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet explicitly
import "./App.css";

function App() {
  const bounds = [
    [0, 0], 
    [500, 800], // Adjust based on floor plan image dimensions (height x width)
  ];

  return (
    <>
      <h1>Vite + React Indoor Navigation</h1>
      <div style={{ width: "100%", height: "600px" }}>
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          bounds={bounds}
          crs={L.CRS.Simple} // Use a simple coordinate system for floor plans
        >
          <ImageOverlay url="/2sal.png" bounds={bounds} />
        </MapContainer>
      </div>
    </>
  );
}

export default App;