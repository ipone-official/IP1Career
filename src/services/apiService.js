import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://webapps.ip-one.com/ApiCareer/api/IP1Career', // URL ของ API server ของคุณ
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
  getDescription() {
    return apiClient.get('/Description');
  },
  getQualification() {
    return apiClient.get('/Qualification');
  },
  postDepartment(data) {
    return apiClient.post('/postDepartment', data);
  },
  postCandidate(data) {
    return apiClient.post('/postCandidate', data);
  },
  updateDepartment(data) {
    return apiClient.post('/updateDepartment', data);
  },
  deleteDepartment(data){
    return apiClient.post('/deleteDepartment', data);
  }
};
