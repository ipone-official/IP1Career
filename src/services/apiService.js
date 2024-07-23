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
  getDescriptionDetail(data) {
    return apiClient.get(`/DescriptionDetail/${data}`);
  },
  getSelectDescriptionDetail(data) {
    return apiClient.get(`/SelectDescriptionDetail/${data}`);
  },
  getQualification() {
    return apiClient.get('/Qualification');
  },
  getQualificationDetail(data) {
    return apiClient.get(`/QualificationDetail/${data}`);
  },
  getSelectQualificationDetail(data) {
    return apiClient.get(`/SelectQualificationDetail/${data}`);
  },
  getApplicant() {
    return apiClient.get('/Applicant');
  },
  getCandidate() {
    return apiClient.get('/Candidate');
  },
  postDepartment(data) {
    return apiClient.post('/postDepartment', data);
  },
  postPosition(data) {
    return apiClient.post('/postPosition', data);
  },
  postDescription(data) {
    return apiClient.post('/postDescription', data);
  },
  postQualification(data) {
    return apiClient.post('/postQualification', data);
  },
  postApplicant(data) {
    return apiClient.post('/postApplicant', data);
  },
  postCandidate(data) {
    return apiClient.post('/postCandidate', data);
  },
  updateDepartment(data) {
    return apiClient.post('/updateDepartment', data);
  },
  updatePosition(data) {
    return apiClient.post('/updatePosition', data);
  },
  updateCandidate(data) {
    return apiClient.post('/updateCandidate', data);
  },
  deleteDepartment(data){
    return apiClient.post('/deleteDepartment', data);
  },
  deletePosition(data){
    return apiClient.post('/deletePosition', data);
  },
  deleteDescription(data){
    return apiClient.post('/deleteDescription', data);
  },
  deleteQualification(data){
    return apiClient.post('/deleteQualification', data);
  },
};
