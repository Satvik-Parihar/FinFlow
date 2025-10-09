import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    } catch (e) {
        console.error("Could not parse user from localStorage", e);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;