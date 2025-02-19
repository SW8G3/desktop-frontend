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

  const [nodes, setNodes] = useState([]); // Store nodes
  const [edges, setEdges] = useState([]); // Store edges
  const [selectedNode, setSelectedNode] = useState(null); // Track node selection for connecting

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

  // Function to handle node selection for edge creation
  const handleNodeClick = (node) => {
    if (!selectedNode) {
      setSelectedNode(node);
    } else {
      setEdges([...edges, { from: selectedNode.id, to: node.id }]);
      setSelectedNode(null);
    }
  };

  // Function to update node position after dragging
  const handleDragEnd = (event, nodeId) => {
    const { lat, lng } = event.target.getLatLng();

    // Update node position
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === nodeId ? { ...node, position: [lat, lng] } : node))
    );

    // Update edges with new node positions
    setEdges((prevEdges) =>
      prevEdges.map((edge) => ({
        from: edge.from,
        to: edge.to,
      }))
    );
  };

  // Function to get the position of a node by ID
  const getNodePosition = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? node.position : [0, 0];
  };

  return (
    <>
      <div className="map-container">
        <MapContainer style={{ width: "100%", height: "100%" }} bounds={bounds} crs={L.CRS.Simple}>
          <ImageOverlay url="/2sal.png" bounds={bounds} />

          {/* Handle Clicks to Add Nodes */}
          <MapClickHandler />

          {/* Render Nodes (Draggable) */}
          {nodes.map((node) => (
            <Marker
              key={node.id}
              position={node.position}
              draggable={true}
              eventHandlers={{
                click: () => handleNodeClick(node),
                dragend: (e) => handleDragEnd(e, node.id),
              }}
            >
              <Popup>Node {node.id}</Popup>
            </Marker>
          ))}

          {/* Render Edges (Lines between Nodes) */}
          {edges.map((edge, index) => (
            <Polyline
              key={index}
              positions={[getNodePosition(edge.from), getNodePosition(edge.to)]}
              color="blue"
            />
          ))}
        </MapContainer>
      </div>
    </>
  );
}

export default App;