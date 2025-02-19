import { MapContainer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet explicitly
import "./App.css";

function App() {
  const bounds = [
    [0, 0], 
    [1654, 2339], // Adjust based on floor plan image dimensions (height x width)
  ];

  return (
    <>
      
      <div className="map-container">
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