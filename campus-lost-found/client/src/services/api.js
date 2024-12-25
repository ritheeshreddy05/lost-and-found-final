import axios from 'axios';

const BASE_URL = 'https://lost-and-found-final.onrender.com/api';

const api = {
    // Item related endpoints
    getAllItems: async () => {
        const response = await axios.get(`${BASE_URL}/items`);
        return response.data;
    },

    createItem: async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log('Upload Progress:', percentCompleted);
                }
            };
            const response = await axios.post(`${BASE_URL}/items`, formData, config);
            return response.data;
        } catch (error) {
            console.error('Error uploading:', error);
            throw error;
        }
    },

    searchItems: async (query) => {
        const response = await axios.get(`${BASE_URL}/items/search?query=${query}`);
        return response.data;
    },

    updateItemStatus: async (itemId) => {
        const response = await axios.put(`${BASE_URL}/items/${itemId}/status`);
        return response.data;
    },

    updateItem: async (itemId, formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log('Upload Progress:', percentCompleted);
                }
            };
            const response = await axios.put(`${BASE_URL}/items/${itemId}`, formData, config);
            return response.data;
        } catch (error) {
            console.error('Error updating:', error);
            throw error;
        }
    },

    deleteItem: async (itemId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/items/${itemId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    },

    updateItemClaimed: async (itemId, claimedByRollNo) => {
        const response = await axios.put(`${BASE_URL}/items/${itemId}/claim`, { claimedByRollNo });
        return response.data;
    },

    // Student related endpoints
    getStudentProfile: async (rollNo) => {
        const response = await axios.get(`${BASE_URL}/students/${rollNo}`);
        return response.data;
    },

    getStudentReportedItems: async (rollNo) => {
        const response = await axios.get(`${BASE_URL}/students/${rollNo}/items`);
        return response.data;
    },

    updateStudentRewards: async (rollNo, rewardType) => {
        const response = await axios.post(`${BASE_URL}/students/${rollNo}/rewards`, { rewardType });
        return response.data;
    }
};

// Add response interceptor for error handling
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Server responded with error status
            console.error('Server Error:', error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.request);
        } else {
            // Error setting up request
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;