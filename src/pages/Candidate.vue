<template>
  <v-card>
    <v-card-title>
      <span style="font-weight: bold; font-size: 17px;">
        รายชื่อผู้สมัคร
      </span>
      <v-spacer></v-spacer>
      <v-flex lg3 class="filter-select">
          <v-text-field
            v-model="searchCan"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-flex>
    </v-card-title>
      <v-data-table
      :headers="headers"
      :search="searchCan"
      :items="candidates"
      class="custom-table"
      >
        <!-- Customize items -->
        <template v-slot:items="props">
          <tr>
            <td class="text-left">{{ props.item.candidateID }}</td>
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
              <v-icon v-if="props.item.status !== 'REJECT' && props.item.status !== 'APPROVE'" color="green lighten-1">mdi-checkbox-marked</v-icon>
              <v-icon v-if="props.item.status !== 'REJECT' && props.item.status !== 'APPROVE'" color="red" @click="editCandidate('REJECT', props.item.candidateID)">mdi-close-box</v-icon>
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
        { text: 'ID', value: 'candidateID' },
        { text: 'Title', value: 'title' },
        { text: 'First Name', value: 'first_Name' },
        { text: 'Last Name', value: 'last_Name' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Resume', value: 'resume', sortable: false, },
        { text: 'ช่องทางการรับข่าวสาร', value: 'social' },
        { text: 'Position Name', value: 'position_Name' },
        { text: 'วันที่สมัคร', value: 'create_Date' },
        // { text: 'Consent Version', value: 'consent_Version' },
        { text: 'Status', value: 'status' },
        { text: 'Action', sortable: false,},
        // เพิ่มหัวของคอลัมน์อื่น ๆ ตามต้องการ
      ],
      candidates: [],
      searchCan: '',
      loadingDialog: false,
    };
  },

  computed: {
    ...sync("*"),
  },

  watch: {

  },

  created() {
    this.fetchCandidates();
  },
  
  methods: {
    async fetchCandidates() {
      try {
        const response = await apiService.getCandidate();
        this.candidates = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    sortBy(column) {
    // หากต้องการเรียงจากน้อยไปหามาก
    this.candidates.sort((a, b) => a[column] - b[column]);
    },

    openResume(path) {
    window.open(path, '_blank'); // สั่งให้เบราว์เซอร์เปิดไฟล์ในแท็บใหม่
    },

    async editCandidate(type, data) {
      if(type == 'APPROVE'){
        Swal.fire({
          title: 'Are you sure you want to approve this candidate ?',
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
          title: 'Are you sure you want to reject this candidate ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, i confirm!',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmEditCandidate(type, data);
          }
        });
      }
    },
    async confirmEditCandidate(type, data) {
      var dataApp = {
        CandidateID: data,
        Status: type,
      }
      console.log('EN', dataApp);
      this.loadingDialog = true; // แสดง Loader
      try {
        const response = await apiService.updateCandidate(dataApp);
        this.loadingDialog = false; // แสดง Loader
        console.log('Response:', response.data);
        Swal.fire({
              title: 'สำเร็จ!',
              text: 'Update data succes',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
        this.fetchCandidates();
      } catch (error) {
        console.error(error);
      }
    },
  }
};
</script>

<style>
.filter-select {
  padding-right: 10px;
  padding-left: 10px;
  border-left: 1.5px solid #abacad;
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