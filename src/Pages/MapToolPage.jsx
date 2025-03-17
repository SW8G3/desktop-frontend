import { useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { uploadGraphData, downloadGraphData } from "../API/GraphAPI";
import MenuBar from "../Components/MenuBar";
import { toast } from "react-hot-toast";

const nodeIcon = new L.DivIcon({
    html: `<img src="https://cdn-icons-png.flaticon.com/512/6162/6162025.png" style="width: 30px; height: 30px;" />`,
    className: 'custom-div-icon', // Add a custom class for additional styling if needed
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [15, 15], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -15], // Point from which the popup should open relative to the iconAnchor
});

const waypointIcon = new L.DivIcon({
    html: `<img src="https://cdn-icons-png.flaticon.com/512/14035/14035769.png" style="width: 35px; height: 35px;" />`,
    className: 'custom-div-icon', // Add a custom class for additional styling if needed
    iconSize: [35, 35], // Size of the icon
    iconAnchor: [17.5, 17.5], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -17.5], // Point from which the popup should open relative to the iconAnchor
});

function MapToolPage() {
    const map_width = (420 * 350) / 1000; // A3 width in mm times 350 because the map is 1 : 350 scale, divided by 1000 to convert to meters
    const map_height = (297 * 350) / 1000; // A3 height in mm times 350 because the map is 1 : 350 scale, divided by 1000 to convert to meters

    const bounds = [
        [0, 0],
        [map_height, map_width], // Adjust based on floor plan image dimensions (height x width)
    ];

    const [nodes, setNodes] = useState([]); // Store nodes
    const [edges, setEdges] = useState([]); // Store edges
    const [selectedNode, setSelectedNode] = useState(null); // Track selected node for edge creation
    const [selectedEdge, setSelectedEdge] = useState(null); // Track selected edge for deletion
    const [nextNodeId, setNextNodeId] = useState(1); // Track next node ID
    const [availableNodeIds, setAvailableNodeIds] = useState(new Set()); // Track available node IDs
    const [nextEdgeId, setNextEdgeId] = useState(1); // Track next edge ID
    const [availableEdgeIds, setAvailableEdgeIds] = useState(new Set()); // Track available edge IDs

    const generateNextNodeId = () => {
        if (availableNodeIds.size > 0) {
            const nextId = Math.min(...availableNodeIds);
            setAvailableNodeIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(nextId);
                return newSet;
            });
            return nextId;
        } else {
            const nextId = nextNodeId;
            setNextNodeId(nextNodeId + 1);
            return nextId;
        }
    };

    const generateNextEdgeId = () => {
        if (availableEdgeIds.size > 0) {
            const nextId = Math.min(...availableEdgeIds);
            setAvailableEdgeIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(nextId);
                return newSet;
            });
            return nextId;
        } else {
            const nextId = nextEdgeId;
            setNextEdgeId(nextEdgeId + 1);
            return nextId;
        }
    };


    // Function to add nodes on map click (only if clicking directly on the map)
    function MapClickHandler() {
        useMapEvents({
            click: (e) => {
                // Prevent node creation if clicking an edge or button
                if (e.originalEvent.target.tagName === "BUTTON" || e.originalEvent.target.classList.contains("edge-click-area")) {
                    return;
                }
                const newNode = { id: generateNextNodeId(), position: [e.latlng.lat, e.latlng.lng], isWaypoint: false };
                setNodes([...nodes, newNode]);
            },
        });
        return null;
    }

    // Function to handle node selection for edge creation
    const handleNodeClick = (node) => {
        setSelectedEdge(null);
        if (!selectedNode) {
            setSelectedNode(node);
        } else {
            if (selectedNode.id === node.id) {
                return;
            }

            // Check if the edge already exists
            const edgeExists = edges.some(
                (edge) =>
                    (edge.from === selectedNode.id && edge.to === node.id) ||
                    (edge.from === node.id && edge.to === selectedNode.id)
            );

            if (!edgeExists) {
                // Calculate distance between nodes
                const fromNode = nodes.find((n) => n.id === selectedNode.id);
                const toNode = nodes.find((n) => n.id === node.id);
                const distance = Math.sqrt(
                    Math.pow(fromNode.position[0] - toNode.position[0], 2) +
                    Math.pow(fromNode.position[1] - toNode.position[1], 2)
                );
                // Create edge id from concatenating from and to node ids
                
                setEdges([...edges, { id: generateNextEdgeId(), from: selectedNode.id, to: node.id, distance }]);
            }

            setSelectedNode(null);
        }
    };

    // Function to update node position after dragging
    const handleDragEnd = (event, nodeId) => {
        const { lat, lng } = event.target.getLatLng();

        setNodes((prevNodes) =>
            prevNodes.map((node) => (node.id === nodeId ? { ...node, position: [lat, lng] } : node))
        );

        // Update distances for edges connected to the moved node
        setEdges((prevEdges) =>
            prevEdges.map((edge) => {
                if (edge.from === nodeId || edge.to === nodeId) {
                    const fromNode = edge.from === nodeId ? { ...edge, position: [lat, lng] } : nodes.find((n) => n.id === edge.from);
                    const toNode = edge.to === nodeId ? { ...edge, position: [lat, lng] } : nodes.find((n) => n.id === edge.to);
                    const distance = Math.sqrt(
                        Math.pow(fromNode.position[0] - toNode.position[0], 2) +
                        Math.pow(fromNode.position[1] - toNode.position[1], 2)
                    );
                    return { ...edge, distance };
                }
                return edge;
            })
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
        setSelectedEdge(null); // Reset selected edge
        event.stopPropagation(); // Prevents accidental node creation
        event.preventDefault();

        // Remove node and associated edges
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
        setEdges((prevEdges) => prevEdges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId));

        setAvailableNodeIds((prev) => new Set(prev).add(nodeId));
    };

    // Function to delete an edge
    const handleDeleteEdge = () => {
        if (selectedEdge !== null) {
            setEdges((prevEdges) => prevEdges.filter((_, index) => index !== selectedEdge));
            setSelectedEdge(null);
            setSelectedNode(null);
            setAvailableEdgeIds((prev) => new Set(prev).add(selectedEdge.id));
        }
    };

    const handleUpload = async () => {
        try {
            const response = await uploadGraphData(nodes, edges);
            console.log(response);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload graph data");
        }
    };

    const handleDownload = async () => {
        try {
            const { nodes, edges } = await downloadGraphData();
            setNodes(nodes);
            setEdges(edges);
            setNextNodeId(nodes.length+1);
            setAvailableNodeIds(new Set());
            setNextEdgeId(edges.length+1);
            setAvailableEdgeIds(new Set());
        } catch (error) {
            console.error(error);
            toast.error("Failed to download graph data");
        }
    };

    const toggleIsWaypoint = (nodeId) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => (node.id === nodeId ? { ...node, isWaypoint: !node.isWaypoint } : node))
        );
    }

    return (
        <>
            <MenuBar onUpload={handleUpload} onDownload={handleDownload} />
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
                            icon={node.isWaypoint ? waypointIcon : nodeIcon}
                            eventHandlers={{
                                click: () => handleNodeClick(node),
                                dragend: (e) => handleDragEnd(e, node.id),
                            }}
                        >
                            <Popup>
                                <div>
                                    <p>Node {node.id}</p>
                                    <button onClick={(e) => handleDeleteNode(e, node.id)}>Delete</button>
                                    <button onClick={() => toggleIsWaypoint(node.id)}>
                                        {node.isWaypoint ? "Remove Waypoint" : "Set Waypoint"}
                                    </button>
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
                                color={"blue"}
                                eventHandlers={{
                                    click: (e) => {
                                        e.originalEvent.stopPropagation(); // Stop map click event
                                        setSelectedEdge(index);
                                    },
                                }}
                                className="edge-click-area" // Add a class to identify edge click area
                            >
                                <Popup>
                                    <div>
                                        <p>Edge from Node {edge.from} to Node {edge.to}</p>
                                        <p>Distance: {edge.distance.toFixed(1)}</p>
                                        <button onClick={handleDeleteEdge}>Delete Edge</button>
                                    </div>
                                </Popup>
                            </Polyline>
                        );
                    })}
                </MapContainer>
            </div>
        </>
    );
}

export default MapToolPage;