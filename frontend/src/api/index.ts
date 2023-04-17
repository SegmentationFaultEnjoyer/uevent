import axios from 'axios';
import { refreshTokenMiddleWare } from './middlewares'
import { config } from '@/config'

let api = axios.create({
    baseURL: config.API_URL,
    withCredentials: true
});

// api.interceptors.request.use(refreshTokenMiddleWare);

export { api };