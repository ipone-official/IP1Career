<template>
  <div class="container">
  <div class="job-listings-container">

    <div class="filter-section">
      <div style="display: flex; align-items: center; ">
        <h1 style="padding-bottom:10px; font-size: 40px;">{{ departmentTitle }}</h1>
      </div>
      <div v-for="department in departments" :key="department.departmentID" class="depart-text" >
        <label class="department-label">
          <input type="checkbox" :value="department.departmentID" v-model="selectID" style="transform: scale(1.3);">
            {{ getDepartmentDesc(department) }}
        </label>
      </div>
    </div>

    <div class="results-section">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <h1 style="padding-bottom:10px; font-size: 40px;">{{ vacanciesTitle }}</h1>

        <select v-model="language"  class="form-select form-select-lg language-select" onchange="switchLanguage()">
          <option value="en">English</option>
          <option value="th">Thai</option>
        </select>
      </div>

      <!-- <div class="job-item" v-for="position in positions" :key="position.positionID" @click="goToJobDesc(position.positionID, position.position_Name)">
        <h2>{{ position.position_Name }} </h2>
      </div> -->

      <table class="table table-bordered table-striped">
      <tbody>
        <tr v-for="(position, index) in positions" :key="position.positionID" @click="goToJobDesc(position.positionID, position.position_Name)">
          <td class="job-item">{{ position.position_Name }}<span style='font-size:30px;'>&#x1F8A7;</span></td>
        </tr>
      </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";  
import { isEmpty } from "lodash";
import keyFilter from "@/plugins/keyFilter";
import Swal from "sweetalert2";
import Loading from "../components/core/Loading";
import { sync } from "vuex-pathify";
import apiService from '@/services/apiService';
import { watch } from "vue";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      departments:[],
      positions:[],
      selectID: [],
      rawData: [],
      language: 'en',
      titles: {
        department: {
          en: 'Department',
          th: 'แผนก'
        },
        vacancies: {
          en: 'Job Vacancies',
          th: 'ตำแหน่งงานที่รับสมัคร'
        }
      }
    };
  },

  computed: {
    ...sync("*"),
    departmentTitle() {
      return this.language === 'en' ? this.titles.department.en : this.titles.department.th;
    },
    vacanciesTitle() {
      return this.language === 'en' ? this.titles.vacancies.en : this.titles.vacancies.th;
    }
  },

  watch: {
    selectID(){
      console.log(this.selectID.length);
      if (this.selectID.length == 0) {
        console.log(this.rawData);
        this.positions = this.rawData;
        
      } else {
        this.positions = this.rawData.filter((position) => 
          this.selectID.includes(position.departmentID)
        );
      }
    }
  },

  created() {
    this.fetchDepartments();
    this.fetchPositions();
  },
  
  methods: {
    async fetchDepartments() {
      try {
        const response = await apiService.getDepartment();
        this.departments = response.data;
        console.log("Test")
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPositions() {
      try {
        const response = await apiService.getPosition();
        this.positions = response.data;
        this.rawData = response.data;
        console.log("Test1")
      } catch (error) {
        console.error(error);
      }
    },
    goToJobDesc(id, name) {
      console.log("id", id)
      this.PositionDesc = [id]
      this.PositionName = name
      console.log("PositionDesc", this.PositionDesc)
      console.log("PositionName", this.PositionName)
      this.$router.push({ name: 'JobDesc'});  // ใช้ jobId
    },
    switchLanguage() {
      return this.language;
    },
    getDepartmentDesc(department) {
      return this.language === 'en' ? department.department_DescEN : department.department_DescTH;
    },
  }
};
</script>

<style scoped>

.container{
  max-width: 95%;
  margin: 40px auto;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #f5f7fa 0%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #000;
}

.department-label input[type="checkbox"] {
  margin-right: 5px; /* ปรับระยะห่างตามต้องการ */
}

.depart-text {
  font-size: 17px;
  padding: 15px 15px 15px 15px;
  background-color: rgb(255, 255, 255);
  border: 1px solid #ddd;
}

.job-listings-container {
  display: flex;
  justify-content: space-between;
}

.filter-section {
  width: 30%;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.results-section {
  width: 100%;
  padding: 20px;
}

.job-item {
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  padding: 20px;
  transition: font-size 0.3s;
  color: rgb(0, 0, 0);
  font-size: 23px;
  justify-content: space-between;
  align-items: center;
  display: flex;
}

.language-select {
  padding: 10px;
  margin-bottom: 9px;
  border-radius: 7px;
  width: 110px;
}


.theme--light.v-table thead th {
  background-image: -webkit-gradient(
    linear,
    right top,
    left top,
    from(rgba(51, 148, 225, 0.18)),
    to(transparent)
  );
  background-image: linear-gradient(270deg, rgba(51, 148, 225, 0.18), transparent);
  background-color: #a7b0b9 !important;
  font-size: 15px !important;
  color: #ffffff !important;
  /* background-color: #222d32;
    background-color: #007fc4;
    background-color: #000000;
    background-color: #ffffff; */
}

.theme--light.v-datatable thead th.column.sortable.active,
.theme--light.v-datatable thead th.column.sortable.active .v-icon,
.theme--light.v-datatable thead th.column.sortable:hover {
  color: #ffffff !important;
}
</style>
