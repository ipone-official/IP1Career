<template>
  <!-- <div class="full-background"> -->
    <div class="mybg">
      <div class="head-section">
        <v-layout class="firstline">
          <div v-if="PositionPriority == 'URGENT'" class="urgent">ด่วน !</div>
          <div class="position-font">{{ PositionName }}</div>
        </v-layout>
        <v-layout class="secondline">
          <div class="depart-font">แผนก : {{ PositionDepart }}</div>
        </v-layout>
      </div>

      <div class="content-head">
        {{ descriptionTitle }} :
      </div>
      <div class="content-item" v-for="desc in descResult">
        <!-- <div style="padding-right: 7.5px;">&#9866;</div> -->
        <div>- {{ desc.descriptionEN === "" ? desc.descriptionTH : desc.descriptionEN }}</div>
      </div>

      <div class="content-head">
        {{ qualificationTitle }} :
      </div>
      <div class="content-item" v-for="qua in quaResult">
        <!-- <div style="padding-right: 7.5px;">&#9866;</div> -->
        <div>- {{ qua.qualificationEN === "" ? qua.qualificationTH : qua.qualificationEN }}</div>
      </div>

      <div class="section" >
        <v-btn color="yellow darken-2" @click="goForm()">สมัครงาน &#10095;</v-btn>
      </div>
    </div>
  <!-- </div> -->
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
      },
      description() {
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
      }
    },

    methods: {
      // async fetchDescription() {
      //   try {
      //     const response = await apiService.getDescription();
      //     this.descResult = response.data
      //     this.selectDesc = this.descResult.filter(element => 
      //       this.PositionDesc.includes(element.positionID)
      //     );
      //   } catch (error) {
      //     console.error(error);
      //   }
      // },
      async fetchDescription() {
        try {
          const response = await apiService.getSelectDescriptionDetail(this.PositionJD);
          this.descResult = response.data
        } catch (error) {
          console.error(error);
        }
      },
      async fetchQualification() {
        try {
          const response = await apiService.getSelectQualificationDetail(this.PositionJQ);
          this.quaResult = response.data
        } catch (error) {
          console.error(error);
        }
      },
      goForm() {
      this.Applyform = true;
      this.Applydesc = false;
      },
      // getJobDesc(resultDesc) {
      //   return this.language === 'en' ? resultDesc.descriptionEN : resultDesc.descriptionTH;
      // },
      // getJobQua(resultQua) {
      //   return this.language === 'en' ? resultQua.qualificationsEN : resultQua.qualificationsTH;
      // },
    }
  };
</script>
  
<style scoped>
  .full-background{
    background: #f4f4f4 0%;
    display: flex;
    align-items: center;
    justify-content: center;
  }     
  
  .mybg{
    padding: 20px;
    background: #007fc4 0%;
    max-height: 725px;
    min-height: 725px;
    overflow: auto;
    scrollbar-width: none;
    margin: 25px 25px 0px 25px;
  }

  .v-btn {
    border-radius: 4px;
    color: rgb(0, 0, 0);
  }

  .section {
    margin-top: 20px;
  }

  .head-section {
    border-bottom: 1px solid rgb(255, 255, 255);
    padding-bottom: 15px;
    padding-top: 10px;
  }

  .firstline {
    align-items: center;
    justify-content: center;
  }

  .urgent {
    background-color: red;
    margin-right: 20px;
    padding: 3px 6px 3px 6px;
    color: white;
    font-size: 1em;
    font-weight: 300;
    white-space: nowrap;
  }

  .position-font {
    font-size: 1.6em;
    font-weight: bold;
    color: white;
  }

  .secondline {
    align-items: center;
    justify-content: center;
  }

  .depart-font {
    font-size: 1.3em;
    color: white;
  }

  .content-item {
    padding-top: 15px;
    padding-bottom: 15px;
    display: flex;
    color: white;
    font-size: 1.15em;
  }

  .content-head {
    font-size: 1.3em;
    padding-top: 30px;
    color: white;
    font-weight: bold;
  }
  @media (max-width: 1400px) {
    /* .font-head {
      font-size: 1.5em;
    } */
    .content-item {
      font-size: 1.05em;
    }
    .content-head {
      font-size: 1.3em;
    }
  }

  @media (max-width: 1400px) {
    .font-head {
      font-size: 1.5em;
    }
  }

  @media (max-width: 650px) {
    .position-font {
      font-size: 1.5em;
    }
    .depart-font {
      font-size: 1.2em;
      color: white;
    }
    .urgent {
      font-size: 0.9em;
    }
  }
</style>
