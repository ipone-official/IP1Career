<template>
  <div class="container">
    <div class="job-listings-container">
      <div class="results-section">
        <div class="header">
          <h1>{{ PositionName }}</h1>
          <select v-model="language"  class="form-select form-select-lg language-select" onchange="switchLanguage()">
          <option value="en">English</option>
          <option value="th">Thai</option>
        </select>
        </div>
        <!-- <p style="border-bottom: 1px solid #78909C;"></p> -->

        <div class="card">
          <div class="card-header">
            <h2 style="padding-top: 15px;">{{ descriptionTitle }}</h2>
          </div>
          <ul class="list-group list-group-flush">
            <li class="desc-item list-group-item" v-for="resultDesc in selectDesc" :key="resultDesc.id">
              <p class="txt">{{ getJobDesc(resultDesc) }} </p>
            </li>
          </ul>
        </div>

        <!-- <p style="border-bottom: 1px solid #000; padding-top: 15px"></p> -->

        <div class="card">
          <div class="card-header">
            <h2 style="padding-top: 15px;">{{ qualificationTitle }}</h2>
          </div>  
          <ul class="list-group list-group-flush">
            <li class="qua-item list-group-item" v-for="resultQua in selectQua" :key="resultQua.id">
              <p class="txt">{{ getJobQua(resultQua) }}</p>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
    
    <div class="section" >
      <button type="button" class="btn btn-lg" @click="goBack()">&larr; {{btnbackTitle}}</button>
      <button type="button" class="btn btn-lg" @click="goForm()">{{ btnformTitle }} &rarr;</button>
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
  import { forEach } from "lodash";
  import { result } from "lodash";
  import { mdiConsoleLine } from "@mdi/js";
  
  export default {
    components: {
      Loading,
    },

    data() {
      return {
        descriptions: [],
        selectDesc: [],
        selectQua: [],
        qualifications: [],
        descResult: [],
        quaResult: [],
        language: 'en',
        languages: [
          { text: 'English', value: 'en' },
          { text: 'ไทย', value: 'th' }
        ],
        titles: {
          description: {
            en: 'Description',
            th: 'รายละเอียดงาน'
          },
          qualification: {
            en: 'Qualification',
            th: 'คุณสมบัติ'
          },
          btnback: {
            en: 'Go Back',
            th: 'กลับหน้าแรก'
          },
          btnform: {
            en: 'Apply',
            th: 'สมัครงาน'
          },
        }
      };
    },
  
    computed: {
      ...sync("*"),
      descriptionTitle() {
        return this.language === 'en' ? this.titles.description.en : this.titles.description.th;
      },
      qualificationTitle() {
        return this.language === 'en' ? this.titles.qualification.en : this.titles.qualification.th;
      },
      btnbackTitle() {
        return this.language === 'en' ? this.titles.btnback.en : this.titles.btnback.th;
      },
      btnformTitle() {
        return this.language === 'en' ? this.titles.btnform.en : this.titles.btnform.th;
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
          this.descResult = response.data
          this.selectDesc = this.descResult.filter(element => 
            this.PositionDesc.includes(element.positionID)
          );
        } catch (error) {
          console.error(error);
        }
      },
      async fetchQualification() {
        try {
          const response = await apiService.getQualification();
          this.quaResult = response.data
          this.selectQua = this.quaResult.filter(element => 
            this.PositionDesc.includes(element.positionID)
          );
        } catch (error) {
          console.error(error);
        }
      },
      goBack() {
      this.$router.push({ name: 'Career'});
      },
      goForm() {
      this.$router.push({ name: 'RegForm'});
      },
      switchLanguage() {
      return this.language;
      },
      getJobDesc(resultDesc) {
        return this.language === 'en' ? resultDesc.descriptionEN : resultDesc.descriptionTH;
      },
      getJobQua(resultQua) {
        return this.language === 'en' ? resultQua.qualificationsEN : resultQua.qualificationsTH;
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

  .card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    /* padding-top: 10px; */
    /* padding-bottom: 20px; */
    /* padding-left: 20px;
    padding-right: 20px; */
    margin: 25px 15px 0px 15px;
    /* background: linear-gradient(to top, #f5f7fa 0%, #c3cfe2 100%); */
  }

  .card-header {
    padding-left: 20px;
    padding-right: 20px;
    background-color: rgb(228, 227, 227);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .results-section {
    width: 100%;
    padding: 20px;
  }
  
  .btn {
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
    margin-right: 20px;
    background-color: #007fc4;
    color: white;
  }

  .section {
    padding: 0px 40px 0px 37px;
  }

  .desc-item {
    padding-top: 20px;
  }

  .qua-item {
    padding-top: 20px;
  }

  .txt {
    font-size: 17px;
  }

  .language-select {
    padding: 10px;
    margin-bottom: 9px;
    border-radius: 5px;
    width: 110px
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
