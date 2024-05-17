<template>
  <div class="job-listings-container">
    <div class="filter-section">
      <h2>Job Filter</h2>
      <div>
        <h3>Areas</h3>
        <ul>
          <li v-for="department in departments" :key="department.departmentID">
            <label>
              <input type="checkbox" :value="department.departmentID" v-model="selectID">
               {{ department.department_DescEN }}
               {{ selectID }}
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="results-section">
      <h2>Job Vacancies</h2>
      <div class="job-item" v-for="position in positions">
        <h3>{{ position.position_Name }} </h3>
        <p>job.description- job.date</p>
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
    };
  },

  computed: {
    ...sync("*"),
    // filteredPositions() {
    //   if (this.selectedAreas.length === 0) {
    //     return this.positions;
    //   }
    //   return this.positions.filter(position => 
    //     this.selectedAreas.includes(position.departmentID)
    //   );
    // }
  },

  watch: {
    selectID(){
      console.log(this.selectID.length);
      if (this.selectID.length == 0) {
        console.log(this.rawData);
        this.positions = this.rawData;
        
      } 
      // else if (this.selectID.length === []){
      //   return this.positions;
      // }
      else {
        // console.log(this.positions);
        // console.log(this.positions.map(zxc => zxc.departmentID))
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
        // const departments = response.data;
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
        // this.positions = response.data.map(dept => dept.position_Name);
        console.log("Test1")
      } catch (error) {
        console.error(error);
      }
    },
  }
};
</script>

<style>
.job-listings-container {
  display: flex;
  justify-content: space-between;
}

.filter-section {
  width: 25%;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.results-section {
  width: 70%;
  padding: 20px;
}

.job-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
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
