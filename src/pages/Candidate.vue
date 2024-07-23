<template>
  <v-card>
    <v-card-title>
      <span style="font-weight: bold; font-size: 17px;">
        Candidate List
      </span>
      <v-spacer></v-spacer>
      <v-flex lg3 class="filter-search">
          <v-text-field
            v-model="searchCan"
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
      :search="searchCan"
      :items="candidates"
      :rows-per-page-items="rowPerPageItems"
      class="custom-table"
      >
        <!-- Customize items -->
        <template v-slot:items="props">
          <tr>
            <td class="text-left">{{ props.item.candidateID }}</td>
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
import functions from "../plugins/functions";

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
        { text: 'Title EN', value: 'title_EN' },
        { text: 'First Name EN', value: 'first_Name_EN' },
        { text: 'Last Name EN', value: 'last_Name_EN' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Resume', value: 'resume', sortable: false, },
        { text: 'News Channels', value: 'social' },
        { text: 'Position Name', value: 'position_Name' },
        { text: 'Qualifier Date', value: 'dateFormat' },
        { text: 'Status', value: 'status' },
        { text: 'Action', sortable: false,},
      ],
      candidates: [],
      candidateRawData: [],
      filterStatus: null,
      filterPosition: null,
      statusList: [],
      positionList: [],
      searchCan: '',
      loadingDialog: false,
      functions,
    };
  },

  computed: {
    ...sync("*"),
    rowPerPageItems() {
      return [
        { text: "10", value: 10 },
        { text: "30", value: 30 },
        { text: "ALL", value: this.candidates ? this.candidates.length : 0 },
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
    this.fetchCandidates();
  },
  
  methods: {
    filterStatus1() { 
      console.log(this.filterPosition, this.filterStatus)
      if (this.filterStatus === 'All Status' && this.filterPosition === 'All Position') {
        this.candidates = this.candidateRawData;
      }
      else if (this.filterStatus === 'All Status' && this.filterPosition != 'All Position') {
        this.candidates = this.candidateRawData.filter((pos) =>
        pos.position_Name === this.filterPosition
        );
      } 
      else if (this.filterPosition === 'All Position' && this.filterStatus !== 'All Status' ){
        this.candidates = this.candidateRawData.filter((pos) =>
        pos.status === this.filterStatus
        );
      }
      else if (this.filterPosition !== 'All Position' && this.filterStatus !== 'All Status' ){
        this.candidates = this.candidateRawData.filter((pos) =>
        pos.position_Name === this.filterPosition && pos.status === this.filterStatus
        );
      }
    },

    async fetchCandidates() {
      try {
        const response = await apiService.getCandidate();
        this.candidateRawData = response.data;

        for (let i = 0; i < this.candidateRawData.length; i++) {
          const v = this.candidateRawData[i].create_Date.split(" ")
          const v2 = v[0].split("/")
          this.candidateRawData[i].dateFormat = `${v2[2]}${v2[1]}${v2[0]}`
          this.candidateRawData[i].timeFormat = v[1]
        }

        this.statusList = this.candidateRawData
          .map(item => item.status)
          .filter((value, index, self) => self.indexOf(value) === index);
        this.filterStatus = 'QUALIFIER'

        this.positionList = this.candidateRawData
          .map(item => item.position_Name)
          .filter((value, index, self) => self.indexOf(value) === index);
        this.filterPosition = 'All Position'

        this.filterStatus1();
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
.status-badge.qualifier {
  background-color: #d8d8d8;
  color: #a5a5a5;
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