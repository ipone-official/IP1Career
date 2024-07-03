import Vue from 'vue';
import Router from 'vue-router';

import Reports from '../pages/Reports.vue';
import Login from '../pages/core/Login.vue';
import Career from '../pages/Career.vue';
import JobDesc from '../pages/JobDesc.vue';
import RegForm from '../pages/RegForm.vue';
import ManageData from '../pages/ManageData.vue';
import DisplayPage from '../pages/DisplayPage.vue';
import Applicant from '../pages/Applicant.vue';
import Candidate from '../pages/Candidate.vue';
import NewEmpForm from '../pages/NewEmpForm.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/Reports',
      name: 'Reports',
      component: Reports,
      meta: {
        breadcrumb: [
          { name: 'Reports' }
        ]
      }
    },
    {
      path: '/Career',
      name: 'Career',
      component: Career,
      meta: {
        breadcrumb: [
          { name: 'Career' }
        ]
      }
    },
    {
      path: '/JobDesc',
      name: 'JobDesc',
      component: JobDesc,
      meta: {
        breadcrumb: [
          { name: 'JobDesc' }
        ]
      }
    },
    {
      path: '/RegForm',
      name: 'RegForm',
      component: RegForm,
      meta: {
        breadcrumb: [
          { name: 'RegForm' }
        ]
      }
    },
    {
      path: '/ManageData',
      name: 'ManageData',
      component: ManageData,
      meta: {
        breadcrumb: [
          { name: 'ManageData' }
        ]
      }
    },
    {
      path: '/DisplayPage',
      name: 'DisplayPage',
      component: DisplayPage,
      meta: {
        allowAnonymous: true,
        // breadcrumb: [
        //   { name: 'DisplayPage' }
        // ]
      }
    },
    {
      path: '/Applicant',
      name: 'Applicant',
      component: Applicant,
      meta: {
        breadcrumb: [
          { name: 'Applicant' }
        ]
      }
    },
    {
      path: '/Candidate',
      name: 'Candidate',
      component: Candidate,
      meta: {
        breadcrumb: [
          { name: 'Candidate' }
        ]
      }
    },
    {
      path: '/NewEmpForm',
      name: 'NewEmpForm',
      component: NewEmpForm,
      meta: {
        breadcrumb: [
          { name: 'NewEmpForm' }
        ]
      }
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        allowAnonymous: true
      }
    },
  ]
});
