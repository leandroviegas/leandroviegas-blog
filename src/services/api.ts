import axios from 'axios';

const api = axios.create({
    baseURL: process.env.API_URL || "https://leandroviegasapi.onrender.com",
    withCredentials: true
});

export default api