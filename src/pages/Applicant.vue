<template>
  <v-card class="pa-3 ma-2">
    <v-card-title>
    <span style="font-weight: bold; font-size: 17px;">
      Applicant List
    </span>
      <v-spacer></v-spacer>
      <p style="border-left: 1.5px solid #abacad"></p>
      <v-flex lg3 class="filter-select">
          <v-text-field
            v-model="searchApp"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-flex>
      <v-flex lg3 class="filter-select">
      <v-autocomplete outlined v-model="filterPosition" :items="['All Position', ...positionList]" dense label="Filter Position" return-object hide-details></v-autocomplete>
      </v-flex>
      <v-flex lg3 class="filter-select2">
      <v-autocomplete outlined v-model="filterStatus" :items="['All Status', ...statusList]" dense label="Filter Status" return-object hide-details></v-autocomplete>
      </v-flex>
    </v-card-title>
      <v-data-table
      :headers="headers"
      :search="searchApp"
      :items="applicants"
      :rows-per-page-items="rowPerPageItems"
      >
        <template v-slot:items="props">
          <tr>
            <td class="text-left">{{ props.item.applicantID }}</td>
            <td class="text-left">{{ props.item.title }}</td>
            <td class="text-left">{{ props.item.first_Name }}</td>
            <td class="text-left">{{ props.item.last_Name }}</td>
            <td class="text-left">{{ props.item.title_EN }}</td>
            <td class="text-left">{{ props.item.first_Name_EN }}</td>
            <td class="text-left">{{ props.item.last_Name_EN }}</td>
            <td class="text-left">{{ props.item.email }}</td>
            <td class="text-left">{{ props.item.phone }}</td>
            <td class="text-left"><v-icon @click="openResume(props.item.resume)">mdi-file-document-outline</v-icon></td>
            <td class="text-left">{{ props.item.social }}</td>
            <td class="text-left">{{ props.item.position_Name }}</td>
            <td class="text-left">{{ functions.yyyymmddConvertDDMMYYYY(props.item.dateFormat) }} {{ props.item.timeFormat }}</td>
            <!-- <td class="text-left">{{ props.item.consent_Version }}</td> -->
            <td class="text-left">
              <div :class="['status-badge', props.item.status.toLowerCase()]">
                {{ props.item.status }}
              </div>
            </td>
            <td class="text-left" v-if="userRole != 'CANT'">
              <v-icon v-if="props.item.status !== 'REJECT' && props.item.status !== 'APPROVE'" color="green lighten-1" @click="editApplicant('APPROVE', props.item.applicantID)">mdi-checkbox-marked</v-icon>
              <v-icon v-if="props.item.status !== 'REJECT' && props.item.status !== 'APPROVE'" color="red" @click="editApplicant('REJECT', props.item.applicantID)">mdi-close-box</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>

      <div v-if="loadingDialog">
        <Loading :value="loadingDialog" />
      </div>

  </v-card>
</template>

<script>
import Loading from "../components/core/Loading";
import { sync } from "vuex-pathify";
import apiService from '@/services/apiService';
import Swal from "sweetalert2";
import functions from "../plugins/functions";

