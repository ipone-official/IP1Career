<template>
    <!-- <div class="header">
      <p class="font-head">{{ PositionName }}</p> -->
        <!-- <select v-model="language"  class="form-select form-select-lg language-select" onchange="switchLanguage()">
        <option value="en">English</option>
        <option value="th">Thai</option>
        </select> -->
    <!-- </div> -->

    <div class="container">

      <div class="font-head">
        {{ PositionName }}
      </div>
      
      <div class="section" >
        <v-btn color="yellow darken-2" @click="goForm()">สมัครงาน &rarr;</v-btn>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-font-head">
            <v-icon style="color: white;">mdi-file-document-outline</v-icon>
            {{ descriptionTitle }}
          </div>
        </div>
        <ul class="list-group list-group-flush">
          <li class="desc-item list-group-item" v-for="resultDesc in selectDesc" :key="resultDesc.id">
            <div style="padding-right: 7.5px;">&#10148;</div>
            <div class="txt">{{ getJobDesc(resultDesc) }} </div>
          </li>
        </ul>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-font-head">
            <v-icon style="color: white;">mdi-clipboard-check-outline</v-icon>
            {{ qualificationTitle }}
          </div>
        </div>  
        <ul class="list-group list-group-flush">
          <li class="qua-item list-group-item" v-for="resultQua in selectQua" :key="resultQua.id">
            <div style="padding-right: 7.5px;">&#10148;</div>
            <div class="txt">{{ getJobQua(resultQua) }}</div>
          </li>
        </ul>
      </div>

      <div class="section" >
        <v-btn color="yellow darken-2" @click="goForm()">สมัครงาน &rarr;</v-btn>
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
          btnform: {
            en: 'Apply',
            th: 'สมัครงาน'
          },
          // btnback: {
          //   en: 'Go Back',
          //   th: 'กลับหน้าแรก'
          // },
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
    
    watch: {
      PositionDesc(){
        this.fetchDescription();
        this.fetchQualification();
      // if (this.selectID.length == 0) {
      //   console.log(this.rawData);
      //   this.positions = this.rawData;
        
      // } else {
      //   this.positions = this.rawData.filter((position) => 
      //     this.selectID.includes(position.departmentID)
      //   );
      // }
      }
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
      // goBack() {
      // this.$router.push({ name: 'Career'});
      // },
      goForm() {
      this.Applyform = true;
      this.Applydesc = false;
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
    max-width: 100%;
    padding: 20px;
    background: #ffffff 0%;
    max-height: 750px;
    min-height: 750px;
    overflow: auto;
    scrollbar-width: none;
  }

  .card {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    /* padding-top: 10px; */
    /* padding-bottom: 20px; */
    /* padding-left: 20px;
    padding-right: 20px; */
    margin: 25px 20px 25px 20px;
  }

  .card-header {
    /* background: linear-gradient(to bottom, #007fc4 50%, #0977b3 50%); */
    background-color: #007fc4;
    color:white;
    border-radius: 6px 6px 0px 0px !important;
  }
  
  .results-section {
    width: 100%;
    padding: 20px;
  }
  
  .v-btn {
    border-radius: 4px;
    color: rgb(0, 0, 0);
  }

  .section {
    padding: 0px 40px 0px 15px;
  }

  .desc-item {
    padding-top: 17.5px;
    padding-bottom: 17.5px;
    display: flex;
  }

  .qua-item {
    padding-top: 17.5px;
    padding-bottom: 17.5px;
    display: flex;
  }
  
  .font-head {
    font-size: 1.75em;
    padding-top: 30px;
    padding-bottom: 10px;
    font-weight: bold;
    color: #1b489b;
    text-align: center;
  }

  .txt {
    font-size: 16px;
  }

  .card-font-head {
    font-size: 1.2em; 
    font-weight: bold; 
    padding: 2.5px 20px 2.5px 0px;
  }

  li:nth-child(even) {
    background-color: #e9e7e7;
  }

  @media (max-width: 1400px) {
    .font-head {
      font-size: 1.5em;
    }
    .txt {
      font-size: 14px;
    }
    .card-font-head {
      font-size: 1.1em; 
    }
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
