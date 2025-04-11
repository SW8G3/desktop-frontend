import { useState, useEffect } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapView.css";

function MapView() {
  const bounds = [
    [0, 0],
    [1654, 2339], // Adjust based on floor plan image dimensions (height x width)
  ];

  const navigate = useNavigate(); // Initialize useNavigate
  const URLPath = window.location.pathname; // Get the current URL path

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirectFrom=' + URLPath); // Redirect to /login with redirectFrom query parameter
      }
  }, [navigate]);

  const [nodes, setNodes] = useState([]); // Store nodes
  const [edges, setEdges] = useState([]); // Store edges
  const [selectedNode, setSelectedNode] = useState(null); // Track selected node for edge creation
  const [selectedEdge, setSelectedEdge] = useState(null); // Track selected edge for deletion

  // Function to add nodes on map click (only if clicking directly on the map)
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        // Prevent node creation if clicking an edge or button
        if (e.originalEvent.target.tagName === "BUTTON" || e.originalEvent.target.classList.contains("edge-click-area")) {
          return;
        }
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
      if (selectedNode.id === node.id) {
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
    setSelectedNode(null); // Reset selected node
    event.stopPropagation(); // Prevents accidental node creation
    event.preventDefault();

    // Remove node and associated edges
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId));
  };

  // Function to delete an edge
  const handleDeleteEdge = () => {
    if (selectedEdge !== null) {
      setEdges((prevEdges) => prevEdges.filter((_, index) => index !== selectedEdge));
      setSelectedEdge(null);
    }
  };

  return (
    <>
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

          {/* Render Edges */}
          {edges.map((edge, index) => {
            const fromPos = getNodePosition(edge.from);
            const toPos = getNodePosition(edge.to);

            return (
              <Polyline
                key={index}
                positions={[fromPos, toPos]}
                color={selectedEdge === index ? "red" : "blue"} // Highlight selected edge
                eventHandlers={{
                  click: (e) => {
                    e.originalEvent.stopPropagation(); // Stop map click event
                    console.log("Edge clicked", index);
                    setSelectedEdge(index);
                  },
                }}
                className="edge-click-area" // Add a class to identify edge click area
              />
            );
          })}
        </MapContainer>

        {/* Edge Deletion Menu */}
        {selectedEdge !== null && (
          <div className="edge-menu">
            <p>Edge selected</p>
            <button onClick={handleDeleteEdge}>Delete Edge</button>
          </div>
        )}
      </div>
    </>
  );
}

export default MapView;