import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true
});

export const authorization = `bearer ${localStorage.getItem("token")}`

export default api