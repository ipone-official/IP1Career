<template>
  <div class="job-listings-container">
    <div class="results-section">
      <h2 style="border-bottom: 1px solid #000; padding-bottom:10px;">Job Description {{ jobId }}</h2>
      <div class="desc-item" v-for="description in descriptions">
        <h3>{{ description.descriptionEN }} </h3>
        <h3>{{ description.positionID }} </h3>
      </div>
      <h2 style="border-bottom: 1px solid #000; padding-bottom:10px; padding-top: 20px;">Qualification</h2>
      <div class="qua-item" v-for="qualification in qualifications">
        <h3>{{ qualification.qualificationsTH }} </h3>
        <h3>{{ qualification.positionID }} </h3>
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
        descriptions:[],
        qualifications:[],
        rawData: [],
        jobId : this.$route.params.jobId,
      };
    },
  
    computed: {
      ...sync("*"),
    },
  
    watch: {
      selectID(){
        console.log(this.selectID.length);
        if (this.selectID.length == 0) {
          console.log(this.rawData);
          this.positions = this.rawData;         
        } 
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
      this.fetchDescription();
      this.fetchQualification();
    },
    
    methods: {
      async fetchDescription() {
        try {
          const response = await apiService.getDescription();
          this.descriptions = response.data;
          console.log("Test")
          
        } catch (error) {
          console.error(error);
        }
      },
      async fetchQualification() {
        try {
          const response = await apiService.getQualification();
          this.qualifications = response.data;
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
    width: 30%;
    padding: 20px;
    border-right: 1px solid #ddd;
  }

  .results-section {
    width: 100%;
    padding: 20px;
  }

  .desc-item {
    border-bottom: 1px solid #ddd;
    padding: 20px 0;
  }

  .qua-item {
    border-bottom: 1px solid #ddd;
    padding: 20px 0;
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
  