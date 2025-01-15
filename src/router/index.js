import Vue from 'vue';
import Router from 'vue-router';

import Career from '../pages/Career.vue';
import JobDesc from '../pages/JobDesc.vue';
import RegForm from '../pages/RegForm.vue';
import ManageData from '../pages/ManageData.vue';
import DisplayPage from '../pages/DisplayPage.vue';
import Applicant from '../pages/Applicant.vue';
import Candidate from '../pages/Candidate.vue';
import Employment from '../pages/Employment.vue';
import NewEmpForm from '../pages/NewEmpForm.vue';
import EmploymentAsset from '../pages/EmploymentAsset.vue';
import EmployeeInfo from '../pages/PeoplePlus/EmployeeInfo.vue';
import UserManual from '../pages/UserManual.vue';
import EmploymentForm from '../pages/PeoplePlus/EmploymentForm.vue';
import { isTokenNearExpiration, RenewToken } from '@/services/apiServicePortal.js';

Vue.use(Router);

const routes = [
  { path: '/Career', name: 'Career', component: Career, meta: { breadcrumb: [{ name: 'Career' }], allowAnonymous: false } },
  { path: '/JobDesc', name: 'JobDesc', component: JobDesc, meta: { breadcrumb: [{ name: 'JobDesc' }], allowAnonymous: false } },
  { path: '/RegForm', name: 'RegForm', component: RegForm, meta: { breadcrumb: [{ name: 'RegForm' }], allowAnonymous: false } },
  { path: '/ManageData', name: 'ManageData', component: ManageData, meta: { breadcrumb: [{ name: 'ManageData' }], allowAnonymous: false } },
  { path: '/', name: 'DisplayPage', component: DisplayPage, meta: { allowAnonymous: true } },
  { path: '/Applicant', name: 'Applicant', component: Applicant, meta: { breadcrumb: [{ name: 'Applicant' }], allowAnonymous: false } },
  { path: '/Candidate', name: 'Candidate', component: Candidate, meta: { breadcrumb: [{ name: 'Candidate' }], allowAnonymous: false } },
  { path: '/Employment', name: 'Employment', component: Employment, meta: { breadcrumb: [{ name: 'Employment' }], allowAnonymous: false } },
  { path: '/EmploymentAsset', name: 'EmploymentAsset', component: EmploymentAsset, meta: { breadcrumb: [{ name: 'EmploymentAsset' }], allowAnonymous: false } },
  { path: '/NewEmpForm', name: 'NewEmpForm', component: NewEmpForm, meta: { breadcrumb: [{ name: 'NewEmpForm' }], allowAnonymous: false } },
  { path: '/EmployeeInfo', name: 'EmployeeInfo', component: EmployeeInfo, meta: { allowAnonymous: true } },
  { path: '/UserManual', name: 'UserManual', component: UserManual },
  { path: '/EmploymentForm', name: 'EmploymentForm', component: EmploymentForm },
];

const router = new Router({ routes });

router.beforeEach(async (to, from, next) => {
  try {
    if (!to.meta.allowAnonymous) {
      const refreshToken = localStorage.getItem('refreshTokenCareer');
      if (!refreshToken) {
        console.warn('No refresh token found. Redirecting to login.');
        return  next();
      }

      if (isTokenNearExpiration()) {
        await RenewToken(refreshToken);
      }
    }
    next();
  } catch (error) {
    console.error('Error during token renewal:', error);
    localStorage.removeItem('accessTokenCareer');
    localStorage.removeItem('refreshTokenCareer');
    window.location.replace('https://portal.ip-one.com/#/');
  }
});

export default router;
