<template>
  <div class="full-page">

    <div class="header">
      <p class="font-head">I.P. One Career</p>
    </div>

    <div class="jobsearch">
      <v-layout class="custom-size">
        <v-flex sm1 md1 lg2 xl3>
        </v-flex>
        <v-flex xs12 sm5 md5 lg4 xl3 class="select-mobile">
          <v-select
           solo
          v-model="selectID"
          :items="departments"
          item-text="department_DescTH"
          item-value="departmentID"
          label="ค้นหาแผนก"
          multiple
          class="custom-text-field-filter"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2" :key="index">
                <span>{{ item.department_DescTH }}</span>
              </v-chip>
              <span
                v-if="index === 2"
                class="grey--text caption custom-select"
              >(+{{ selectID.length - 2 }} others)</span>
            </template>
          </v-select>
        </v-flex>
        <v-flex xs12 sm5 md5 lg4 xl3 class="search-mobile">
          <v-text-field single-line solo placeholder="ค้นหาตำแหน่งงาน" class="custom-text-field-search" v-model="searchVal"></v-text-field>
          <v-icon class="custom-icon">mdi-magnify</v-icon>
        </v-flex>
        <v-flex sm1 md1 lg2 xl3>
        </v-flex>
      </v-layout>
    </div>

    <div class="text-head">
      ตำแหน่งงานที่เปิดรับ
    </div>

    <div class="moni">
      <div
        v-bind:style="{ 
          width: Apply100w || Applysize ? '100%' : '45%',
          'padding-left': Apply100w ? '25px' : '25px',
          'padding-right': Apply100w ? '25px' : '25px'
        }"
      >
        <career/>
      </div>
      <div class="leftmoni" v-if="Applydesc">
        <jobdesc/>
      </div>
      <div class="leftmoni" v-if="Applyform">
          <regform/>
      </div>
    </div>

  </div>
</template>

<script>
import career from '../pages/Career.vue';
import jobdesc from '../pages/JobDesc.vue';
import regform from '../pages/RegForm.vue';
import { sync } from "vuex-pathify";
import apiService from '@/services/apiService';
  
  export default {
    components: {
      career,
      jobdesc,
      regform,
    },

    data() {
      return {
        input: '',
        hasError: false,
        errorMessage: '',
        width: window.innerWidth,
        height: window.innerHeight,
        Applysize: window.innerWidth <= 960,
        depRawData: [],
        departments: [],
        departmentSelect: [],
      };
    },
  
    computed: {
      ...sync("*"),
      DepartmentsTH() {
        return this.departments.map(department => department.department_DescTH);
      },
      DepartmentsID() {
        return this.departments.map(department => department.departmentID);
      },
    },

    created() {
      this.fetchDepartments();
    },

    watch: {
    },

    mounted() {
      window.addEventListener
      ('resize', this.setWindowSize);
    },
    beforeDestroy() {
      window.removeEventListener
      ('resize', this.setWindowSize);
    },

    methods: {
      setWindowSize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.Applysize = window.innerWidth <= 960;
      },
      async fetchDepartments() {
        try {
          const response = await apiService.getDepartment();
          this.depRawData = response.data;
          this.departments = this.depRawData.filter(department => department.status === 'ACTIVE');
        } catch (error) {
          console.error(error);
        }
      },
    }
  };
</script>

<style scoped>
  .full-page{
    background-color: #f4f4f4;
    overflow: none;
  }

  .moni{
    display: flex;
    padding-bottom: 20px;
    padding-left: 30px;
    padding-right: 30px;
  }

  .leftmoni{
    width: 55%;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: #007fc4; */
    height: 57.5px;
    position: relative;
    width: 100%;
  }

  .font-head {
    font-size: 1.9em;
    font-weight: 400;
    padding-top: 20px;
    color: #007fc4;
  }

  .jobsearch {
    /* background-color: #f4f4f4; */
    background-color: #f4f4f4;
    height: 100px;
    width: 100%;
    padding-top: 25px;
  }

  .custom-icon {
    background-color: red;
    width: 55px;
    height: 47.5px;
    margin-left: 15px;
    color: white !important;
    font-size: 32.5px;
    border-radius: 12.5px;
  }

  .custom-search {
    background-color: #fff;
    border: 1.5px solid #ccc;
    width: 100%;
    height: 100%;
    padding-left: 20px;
    font-size: large;
  }

  .text-head {
    text-align: center;
    font-size: 1.85em;
    background-color: #f4f4f4;
    margin: 20px 0px 10px 0px;
  }

  .custom-select {
    padding-left: 5px;
  }

  .custom-page {
    padding: 0px 50px 0px 50px;
  }

  .select-mobile {
    padding-right: 7.5px; 
  }

  .search-mobile {
    padding-left: 7.5px; 
    display:flex;
  }

  @media (max-width: 960px) {
    .moni {
      display: block;
      padding-left: 0px;
      padding-right: 0px;
    }
    .leftmoni {
      width: 100%;
      margin-top: 10px;
    }
  }

  @media (max-width: 599px) {
    .custom-size {
      display: block;
    }
    .jobsearch {
      height: 170px;
    }
    .select-mobile {
      padding-right: 40px;
      padding-left: 40px;
    }
    .search-mobile {
      padding-right: 40px;
      padding-left: 40px;
    }
  }

  @media (max-width: 650px) {
    .text-head {
      font-size: 1.6em;
    }
  }

</style>