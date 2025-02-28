import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const testApi = async () => {
    try {
        const response = await api.get("/test");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export { testApi };