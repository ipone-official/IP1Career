import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://webapps.ip-one.com/ApiCareer/api/IP1Career', // URL ของ API server ของคุณ
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

const apiClientAds = axios.create({
  baseURL: 'https://webapps.ip-one.com/ApiCareer/api/Ads', // URL ของ API server ของคุณ
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});


export default {
  getAdsUser(data) {
    return apiClientAds.post('/ADsGetUser', data);
  },
  getAdsUserList() {
    return apiClientAds.get('/UserADsAll');
  },
  newAdsUser(data) {
    return apiClientAds.post('/ADsNewUser', data);
  },
  UpdateADsUser(data) {
    return apiClientAds.post('/UpdateADsUser', data);
  },
  getDepartment() {
    return apiClient.get('/Department12');
  },
  getPosition() {
    return apiClient.get('/Position');
  },
  getSelectDescriptionDetail(data) {
    return apiClient.get(`/SelectDescriptionDetail/${data}`);
  },
  getSelectQualificationDetail(data) {
    return apiClient.get(`/SelectQualificationDetail/${data}`);
  },
  getApplicant() {
    return apiClient.get('/Applicant');
  },
  getCandidate(data) {
    return apiClient.post('/Candidate', data);
  },
  getEmployment(data) {
    return apiClient.post('/Employment', data);
  },
  getEmploymentAssetList(data) {
    return apiClient.post('/EmploymentAssetList', data);
  },
  getEmploymentAssetByID(data) {
    return apiClient.post('/EmploymentAssetByID', data);
  },
  getEmploymentAssetDetailByID(data) {
    return apiClient.post('/EmploymentAssetDetail', data);
  },
  getEmploymenPersonalData(data) {
    return apiClient.post('/EmploymentPersonalData', data);
  },
  getAssetIDFromEmpID(data) {
    return apiClient.post('/AssetIDFromEmpID', data);
  },
  postDepartment(data) {
    return apiClient.post('/postDepartment', data);
  },
  postPosition(data) {
    return apiClient.post('/postPosition', data);
  },
  postApplicant(data) {
    return apiClient.post('/postApplicant', data);
  },
  postCandidate(data) {
    return apiClient.post('/postCandidate', data);
  },
  postEmployment(data) {
    return apiClient.post('/postEmployment', data);
  },
  postEmployeeAsset(data) {
    return apiClient.post('/postEmployeeAsset', data);
  },
  postEmployeePersonalData(data) {
    return apiClient.post('/postEmployeePersonalData', data);
  },
  postEmployeeSignature(data) {
    return apiClient.post('/postEmployeeSignature', data);
  },
  updateDepartment(data) {
    return apiClient.post('/updateDepartment', data);
  },
  updateCandidate(data) {
    return apiClient.post('/updateCandidate', data);
  },
  updateEmployment(data) {
    return apiClient.post('/updateEmployment', data);
  },
  updateAssetFormStatus(data) {
    return apiClient.post('/updateAssetFormStatus', data);
  },
  updateReturnDate(data) {
    return apiClient.post('/updateReturnDate', data);
  },
  updateEmployeeID(data) {
    return apiClient.post('/updateEmployeeID', data);
  },
  updateEffectiveDate(data) {
    return apiClient.post('/updateEffectiveDate', data);
  },
  updateRequireItem(data) {
    return apiClient.post('/updateRequireItem', data);
  },
  updateEmployeeStatus(data) {
    return apiClient.post('/updateEmployeeStatus', data);
  },
  updateFlagADsUser(data) {
    return apiClient.post('/updateFlagADsUser', data);
  },
  deleteDepartment(data){
    return apiClient.post('/deleteDepartment', data);
  },
  deletePosition(data){
    return apiClient.post('/deletePosition', data);
  },
};