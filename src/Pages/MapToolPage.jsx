import React from 'react';
import { useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import './MapToolPage.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { uploadGraphData, downloadGraphData } from '../API/GraphAPI';
import MenuBar from '../Components/MenuBar';
import { toast } from 'react-hot-toast';

const nodeIcon = new L.DivIcon({
    html: '<img src=\'https://cdn-icons-png.flaticon.com/512/6162/6162025.png\' style=\'width: 30px; height: 30px;\' />',
    className: 'custom-div-icon', // Add a custom class for additional styling if needed
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [15, 15], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -15], // Point from which the popup should open relative to the iconAnchor
});

const waypointIcon = new L.DivIcon({
    html: '<img src=\'https://cdn-icons-png.flaticon.com/512/14035/14035769.png\' style=\'width: 35px; height: 35px;\' />',
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
                if (e.originalEvent.target.tagName === 'BUTTON' || e.originalEvent.target.classList.contains('edge-click-area')) {
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
                    (edge.nodeA === selectedNode.id && edge.nodeB === node.id) ||
                    (edge.nodeA === node.id && edge.nodeB === selectedNode.id)
            );

            if (!edgeExists) {
                // Calculate distance between nodes
                const fromNode = nodes.find((n) => n.id === selectedNode.id);
                const toNode = nodes.find((n) => n.id === node.id);
                const distance = Math.sqrt(
                    Math.pow(fromNode.position[0] - toNode.position[0], 2) +
                    Math.pow(fromNode.position[1] - toNode.position[1], 2)
                );


                setEdges([...edges, { id: generateNextEdgeId(), nodeA: selectedNode.id, nodeB: node.id, distance }]);
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
                if (edge.nodeA === nodeId || edge.nodeB === nodeId) {
                    const fromNode = edge.nodeA === nodeId ? { ...edge, position: [lat, lng] } : nodes.find((n) => n.id === edge.nodeA);
                    const toNode = edge.nodeB === nodeId ? { ...edge, position: [lat, lng] } : nodes.find((n) => n.id === edge.nodeB);
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
        setEdges((prevEdges) => prevEdges.filter((edge) => edge.nodeA !== nodeId && edge.nodeB !== nodeId));

        setAvailableNodeIds((prev) => new Set(prev).add(nodeId));
    };

    // Function to delete an edge
    const handleDeleteEdge = () => {
        if (selectedEdge !== null) {
            setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== selectedEdge.id));
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
            toast.error('Failed to upload graph data');
        }
    };

    const handleDownload = async () => {
        try {
            const { nodes, edges } = await downloadGraphData();
            setNodes(nodes);
            setEdges(edges);
            setNextNodeId(nodes.length + 1);
            setAvailableNodeIds(new Set());
            setNextEdgeId(edges.length + 1);
            setAvailableEdgeIds(new Set());
        } catch (error) {
            console.error(error);
            toast.error('Failed to download graph data');
        }
    };

    const handleTagInputChange = (nodeId, value) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === nodeId ? { ...node, newTag: value } : node
            )
        );
    };

    const handleDeleteSearchTag = (nodeId, tagToDelete) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === nodeId
                    ? { ...node, searchTags: node.searchTags.filter((tag) => tag !== tagToDelete) }
                    : node
            )
        );
    };

    const handleAddSearchTag = (nodeId) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => {
                if (node.id === nodeId && node.newTag?.trim()) {
                    const updatedTags = node.searchTags
                        ? [...node.searchTags, node.newTag.trim()]
                        : [node.newTag.trim()];
                    return { ...node, searchTags: updatedTags, newTag: '' };
                }
                return node;
            })
        );
    };

    const toggleIsWaypoint = (nodeId) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => (node.id === nodeId ? { ...node, isWaypoint: !node.isWaypoint } : node))
        );
    };

    return (
        <>
            <MenuBar onUpload={handleUpload} onDownload={handleDownload} />
            <div className='map-container'>
                <MapContainer style={{ width: '100%', height: '100%' }} bounds={bounds} crs={L.CRS.Simple}>
                    <ImageOverlay url='/2sal.png' bounds={bounds} />

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
                                    <p>Search tags:</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {node.searchTags?.map((tag, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '2px 5px',
                                                    backgroundColor: '#f0f0f0',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleDeleteSearchTag(node.id, tag)}
                                            >
                                                {tag} ✖
                                            </div>
                                        )) || <span>None</span>}
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <input
                                            type="text"
                                            placeholder="Add a tag"
                                            value={node.newTag || ''}
                                            onChange={(e) => handleTagInputChange(node.id, e.target.value)}
                                            style={{
                                                padding: '5px',
                                                border: '1px solid #ccc',
                                                borderRadius: '3px',
                                                marginRight: '5px',
                                            }}
                                        />
                                        <button onClick={() => handleAddSearchTag(node.id)}>Add Tag</button>
                                    </div>
                                    <button onClick={(e) => handleDeleteNode(e, node.id)}>Delete</button>
                                    <button onClick={() => toggleIsWaypoint(node.id)}>
                                        {node.isWaypoint ? 'Remove Waypoint' : 'Set Waypoint'}
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Render Edges */}
                    {edges.map((edge) => {
                        const fromPos = getNodePosition(edge.nodeA);
                        const toPos = getNodePosition(edge.nodeB);

                        // Calculate the midpoint of the edge
                        const midPoint = [
                            (fromPos[0] + toPos[0]) / 2,
                            (fromPos[1] + toPos[1]) / 2,
                        ];

                        // Create a DivIcon for the clearance label
                        // Create a DivIcon for the clearance label
                        const clearanceLabel = new L.DivIcon({
                            html: `<div style="background-color: white; color: black; padding: 2px 5px; border: 1px solid black; border-radius: 3px; font-size: 12px; text-align: center;'>
                                        ${edge.clearance || 0}
                                    </div>`,
                            className: 'clearance-label',
                            iconSize: [15, 7.5], // 50% smaller than the original size
                            iconAnchor: [7.5, 3.75], // Adjust anchor to keep it centered
                        });

                        console.log(clearanceLabel);

                        return (
                            <React.Fragment key={`${edge.id}-${edge.isObstructed}`}>
                                {/* Render the edge as a Polyline */}
                                <Polyline
                                    positions={[fromPos, toPos]}
                                    color={edge.isObstructed ? 'red' : 'blue'} // Red if obstructed, blue otherwise
                                    eventHandlers={{
                                        click: (e) => {
                                            e.originalEvent.stopPropagation(); // Stop map click event
                                            setSelectedEdge(edge);
                                        },
                                    }}
                                    className="edge-click-area" // Add a class to identify edge click area
                                >
                                    <Popup>
                                        <div>
                                            <p>Edge from Node {edge.nodeA} to Node {edge.nodeB}</p>
                                            <p>Distance: {edge.distance.toFixed(1)}</p>
                                            <p>Obstructed: {edge.isObstructed ? 'Yes' : 'No'}</p>
                                            <button
                                                onClick={() => {
                                                    setEdges((prevEdges) =>
                                                        prevEdges.map((e) =>
                                                            e.id === edge.id ? { ...e, isObstructed: !e.isObstructed } : e
                                                        )
                                                    );
                                                }}
                                            >
                                                {edge.isObstructed ? 'Mark as Unobstructed' : 'Mark as Obstructed'}
                                            </button>
                                            <button onClick={handleDeleteEdge}>Delete Edge</button>
                                            <div>
                                                <label htmlFor={`clearance-${edge.id}`}>Clearance Level:</label>
                                                <select
                                                    id={`clearance-${edge.id}`}
                                                    value={edge.clearance || 0} // Default to 0 if clearance is not set
                                                    onChange={(e) => {
                                                        const newClearance = parseInt(e.target.value, 10);
                                                        setEdges((prevEdges) =>
                                                            prevEdges.map((edgeItem) =>
                                                                edgeItem.id === edge.id ? { ...edgeItem, clearance: newClearance } : edgeItem
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <option value={0}>0</option>
                                                    <option value={1}>1</option>
                                                    <option value={2}>2</option>
                                                    <option value={3}>3</option>
                                                </select>
                                            </div>
                                        </div>
                                    </Popup>
                                </Polyline>

                                {/* Render the clearance label as a Marker */}
                                <Marker position={midPoint} icon={clearanceLabel} interactive={false} />
                            </React.Fragment>
                        );
                    })}
                </MapContainer>
            </div>
        </>
    );
}

export default MapToolPage;