export default {
  components: {
    Loading,
  },

  data() {
    return {
      headers: [
        { text: 'ID', value: 'applicantID' },
        { text: 'Prefix(TH)', value: 'title' },
        { text: 'First Name(TH)', value: 'first_Name' },
        { text: 'Last Name(TH)', value: 'last_Name' },
        { text: 'Prefix(EN)', value: 'title_EN' },
        { text: 'First Name(EN)', value: 'first_Name_EN' },
        { text: 'Last Name(EN)', value: 'last_Name_EN' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Resume', value: 'resume' },
        { text: 'News Channels', value: 'social' },
        { text: 'Position Name', value: 'position_Name' },
        { text: 'Register Date', value: 'dateFormat' },
        // { text: 'Consent Version', value: 'consent_Version' },
        { text: 'Status', value: 'status' },
        { text: 'Action'}
      ],
      applicants: [],
      appRawData: [],
      filterStatus: null,
      filterPosition: null,
      statusList: [],
      positionList: [],
      searchApp: '',
      loadingDialog: false,
      functions,
      userRole: '',
    };
  },

  computed: {
    ...sync("*"),
    rowPerPageItems() {
      return [
        { text: "10", value: 10 },
        { text: "30", value: 30 },
        { text: "ALL", value: this.applicants ? this.applicants.length : 0 },
      ];
    },
  },

  watch: {
    filterStatus: {
      handler: 'filterStatus1',
      immediate: true
    },
    filterPosition: {
      handler: 'filterStatus1',
      immediate: true 
    },
  },

  created() {
    this.fetchApplicants();

    setTimeout(() => {
      this.checkRoleHeader();
    }, 500);
  },
  
  methods: {
    checkRoleHeader() {
      if (this.infoLogin.ADgroup.includes("User_Career")) {
        this.headers.pop();
        this.userRole = 'CANT';
      }
    },

    filterStatus1() { 
      console.log(this.filterPosition, this.filterStatus)
      if (this.filterStatus === 'All Status' && this.filterPosition === 'All Position') {
        this.applicants = this.appRawData;
      }
      else if (this.filterStatus === 'All Status' && this.filterPosition != 'All Position') {
        this.applicants = this.appRawData.filter((pos) =>
        pos.position_Name === this.filterPosition
        );
      } 
      else if (this.filterPosition === 'All Position' && this.filterStatus !== 'All Status' ){
        this.applicants = this.appRawData.filter((pos) =>
        pos.status === this.filterStatus
        );
      }
      else if (this.filterPosition !== 'All Position' && this.filterStatus !== 'All Status' ){
        this.applicants = this.appRawData.filter((pos) =>
        pos.position_Name === this.filterPosition && pos.status === this.filterStatus
        );
      }
    },

    async fetchApplicants() {
      try {
        const response = await apiService.getApplicant();
        this.appRawData = response.data;

        for (let i = 0; i < this.appRawData.length; i++) {
          const v = this.appRawData[i].create_Date.split(" ")
          const v2 = v[0].split("/")
          this.appRawData[i].dateFormat = `${v2[2]}${v2[1]}${v2[0]}`
          this.appRawData[i].timeFormat = v[1]
        }

        this.statusList = this.appRawData
          .map(item => item.status)
          .filter((value, index, self) => self.indexOf(value) === index);

          if(this.statusList.includes('REGISTERED')){
            this.filterStatus = "REGISTERED";
          } else {
            this.filterStatus = "All Status";
          }

        this.positionList = this.appRawData
          .map(item => item.position_Name)
          .filter((value, index, self) => self.indexOf(value) === index);
        this.filterPosition = 'All Position'

        this.filterStatus1();
      } catch (error) {
        console.error(error);
      }
    },

    async editApplicant(type, data) {
      if(type == 'APPROVE'){
        Swal.fire({
          title: 'Are you sure you want to approve this applicant ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, i confirm!',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmEditApplicant(type, data);
          }
        });
      } else {
        Swal.fire({
          title: 'Are you sure you want to reject this applicant ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, i confirm!',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmEditApplicant(type, data);
          }
        });
      }
    },
    async confirmEditApplicant(type, data) {
      var dataApp = {
        ApplicantID: data,
        Status: type,
        AcceptBy: this.infoLogin.ADempId
      }
      console.log('EN', dataApp);
      this.loadingDialog = true; // แสดง Loader
      try {
        const response = await apiService.postCandidate(dataApp);
        this.loadingDialog = false;
        console.log('Response:', response.data);
        Swal.fire({
              title: 'Success!',
              text: 'Update data succes',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
        this.fetchApplicants();
      } catch (error) {
        console.error(error);
      }
    },

    sortBy(column) {
      this.applicants.sort((a, b) => a[column] - b[column]);// หากต้องการเรียงจากน้อยไปหามาก
    },
    openResume(path) {
      window.open(path, '_blank'); // สั่งให้เบราว์เซอร์เปิดไฟล์ในแท็บใหม่
    }
  }
};
</script>

<style scoped>
.filter-search {
  padding-right: 10px;
  padding-left: 10px;
  border-left: 1.5px solid #abacad;
}

.filter-select {
  padding-right: 10px;
  padding-left: 10px;
  border-left: 1.5px solid #abacad;
}

.filter-select2 {
  padding-right: 10px;
  padding-left: 10px;
  border-right: 1.5px solid #abacad; /* Adjust the color and width as needed */
  border-left: 1.5px solid #abacad; /* Adjust the color and width as needed */
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25em 0.5em;
  border-radius: 20px;
  font-weight: 500;
  width: fit-content;
}
.status-badge.approve {
  background-color: #d1f5d1;
  color: #1fac24;
}
.status-badge.reject {
  background-color: #fad3ce;
  color: #f5372a;
}
.status-badge.registered {
  background-color: #d8d8d8;
  color: #888686;
}

@media (max-width: 965px) {
  .filter-select {
    border-right: 1.5px solid #abacad;
  }
}

@media (max-width: 695px) {
  .filter-select2 {
    border-left: 0px solid #abacad;
  }
  .filter-search {
    border-right: 1.5px solid #abacad;
  }
}

@media (max-width: 575px) {
  .filter-select2 {
    border-left: 1.5px solid #abacad;
  }

}

.theme--light.v-table thead th {
    background-image: -webkit-gradient(linear, right top, left top, from(rgba(51, 148, 225, 0.18)), to(transparent));
    background-image: linear-gradient(270deg, rgba(51, 148, 225, 0.18), transparent);
    background-color: #007fc4 !important;
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