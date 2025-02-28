import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

/**
 * @typedef {Object} Node
 * @property {string} id
 * @property {Array<number>} position
 * @property {boolean} hasCode
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
 * Upload graph data to the server
 * @param {Graph} graphData
 * @returns {Promise<Object>}
 */
const uploadGraphData = async (graphData) => {
    try {
        const response = await api.post("/graph", graphData);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export { uploadGraphData };