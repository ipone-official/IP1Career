<template>
  <v-card>
    <v-card-title>
    <span style="font-weight: bold; font-size: 17px;">
      รายชื่อผู้สมัคร
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
      >
        <template v-slot:items="props">
          <tr>
            <td class="text-left">{{ props.item.applicantID }}</td>
            <td class="text-left">{{ props.item.title }}</td>
            <td class="text-left">{{ props.item.first_Name }}</td>
            <td class="text-left">{{ props.item.last_Name }}</td>
            <td class="text-left">{{ props.item.email }}</td>
            <td class="text-left">{{ props.item.phone }}</td>
            <td class="text-left"><v-icon @click="openResume(props.item.resume)">mdi-file-document-outline</v-icon></td>
            <td class="text-left">{{ props.item.social }}</td>
            <td class="text-left">{{ props.item.position_Name }}</td>
            <td class="text-left">{{ props.item.create_Date }}</td>
            <!-- <td class="text-left">{{ props.item.consent_Version }}</td> -->
            <td class="text-left">{{ props.item.status }}</td>
            <td class="text-left">
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

export default {
  components: {
    Loading,
  },

  data() {
    return {
      headers: [
        { text: 'ID', value: 'applicantID' },
        { text: 'Title', value: 'title' },
        { text: 'First Name', value: 'first_Name' },
        { text: 'Last Name', value: 'last_Name' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Resume', value: 'resume' },
        { text: 'ช่องทางการรับข่าวสาร', value: 'social' },
        { text: 'Position Name', value: 'position_Name' },
        { text: 'วันที่สมัคร', value: 'create_Date' },
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
    };
  },

  computed: {
    ...sync("*"),
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
  },
  
  methods: {
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

        this.statusList = this.appRawData
          .map(item => item.status)
          .filter((value, index, self) => self.indexOf(value) === index);
        this.filterStatus = 'All Status'

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
      }
      console.log('EN', dataApp);
      this.loadingDialog = true; // แสดง Loader
      try {
        const response = await apiService.postCandidate(dataApp);
        this.loadingDialog = false;
        console.log('Response:', response.data);
        Swal.fire({
              title: 'สำเร็จ!',
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