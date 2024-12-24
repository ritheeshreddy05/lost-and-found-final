import axios from 'axios';

const BASE_URL = 'https://lost-and-found-final.onrender.com/api';

const api = {
    // Item related endpoints
    getAllItems: async () => {
        const response = await axios.get(`${BASE_URL}/items`);
        return response.data;
    },

    createItem: async (itemData) => {
        const response = await axios.post(`${BASE_URL}/items`, itemData);
        return response.data;
    },

    searchItems: async (query) => {
        const response = await axios.get(`${BASE_URL}/items/search?query=${query}`);
        return response.data;
    },

    updateItemStatus: async (itemId) => {
        const response = await axios.put(`${BASE_URL}/items/${itemId}/status`);
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
    },
    deleteItem: async (itemId) => {
        const response = await axios.delete(`${BASE_URL}/items/${itemId}`);
        return response.data;
    },
     updateItemClaimed: async (itemId, claimedByRollNo) => {
        const response = await axios.put(`${BASE_URL}/items/${itemId}/claim`, { claimedByRollNo });
        return response.data;
    }
};

export default api;