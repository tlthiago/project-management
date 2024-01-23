import axios from 'axios';

export const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_URL
  baseURL: 'http://10.110.96.213:3001'
});
