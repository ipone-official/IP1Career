import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://webapps.ip-one.com/ApiCareer/api/MasterData', // URL ของ API server ของคุณ
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getItemList() {
    return apiClient.get('/ItemList');
  },
  getRequireItemList() {
    return apiClient.get('/RequireItemList');
  },
  getAllPosition() {
    return apiClient.get('/AllPosition');
  },
  getPrefixName() {
    return apiClient.get('/PrefixName');
  },
  getBloodGroup() {
    return apiClient.get('/BloodGroup');
  },
  getEthnicity() {
    return apiClient.get('/Ethnicity');
  },
  getNationality() {
    return apiClient.get('/Nationality');
  },
  getReligion() {
    return apiClient.get('/Religion');
  },
  getPersonalStatus() {
    return apiClient.get('/PersonalStatus');
  },
  getStamilit() {
    return apiClient.get('/Stamilit');
  },
  getProvince() {
    return apiClient.get('/Province');
  },
  getDistrict() {
    return apiClient.get('/District');
  },
  getSubDistrict() {
    return apiClient.get('/SubDistrict');
  },
  getCountry() {
    return apiClient.get('/Country');
  },
  getAcademy() {
    return apiClient.get('/Academy');
  },
  getEducational() {
    return apiClient.get('/Educational');
  },
  getEmployeeStatus() {
    return apiClient.get('/EmployeeStatus');
  },
  getLocation() {
    return apiClient.get('/Location');
  },
  getGLAccount() {
    return apiClient.get('/GLAccount');
  },
  getGroupEmployee() {
    return apiClient.get('/GroupEmployee');
  },
  getGroupWork() {
    return apiClient.get('/GroupWork');
  },
  getRecordTime() {
    return apiClient.get('/RecordTime');
  },
  getJobType() {
    return apiClient.get('/JobType');
  },
  getJobGrade() {
    return apiClient.get('/JobGrade');
  },
  getEmploymentType() {
    return apiClient.get('/EmploymentType');
  },
  getPayrollType() {
    return apiClient.get('/PayrollType');
  },
  getBankAccount() {
    return apiClient.get('/BankAccount');
  },
  getSex() {
    return apiClient.get('/Sex');
  },
  getCompanyCode() {
    return apiClient.get('/CompanyCode');
  },
  getReasonResign() {
    return apiClient.get('/ReasonResign');
  },
  getReasonInsured() {
    return apiClient.get('/ReasonInsured');
  },
  getAdvanceRequest(data) {
    return apiClient.post('/AdvanceRequest', data);
  },
  getChecklistItem() {
    return apiClient.get('/Checklist');
  },
  getPayslip() {
    return apiClient.get('/Payslip');
  },
  gEducationalQualification() {
    return apiClient.get('/gEducationalQualification');
  },
  gLanguageCourse() {
    return apiClient.get('/gLanguageCourse');
  },
};
