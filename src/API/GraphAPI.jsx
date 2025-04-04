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
 * @property {number} nodeA
 * @property {number} nodeB
 * @property {number} distance
 */

/**
 * 
 * @typedef {Object} Graph
 * @property {Array<Node>} nodes
 * @property {Array<Edge>} edges
 */


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

    // For each node, delete newTag property
    nodes = nodes.map(node => {
        // eslint-disable-next-line no-unused-vars
        const { newTag, ...rest } = node;
        return rest;
    });

    const graphData = { nodes, edges };

    console.log({ graphData });
    const response = await api.post('/graph/upload', graphData);
    return response.data;
};

export { downloadGraphData, uploadGraphData };