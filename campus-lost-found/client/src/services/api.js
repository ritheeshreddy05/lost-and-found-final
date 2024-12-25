import axios from 'axios';

const BASE_URL = 'https://lost-and-found-final.onrender.com/api';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const api = {
    getAllItems: async () => {
        try {
            const response = await axiosInstance.get('/items');
            return response.data;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    },

    createItem: async (formData) => {
        try {
            // Log the FormData contents for debugging
            for (let pair of formData.entries()) {
                console.log('FormData:', pair[0], pair[1]);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await axiosInstance.post('/items', formData, config);
            return response.data;
        } catch (error) {
            console.error('Error creating item:', error.response || error);
            throw error;
        }
    },

    updateItem: async (itemId, formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const response = await axiosInstance.put(`/items/${itemId}`, formData, config);
            return response.data;
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    },

    deleteItem: async (itemId) => {
        try {
            const response = await axiosInstance.delete(`/items/${itemId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    },

    getNewItems: async (since) => {
        try {
            const response = await axiosInstance.get(`/items/new?since=${since}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching new items:', error);
            throw error;
        }
    }
};

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Server responded with error
            console.error('Server Error:', error.response.data);
            throw error.response.data;
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.request);
            throw new Error('Network error - no response received');
        } else {
            // Error setting up request
            console.error('Request Error:', error.message);
            throw error;
        }
    }
);

export default api;