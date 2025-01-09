<template>
  <v-card class="pa-3 ma-2">
    <v-card-title>
      <span style="font-weight: bold; font-size: 17px"> Employment List </span>
      <v-spacer></v-spacer>
      <v-flex lg3 class="filter-select">
        <v-text-field
          v-model="searchEmployment"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-flex>
      <v-flex lg3 class="filter-select">
        <v-autocomplete
          outlined
          v-model="filterPosition"
          :items="['All Position', ...positionList]"
          dense
          label="Filter Position"
          return-object
          hide-details
        ></v-autocomplete>
      </v-flex>
      <v-flex lg3 class="filter-select2">
        <v-autocomplete
          outlined
          v-model="filterStatus"
          :items="['All Status', ...statusList]"
          dense
          label="Filter Status"
          return-object
          hide-details
        ></v-autocomplete>
      </v-flex>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :search="searchEmployment"
      :items="employments"
      :rows-per-page-items="rowPerPageItems"
      class="custom-table"
    >
      <!-- Customize items -->
      <template v-slot:items="props">
        <tr>
          <td>{{ props.item.employmentID }}</td>
          <td>{{ props.item.title }}</td>
          <td>{{ props.item.first_Name }}</td>
          <td>{{ props.item.last_Name }}</td>
          <td>{{ props.item.title_EN }}</td>
          <td>{{ props.item.first_Name_EN }}</td>
          <td>{{ props.item.last_Name_EN }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.social }}</td>
          <td>{{ props.item.position_Name }}</td>
          <td>
            {{ functions.yyyymmddConvertDDMMYYYY(props.item.dateFormat) }}
            {{ props.item.timeFormat }}
          </td>
          <!-- <td class="text-left">{{ props.item.consent_Version }}</td> -->
          <td class="wide-column">
            <div :class="['status-badge-emp', props.item.status.toLowerCase()[0]]">
              {{ props.item.status }}
            </div>
          </td>
          <td v-if="userRole != 'CANT'">
            <v-layout>
              <v-icon
              v-if="
                props.item.status !== 'REJECT OFFER' &&
                props.item.status !== 'ACCEPT OFFER'
              "
              color="green lighten-1"
              @click="editEmployment('ACCEPT OFFER', props.item.employmentID)"
              >mdi-checkbox-marked</v-icon
              >
              <v-icon
              v-if="
                props.item.status !== 'REJECT OFFER' &&
                props.item.status !== 'ACCEPT OFFER'
              "
              color="red"
              @click="editEmployment('REJECT OFFER', props.item.employmentID)"
              >mdi-close-box</v-icon
              >
            </v-layout>
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
import apiService from "@/services/apiService";
import Swal from "sweetalert2";
import functions from "../plugins/functions";

