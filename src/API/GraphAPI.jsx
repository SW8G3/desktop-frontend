import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

/**
 * @typedef {Object} Node
 * @property {string} id
 * @property {Array<number>} position
 * @property {boolean} isWaypoint
 */

/** 
 * @typedef {Object} Edge
 * @property {number} from
 * @property {number} to
 * @property {number} distance
 */

/**
 * 
 * @typedef {Object} Graph
 * @property {Array<Node>} nodes
 * @property {Array<Edge>} edges
 */

/** 
 * @param {Array<Node>} nodes
 * @param {Array<Edge>} edges
 * @returns {Graph}
 */
function buildGraphObject(nodes, edges) {
    return {
        nodes: nodes.map((node) => ({
            id: node.id,
            position: node.position,
            isWaypoint: node.isWaypoint,
        })),
        edges: edges.map((edge) => ({
            from: edge.from,
            to: edge.to,
            distance: edge.distance,
        })),
    };
}
/**
 * Download graph data from the server
 * @returns {Promise<Graph>}
 */
const downloadGraphData = async () => {
    const response = await api.get('/graph/download');
    return response.data;
};

/**
 * Upload graph data to the server
 * @param {Array<Node>} nodes
 * @param {Array<Edge>} edges
 * @returns {Promise<Object>}
 */
const uploadGraphData = async (nodes, edges) => {
    console.log('Uploading graph data...');
    console.log({ nodes, edges });

    const graphData = buildGraphObject(nodes, edges);

    console.log({ graphData });
    const response = await api.post('/graph/upload', graphData);
    return response.data;
};

export { downloadGraphData ,uploadGraphData };