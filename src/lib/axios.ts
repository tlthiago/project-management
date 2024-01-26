import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.110.96.213:3002'
});
