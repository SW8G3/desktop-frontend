import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Base URL from environment variables
});

// Function to register a new user
export const registerUser = async (username, password) => {
    try {
        const response = await api.post('/auth/register', { username, password });
        return response.data; // Return the response data
    } catch (error) {
        if (error.response) {
            // Return the error message from the server
            throw new Error(error.response.data.message || 'Registration failed.');
        }
        throw new Error('An error occurred during registration.');
    }
};

// Function to log in a user
export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data; // Return the response data (e.g., token)
    } catch (error) {
        if (error.response) {
            // Return the error message from the server
            throw new Error(error.response.data.message || 'Login failed.');
        }
        throw new Error('An error occurred during login.');
    }
};