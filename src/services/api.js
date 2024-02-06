import axios from 'axios';
import { BASE_URL } from 'utils/constants';

const getToken = () => {
  return localStorage['token-xadya'];
};

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const getRequest = (url, config = {}) => axios.get(BASE_URL + url, config);
export const postRequest = (url, data, config = {}) => axios.post(BASE_URL + url, data, config);
