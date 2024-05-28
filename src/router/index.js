import Vue from 'vue';
import Router from 'vue-router';

import Reports from '../pages/Reports.vue';
import Login from '../pages/core/Login.vue';
import Error from '../pages/core/Error.vue';
import Transactions from '../pages/Transactions.vue';
import ImportExcel from '../pages/ImportExcel.vue'
import Career from '../pages/Career.vue';
import JobDesc from '../pages/JobDesc.vue';
import RegForm from '../pages/RegForm.vue';
import ManageData from '../pages/ManageData.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ImportExcel',
      component: ImportExcel,
    },
    {
      path: '/Transactions',
      name: 'Transactions',
      component: Transactions,
      meta: {
        breadcrumb: [
          { name: 'Transactions' }
        ]
      }
    },
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
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        allowAnonymous: true
      }
    },
    {
      path: '/error',
      name: 'Error',
      component: Error,
      meta: {
        allowAnonymous: true
      }
    },
  ]
});
