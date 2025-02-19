import { useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

function App() {
  const bounds = [
    [0, 0], 
    [1654, 2339], // Adjust based on floor plan image dimensions (height x width)
  ];

  const [nodes, setNodes] = useState([]); // Store node positions
  const [edges, setEdges] = useState([]); // Store edges (connections between nodes)
  const [selectedNode, setSelectedNode] = useState(null); // Track first selected node for edge creation

  // Function to add nodes on map click
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        const newNode = { id: nodes.length + 1, position: [e.latlng.lat, e.latlng.lng] };
        setNodes([...nodes, newNode]);
      },
    });
    return null;
  }

  // Function to handle node click (for connecting nodes with edges)
  const handleNodeClick = (node) => {
    if (!selectedNode) {
      setSelectedNode(node);
    } else {
      setEdges([...edges, { from: selectedNode, to: node }]);
      setSelectedNode(null);
    }
  };

  return (
    <>
      
      <div className="map-container">
        <MapContainer style={{ width: "100%", height: "100%" }} bounds={bounds} crs={L.CRS.Simple}>
          <ImageOverlay url="/2sal.png" bounds={bounds} />

          {/* Handle Clicks to Add Nodes */}
          <MapClickHandler />

          {/* Render Nodes */}
          {nodes.map((node) => (
            <Marker key={node.id} position={node.position} eventHandlers={{ click: () => handleNodeClick(node) }}>
              <Popup>Node {node.id}</Popup>
            </Marker>
          ))}

          {/* Render Edges as Lines */}
          {edges.map((edge, index) => (
            <Polyline key={index} positions={[edge.from.position, edge.to.position]} color="blue" />
          ))}
        </MapContainer>
      </div>
    </>
  );
}

export default App;