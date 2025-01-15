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
  {
    path: '/Career',
    name: 'Career',
    component: Career,
    meta: { breadcrumb: [{ name: 'Career' }] }
  },
  {
    path: '/JobDesc',
    name: 'JobDesc',
    component: JobDesc,
    meta: { breadcrumb: [{ name: 'JobDesc' }] }
  },
  {
    path: '/RegForm',
    name: 'RegForm',
    component: RegForm,
    meta: { breadcrumb: [{ name: 'RegForm' }] }
  },
  {
    path: '/ManageData',
    name: 'ManageData',
    component: ManageData,
    meta: { breadcrumb: [{ name: 'ManageData' }] }
  },
  {
    path: '/',
    name: 'DisplayPage',
    component: DisplayPage,
    meta: { allowAnonymous: true }
  },
  {
    path: '/Applicant',
    name: 'Applicant',
    component: Applicant,
    meta: { breadcrumb: [{ name: 'Applicant' }] }
  },
  {
    path: '/Candidate',
    name: 'Candidate',
    component: Candidate,
    meta: { breadcrumb: [{ name: 'Candidate' }] }
  },
  {
    path: '/Employment',
    name: 'Employment',
    component: Employment,
    meta: { breadcrumb: [{ name: 'Employment' }] }
  },
  {
    path: '/EmploymentAsset',
    name: 'EmploymentAsset',
    component: EmploymentAsset,
    meta: { breadcrumb: [{ name: 'EmploymentAsset' }] }
  },
  {
    path: '/NewEmpForm',
    name: 'NewEmpForm',
    component: NewEmpForm,
    meta: { breadcrumb: [{ name: 'NewEmpForm' }] }
  },
  {
    path: '/EmployeeInfo',
    name: 'EmployeeInfo',
    component: EmployeeInfo,
    meta: { allowAnonymous: true }
  },
  {
    path: '/UserManual',
    name: 'UserManual',
    component: UserManual
  },
  {
    path: '/EmploymentForm',
    name: 'EmploymentForm',
    component: EmploymentForm
  },
];

const router = new Router({
  routes
});

router.beforeEach(async (to, from, next) => {
  try {
    if (!to.meta.allowAnonymous) {
      if (isTokenNearExpiration()) {
        await RenewToken(localStorage.getItem('refreshToken'));
      }
    }
    next();
  } catch (error) {
    console.error('Error during token renewal:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    next({ name: 'Login' });
  }
});

export default router;