export default {
  components: {
    Loading,
  },

  data() {
    return {
      headers: [
        { text: "ID", value: "employmentID" },
        { text: "Prefix(TH)", value: "title" },
        { text: "First Name(TH)", value: "first_Name" },
        { text: "Last Name(TH)", value: "last_Name" },
        { text: "Prefix(EN)", value: "title_EN" },
        { text: "First Name(EN)", value: "first_Name_EN" },
        { text: "Last Name(EN)", value: "last_Name_EN" },
        { text: "Email", value: "email" },
        { text: "Phone", value: "phone" },
        { text: "News Channels", value: "social" },
        { text: "Position Name", value: "position_Name" },
        { text: "Qualifier Date", value: "dateFormat" },
        { text: "Status", value: "status" },
        { text: "Action", sortable: false },
      ],
      employments: [],
      employmentRawData: [],
      filterStatus: null,
      filterPosition: null,
      statusList: [],
      positionList: [],
      searchEmployment: "",
      loadingDialog: false,
      functions,
      userRole: "",
    };
  },

  computed: {
    ...sync("*"),
    rowPerPageItems() {
      return [
        { text: "10", value: 10 },
        { text: "30", value: 30 },
        { text: "ALL", value: this.employments ? this.employments.length : 0 },
      ];
    },
  },

  watch: {
    filterStatus: {
      handler: "filterStatus1",
      immediate: true,
    },
    filterPosition: {
      handler: "filterStatus1",
      immediate: true,
    },
  },

  created() {
    this.fetchEmployments();

    setTimeout(() => {
      this.checkRoleHeader();
    }, 500);
  },

  methods: {
    checkRoleHeader() {
      if (this.infoLogin.ADgroup.includes("User_Career")) {
        this.headers.pop();
        this.userRole = "CANT";
      }
    },

    filterStatus1() {
      if (
        this.filterStatus === "All Status" &&
        this.filterPosition === "All Position"
      ) {
        this.employments = this.employmentRawData;
      } else if (
        this.filterStatus === "All Status" &&
        this.filterPosition != "All Position"
      ) {
        this.employments = this.employmentRawData.filter(
          (pos) => pos.position_Name === this.filterPosition
        );
      } else if (
        this.filterPosition === "All Position" &&
        this.filterStatus !== "All Status"
      ) {
        this.employments = this.employmentRawData.filter(
          (pos) => pos.status === this.filterStatus
        );
      } else if (
        this.filterPosition !== "All Position" &&
        this.filterStatus !== "All Status"
      ) {
        this.employments = this.employmentRawData.filter(
          (pos) =>
            pos.position_Name === this.filterPosition &&
            pos.status === this.filterStatus
        );
      }
    },

    async fetchEmployments() {
      try {
        const data = {
          CurrentEmpID : this.infoLogin.ADempId
        }
        const response = await apiService.getEmployment(data);
        this.employmentRawData = response.data;

        for (let i = 0; i < this.employmentRawData.length; i++) {
          const v = this.employmentRawData[i].create_Date.split(" ");
          const v2 = v[0].split("/");
          this.employmentRawData[i].dateFormat = `${v2[2]}${v2[1]}${v2[0]}`;
          this.employmentRawData[i].timeFormat = v[1];
        }

        this.statusList = this.employmentRawData
          .map((item) => item.status)
          .filter((value, index, self) => self.indexOf(value) === index);
        
          if(this.statusList.includes('OFFERING')){
            this.filterStatus = "OFFERING";
          } else {
            this.filterStatus = "All Status";
          }

        this.positionList = this.employmentRawData
          .map((item) => item.position_Name)
          .filter((value, index, self) => self.indexOf(value) === index);
        this.filterPosition = "All Position";

        this.filterStatus1();
      } catch (error) {
        console.error(error);
      }
    },

    sortBy(column) {
      this.employments.sort((a, b) => a[column] - b[column]);
    },

    async editEmployment(type, data) {
      if (type == "ACCEPT OFFER") {
        Swal.fire({
          title: "Are you sure you want to approve this employment ?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, i confirm!",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.rejectOfferEmployment(type, data);
          }
        });
      } else {
        Swal.fire({
          title: "Are you sure you want to reject this employment ?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, i confirm!",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.rejectOfferEmployment(type, data);
          }
        });
      }
    },
    async rejectOfferEmployment(type, data) {
      var dataApp = {
        EmploymentID: data,
        Status: type,
        CreateBy: this.infoLogin.ADempId,
        NameHR: this.infoLogin.ADname,
        EmailHR: this.infoLogin.ADemail,
        MobileHR: this.infoLogin.ADmobile,
        TelephoneHR: this.infoLogin.ADtelephone || '0'
      };
      console.log("EN2", dataApp);
      this.loadingDialog = true; // แสดง Loader
      try {
        const response = await apiService.updateEmployment(dataApp);
        this.loadingDialog = false; // แสดง Loader
        console.log("Response:", response.data);
        Swal.fire({
          title: "Success!",
          text: "Update data succes",
          icon: "success",
          confirmButtonText: "ตกลง",
          allowOutsideClick: false,
        });
        this.fetchEmployments();
      } catch (error) {
        console.error(error);
      }
    },
    // async acceptOfferEmployment(type, data) {
    //   var dataApp = {
    //     EmploymentID: data,
    //     Status: type,
    //     CreateBy: this.infoLogin.ADname
    //   }
    //   console.log('EN1', dataApp);
    //   this.loadingDialog = true; // แสดง Loader
    //   try {
    //     const response = await apiService.updateEmployment(dataApp);
    //     this.loadingDialog = false; // แสดง Loader
    //     console.log('Response:', response.data);
    //     Swal.fire({
    //           title: 'Success!',
    //           text: 'Update data succes',
    //           icon: 'success',
    //           confirmButtonText: 'ตกลง',
    //           allowOutsideClick: false,
    //         });
    //     this.fetchEmployments();
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
  },
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
  border-right: 1.5px solid #abacad;
  /* Adjust the color and width as needed */
  border-left: 1.5px solid #abacad;
  /* Adjust the color and width as needed */
}

.status-badge-emp {
  display: inline-flex;
  align-items: center;
  padding: 1px 7.5px;
  border-radius: 12.5px;
  font-weight: 500;
  width: fit-content;
}

.status-badge-emp.a {
  /* accept offer */
  background-color: #d1f5d1;
  color: #1fac24;
}

.status-badge-emp.r {
  /* reject offer */
  background-color: #fad3ce;
  color: #f5372a;
}

.status-badge-emp.o {
  /* offering */
  background-color: #d8d8d8;
  color: #a5a5a5;
}

.wide-column {
  width: 30rem;
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
  background-image: -webkit-gradient(
    linear,
    right top,
    left top,
    from(rgba(51, 148, 225, 0.18)),
    to(transparent)
  );
  background-image: linear-gradient(
    270deg,
    rgba(51, 148, 225, 0.18),
    transparent
  );
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
