<template>
  <div class="container mt-5">
      <!-- Button to show table -->
    <button @click="showTable = 1" class="btn btn-primary mt-4">
      ดูแผนก
    </button>
    <button @click="showTable = 2" class="btn btn-primary mt-4">
      ดูตำแหน่ง
    </button>
    <button @click="showTable = 3" class="btn btn-primary mt-4">
      ดูคำอธิบายงาน
    </button>

    <!-- Form Add Department -->
    <v-dialog v-model="showDailog" width="50%">
      <v-card>
        <v-card-title>
          <v-icon left>home</v-icon>{{ formtype === 'add' ? 'Add New Department' : 'Update Department' }}
        </v-card-title>
        <v-form ref="form">
        <label for="email">EN</label>
        <input v-model="descEN" class="form-control form-control-lg" type="text" placeholder="EN"></input>
        <label for="email">TH</label>
        <input v-model="descTH" class="form-control form-control-lg" type="text" placeholder="TH"></input>
      </v-form>
        <v-card-actions>
          <v-btn text @click="showDailog = false">Ok</v-btn>
          <v-btn text @click="addDep">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Table Department -->
    <div v-if="showTable == 1">
      <h2>Department</h2>
      <v-btn style="background-color: #007fc4;" @click="showDepAdd('add')">ADD</v-btn>
      <table class="table table-striped">
        <thead>
          <tr>
            <td>Department ID</td>
            <td>Department EN</td>
            <td>Department TH</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="department in departments" :key="department.id">
            <td class="job-item">{{ department.departmentID }}</td>
            <td class="job-item">{{ department.department_DescEN }}</td>
            <td class="job-item">{{ department.department_DescTH }}</td>
            <td><v-icon @click="deleteDep(department.departmentID)">block</v-icon><v-icon @click="showDepAdd('edit', department)">build</v-icon></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Add Position -->
    <v-dialog v-model="showPosAdd" width="50%">
      <v-card>
        <v-card-title>
          <v-icon left>home</v-icon>Add Position
        </v-card-title>
        <v-form ref="form">
        <label for="email">EN</label>
        <input v-model="descEN" class="form-control form-control-lg" type="text" placeholder="EN"></input>
        <label for="email">TH</label>
        <input v-model="descTH" class="form-control form-control-lg" type="text" placeholder="TH"></input>
      </v-form>
        <v-card-actions>
          <v-btn text @click="showPosAdd = false">Ok</v-btn>
          <v-btn text @click="addDep">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Positions table -->
    <div v-if="showTable == 2">
      <h2>Position</h2>
      <v-btn style="background-color: #007fc4;" @click="showPosAdd = true">ADD</v-btn>
      <table class="table table-bordered table-striped">
        <thead>
        <tr>
          <td>Position ID</td>
          <td>Position Name</td>
          <td>Department ID</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="position in positions" :key="position.id">
            <td class="job-item">{{ position.positionID }}</td>
            <td class="job-item">{{ position.position_Name }}</td>
            <td class="job-item">{{ position.departmentID }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Description -->
    <div v-if="showTable == 3">
      <h2>Job Description</h2>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <td>Description ID</td>
            <td>Description EN</td>
            <td>Description TH</td>
            <td>Position ID</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="description in descriptions">
            <td class="job-item">{{ description.descriptionID }}</td>
            <td class="job-item">{{ description.descriptionEN }}</td>
            <td class="job-item">{{ description.descriptionTH }}</td>
            <td class="job-item">{{ description.positionID }}</td>
          </tr>
        </tbody>
      </table>
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
  import 'bootstrap/dist/css/bootstrap.css';
  
  export default {
    components: {
      Loading,
    },
    data() {
      return {
        showDailog: false,
        formtype: '',
        showPosAdd: false,
        showTable: 1,
        selectID: '',
        departments:[],
        positions:[],
        descriptions:[],
        rawData: [],
        language: 'en',
        languages: [
          { text: 'English', value: 'en' },
          { text: 'ภาษาไทย', value: 'th' }
        ],
        descEN: '',
        descTH: '',
      };
    },
  
    computed: {
      ...sync("*"),
    },
  
    created() {
      this.fetchDepartments();
      this.fetchPositions();
      this.fetchDescriptions();
    },
    
    methods: {
      async showDepAdd(type, data){
        if(type == 'edit'){
          this.showDailog = true;
          this.formtype = type;
          this.selectID = data.departmentID;
          this.descEN = '';
          this.descEN = data.department_DescEN;
          this.descTH = '';
          this.descTH = data.department_DescTH;
          console.log('id', this.selectID);
        }
        else{
          this.showDailog = true;
          this.formtype = type;
          this.descEN = '';
          this.descTH = '';
          console.log('id', this.selectID);
        }
    },
      async fetchDepartments() {
        try {
          const response = await apiService.getDepartment();
          this.departments = response.data;
          this.rawData = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      async fetchPositions() {
        try {
          const response = await apiService.getPosition();
          this.positions = response.data;
          this.rawData = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      async fetchDescriptions() {
        try {
          const response = await apiService.getDescription();
          this.descriptions = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      async addDep() {
        const data = this.formtype == 'add'? {
        Department_DescEN: this.descEN,
        Department_DescTH: this.descTH
        } : {        
        DepartmentID: this.selectID,
        Department_DescEN: this.descEN,
        Department_DescTH: this.descTH,
        }

        console.log('EN', this.descEN);
        console.log('TH', this.descTH);
        console.log('Data', data);
        try {
          const response = this.formtype === 'add' ? await apiService.postDepartment(data) :  await apiService.updateDepartment(data);
          console.log('Response:', response.data);
          this.showDailog = false;
          this.fetchDepartments();
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async deleteDep(departmentId) {
        const id = { departmentID : departmentId};
        console.log('id', id);
        try {
          const response = await apiService.deleteDepartment(id);
          console.log('Deleted successfully', response.data);
          this.showDailog = false;
          this.fetchDepartments();
        } catch (error) {
          console.error('Error:', error);
        }
      },
    }
  };
</script>
  
<style scoped>
  
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #000;
  padding-bottom:10px;
}
  
.department-label input[type="checkbox"] {
  margin-right: 5px; /* ปรับระยะห่างตามต้องการ */
}

.depart-text {
 /* display: flex; */
  font-size: 17px;
  padding-top: 15px;
}
  
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
  
.job-item {
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  padding: 20px 0;
  transition: font-size 0.3s;
  color: rgb(105, 105, 105);
}
  
.language-select {
  padding: 5px;
  border: 1px solid #bbb5b5;
  border-radius: 5px;
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
  