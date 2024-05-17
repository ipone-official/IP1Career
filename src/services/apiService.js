import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5019/api/IP1Career', // URL ของ API server ของคุณ
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getDepartment() {
    return apiClient.get('/Department12');
  },
  getPosition() {
    return apiClient.get('/Position');
  },
  deletePosition(id) {
    return apiClient.post('/deletePosition', { id: id });
  }
};
