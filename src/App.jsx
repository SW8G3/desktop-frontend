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
  const [selectedNode, setSelectedNode] = useState(null); // Track selected node for edge creation

  // Function to add nodes on map click (only if clicking directly on the map)
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        if (e.originalEvent.target.tagName !== "BUTTON") { // Prevent accidental node creation
          const newNode = { id: nodes.length + 1, position: [e.latlng.lat, e.latlng.lng] };
          setNodes([...nodes, newNode]);
        }
      },
    });
    return null;
  }

  // Function to handle node selection for edge creation
  const handleNodeClick = (node) => {
    if (!selectedNode) {
      setSelectedNode(node);
    } else {
      if (selectedNode.id === node.id) {
        alert("Cannot create an edge to the same node!"); // Prevent self-loops
        return;
      }

      setEdges([...edges, { from: selectedNode.id, to: node.id }]);
      setSelectedNode(null);
    }
  };

  // Function to update node position after dragging
  const handleDragEnd = (event, nodeId) => {
    const { lat, lng } = event.target.getLatLng();
    
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === nodeId ? { ...node, position: [lat, lng] } : node))
    );
  };

  // Function to get the position of a node by ID
  const getNodePosition = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? node.position : [0, 0];
  };

  // Function to delete a node (via menu button)
  const handleDeleteNode = (event, nodeId) => {
    event.stopPropagation(); // Prevents accidental node creation
    event.preventDefault();

    // Remove node and associated edges
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId));
  };

  // Function to delete an edge (right-click)
  const handleEdgeRightClick = (event, edgeIndex) => {
    event.preventDefault(); // Prevent default browser context menu
    setEdges((prevEdges) => prevEdges.filter((_, index) => index !== edgeIndex));
  };

  return (
    <>
      <h1>Indoor Navigation</h1>
      <div className="map-container">
        <MapContainer style={{ width: "100%", height: "100%" }} bounds={bounds} crs={L.CRS.Simple}>
          <ImageOverlay url="/2sal.png" bounds={bounds} />

          {/* Handle Clicks to Add Nodes */}
          <MapClickHandler />

          {/* Render Nodes (Draggable & Clickable) */}
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
              <Popup>
                <div>
                  <p>Node {node.id}</p>
                  <button onClick={(e) => handleDeleteNode(e, node.id)}>Delete</button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Edges (Right-Click to Delete) */}
          {edges.map((edge, index) => (
            <Polyline
              key={index}
              positions={[getNodePosition(edge.from), getNodePosition(edge.to)]}
              color="blue"
              eventHandlers={{
                contextmenu: (e) => handleEdgeRightClick(e, index), // Right-click to delete
              }}
            />
          ))}
        </MapContainer>
      </div>
    </>
  );
}

export default App;