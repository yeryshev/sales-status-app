import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const $api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
});