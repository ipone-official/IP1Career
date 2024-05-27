<template>
  <div>
    <div class="job-listings-container">
      <div class="results-section">
        <div class="header">
          <h1 style="padding-bottom: 20px;">{{ PositionName }}</h1>
          <v-select style="max-width: 100px; "
                v-model="language" 
                @change="switchLanguage()" 
                :items="languages"
                solo color="blue">
          </v-select>
        </div>
        <p style="border-bottom: 1px solid #78909C;"></p>

        <div class="card">
        <h2 style="padding-top: 15px;">{{ descriptionTitle }}</h2>
        <ul>
          <li class="desc-item" v-for="resultDesc in selectDesc" :key="resultDesc.id">
            <p class="txt">{{ getJobDesc(resultDesc) }} </p>
          </li>
        </ul>
        </div>

        <!-- <p style="border-bottom: 1px solid #000; padding-top: 15px"></p> -->

        <div class="card">
        <h2 style="padding-top: 15px;">{{ qualificationTitle }}</h2>
        <ul>
          <li class="qua-item" v-for="resultQua in selectQua" :key="resultQua.id">
            <p class="txt">{{ getJobQua(resultQua) }}</p>
          </li>
        </ul>
        </div>
        
      </div>
    </div>
    <div class="btn-section" >
      <v-btn color="info" @click="goBack()" style="border-radius: 10px; height: 45px">&larr; {{btnbackTitle}}</v-btn>
      <v-btn color="info" @click="goForm()" style="border-radius: 10px; height: 45px">{{ btnformTitle }} &rarr;</v-btn>
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
  
  <style>
  /* .theme--light.v-text-field--solo>.v-input__control>.v-input__slot {
    border-radius: 10px;
    background: #0e9cdf;
  }

  .theme--light.v-list {
    background: #0e9cdf;
    color: white;
  } 

  .theme--light.v-select .v-select__selections {
    color: white;
  } */

  .card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    padding-top: 10px;
    padding-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
    margin: 25px 15px 0px 15px;
    background: linear-gradient(to top, #f5f7fa 0%, #c3cfe2 100%);
  }

  .card h2 {
    margin-top: 0;
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

  .btn-section {
    padding: 15px;
  }

  .desc-item {
    padding-top: 20px;
  }

  .qua-item {
    padding-top: 20px;
  }

  .txt {
    font-size: 17px;
    color: ergb(107, 105, 105);
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
