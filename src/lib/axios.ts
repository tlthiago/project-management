import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.110.96.247:3002',
  withCredentials: true
});
