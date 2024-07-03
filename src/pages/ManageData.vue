<template>
  <div style="padding: 0px 20px 0px 20px;">
    <div class="section">
        <!-- Button to show table -->
      <v-btn @click="showTable = 1" color="#007fc4" dark class="mb-2">
        Table Department
      </v-btn>
      <v-btn @click="showTable = 2, filterDepartment = 'All Department'" color="#007fc4" dark class="mb-2">
        Table Position
      </v-btn>
      <v-btn @click="showTable = 3, filterPositionDesc = 'All Position'" color="#007fc4" dark class="mb-2">
        Table Description
      </v-btn>
      <v-btn @click="showTable = 4, filterPositionQua = 'All Position'" color="#007fc4" dark class="mb-2">
        Table Qualification
      </v-btn>
    </div>

    <!-- Form Add Department -->
    <v-dialog v-model="showDepDialog" persistent  width="50%">
      <v-card>
        <v-card-title style="font-weight: bold;">
          <v-icon left>home</v-icon>{{ formtype1 === 'add' ? 'Add New Department' : 'Update Department' }}
        </v-card-title>
        <v-form ref="form" style="padding: 10px 20px 10px 20px;">
          <label class="custom-label">Department EN</label>
          <v-text-field v-model="descEN" solo placeholder="EN" @keydown.native="keyFilter($event, 'Group')" background-color="#E9ECEF"></v-text-field>
          <label class="custom-label">Department TH</label>
          <v-text-field v-model="descTH" solo placeholder="TH" @keydown.native="keyFilter($event, 'GroupTh')" background-color="#E9ECEF"></v-text-field>
          <label class="custom-label">Status</label>
          <v-select v-model="descStatus" :items="statusList" label="Select Status" solo background-color="#E9ECEF"></v-select>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" @click="validateDepartment">Submit</v-btn>
          <v-btn color="yellow darken-3" @click="showDepDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Table Department -->
    <v-card v-if="showTable == 1">
      <v-card-title>
        <span style="font-weight: bold; font-size: 18px;">
          Department
        </span>
        <v-spacer></v-spacer>
        <v-flex md3 xl3 lg3 class="filter-select">
          <v-text-field
            v-model="searchDep"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-flex>
        <v-btn color="#007fc4" dark @click="showDepAdd('add')">ADD</v-btn>
      </v-card-title>
      <v-data-table
      :headers="headersDep"
      :search="searchDep"
      :items="departments"
      >
        <template v-slot:items="props">
          <tr>
            <td class="text-left">{{ props.item.departmentID }}</td>
            <td class="text-left">{{ props.item.department_DescEN }}</td>
            <td class="text-left">{{ props.item.department_DescTH }}</td>
            <td class="text-left">
              <div :class="['status-badge', props.item.status.toLowerCase()]">
                {{ props.item.status }}
              </div>
            </td>
            <td class="text-left">
              <!-- <v-btn fab small depressed color="yellow darken-2"> -->
                <v-icon color="yellow darken-2" @click="showDepAdd('edit', props)">mdi-pencil</v-icon>
              <!-- </v-btn> -->
              <!-- <v-btn fab small depressed color="red"> -->
                <v-icon color="red" @click="deleteDep(props.item.departmentID)">mdi-delete</v-icon>
              <!-- </v-btn> -->
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Form Add Position -->
    <v-dialog v-model="showPosDialog" persistent width="50%">
      <v-card>
        <v-card-title style="font-weight: bold;">
          <v-icon left>home</v-icon>{{ formtype2 === 'add' ? 'Add New Position' : 'Update Position' }}
        </v-card-title>
        <v-form ref="form" style="padding: 10px 20px 10px 20px;">
          <label class="custom-label">Position Name</label>
          <v-text-field v-model="posName" type="text" placeholder="EN" solo @keydown.native="keyFilter($event, 'Group')" background-color="#E9ECEF"></v-text-field>
          <label class="custom-label">Department Name</label>
          <v-select v-model="depID" :items="departments" item-text="department_DescEN" item-value="departmentID" label="Select Department" solo background-color="#E9ECEF"></v-select>
          <label class="custom-label">Status</label>
          <v-select v-model="posStatus" :items="statusList" label="Select Status" solo background-color="#E9ECEF"></v-select>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" @click="validatePosition">Submit</v-btn>
          <v-btn color="yellow darken-3" @click="showPosDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Positions table -->
    <v-card v-if="showTable == 2">
      <v-card-title>
        <span style="font-weight: bold; font-size: 18px;">
          Position
        </span>
        <v-spacer></v-spacer>
        <v-flex md3 xl3 lg3 class="filter-select">
          <v-text-field
            v-model="searchPos"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-flex>
        <v-flex md3 xl3 lg3 class="filter-select2">
          <v-autocomplete outlined v-model="filterDepartment" :items="['All Department', ...departmentList]" dense label="Filter Department" return-object hide-details></v-autocomplete>
        </v-flex>
        <v-btn color="#007fc4" dark @click="showPosAdd('add')">ADD</v-btn>
      </v-card-title>
      <v-data-table
      :headers="headersPos"
      :search="searchPos"
      :items="positions"
      >
        <template v-slot:items="props">
          <tr>
            <td>{{ props.item.positionID }}</td>
            <td>{{ props.item.position_Name }}</td>
            <td>{{ props.item.department_DescEN }}</td>
            <td>
              <div :class="['status-badge', props.item.status.toLowerCase()]">
                {{ props.item.status }}
              </div>
            </td>
            <td>
            <v-icon color="yellow darken-2" @click="showPosAdd('edit', props)">mdi-pencil</v-icon>
            <v-icon color="red" @click="deletePos(props.item.positionID)">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Form Add Description -->
    <v-dialog v-model="showDescDialog" persistent width="50%">
      <v-card>
        <v-card-title style="font-weight: bold;">
          <v-icon left>home</v-icon>{{ formtype3 === 'add' ? 'Add New Description' : 'Update Description' }}
        </v-card-title>
        <v-form ref="form" style="padding: 10px 20px 10px 20px;">
          <label class="custom-label" >Position</label>
          <v-select outlined v-model="filterDepartment" :items="['All Department', ...departmentList]" dense label="Filter Department" return-object solo background-color="#E9ECEF"></v-select>
          <v-select v-model="posID" :items="positions" item-text="position_Name" item-value="positionID" label="Select Position" outlined solo background-color="#E9ECEF"></v-select>
          <label class="custom-label">Description EN</label>
          <v-text-field v-model="jobDescEN" type="text" placeholder="EN" solo @keydown.native="keyFilter($event, 'Group')" background-color="#E9ECEF"></v-text-field>
          <label class="custom-label">Description TH</label>
          <v-text-field v-model="jobDescTH" type="text" placeholder="TH" solo @keydown.native="keyFilter($event, 'GroupTh')" background-color="#E9ECEF"></v-text-field>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" @click="validateDesc">Submit</v-btn>
          <v-btn color="yellow darken-3" @click="showDescDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Table Description -->
    <v-card v-if="showTable == 3">
      <v-card-title>
        <span style="font-weight: bold; font-size: 18px;">
          Job Description
        </span>
        <v-spacer></v-spacer>
        <v-flex md3 xl3 lg3 class="filter-select">
          <v-text-field
            v-model="searchDesc"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-flex>
        <v-flex md3 xl3 lg3 class="filter-select2">
        <v-autocomplete outlined v-model="filterPositionDesc" :items="['All Position', ...descPositionList]" dense label="Filter Position" return-object hide-details></v-autocomplete>
        </v-flex>
        <v-btn color="#007fc4" dark @click="showDescAdd('add'), filterDepartment = 'All Department'">ADD</v-btn>
      </v-card-title>
      <v-data-table
      :headers="headersDesc"
      :search="searchDesc"
      :items="descriptions"
      >
        <template v-slot:items="props">
          <tr>
            <td class="text-left">{{ props.item.descriptionID }}</td>
            <td class="text-left">{{ props.item.descriptionEN }}</td>
            <td class="text-left">{{ props.item.descriptionTH }}</td>
            <td class="text-left">{{ props.item.position_Name }}</td>
            <td class="text-left">
            <v-icon color="yellow darken-2" @click="showDescAdd('edit', props), filterDepartment = 'All Department'">mdi-pencil</v-icon>
            <v-icon color="red" @click="deleteDesc(props.item.descriptionID)">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Form Add Qualification -->
    <v-dialog v-model="showQuaDialog" persistent width="50%">
      <v-card>
        <v-card-title style="font-weight: bold;">
          <v-icon left>home</v-icon>{{ formtype4 === 'add' ? 'Add New Qualification' : 'Update Qualification' }}
        </v-card-title>
        <v-form ref="form" style="padding: 10px 20px 10px 20px;">
          <label class="custom-label" >Position</label>
          <v-select outlined v-model="filterDepartment" :items="['All Department', ...departmentList]" dense label="Filter Department" return-object solo background-color="#E9ECEF"></v-select>
          <v-select v-model="posID" :items="positions" item-text="position_Name" item-value="positionID" label="Select Position" outlined solo background-color="#E9ECEF"></v-select>
          <label class="custom-label">Qualification EN</label>
          <v-text-field v-model="quaEN" type="text" placeholder="EN" solo @keydown.native="keyFilter($event, 'Group')" background-color="#E9ECEF"></v-text-field>
          <label class="custom-label">Qualification TH</label>
          <v-text-field v-model="quaTH" type="text" placeholder="TH" solo @keydown.native="keyFilter($event, 'GroupTh')" background-color="#E9ECEF"></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#007fc4" @click="validateQua">Submit</v-btn>
            <v-btn color="yellow darken-3" @click="showQuaDialog = false">Close</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- Table Qualification -->
    <v-card v-if="showTable == 4">
      <v-card-title>
        <span style="font-weight: bold; font-size: 18px;">
          Job Qualification
        </span>
        <v-spacer></v-spacer>
        <v-flex md3 xl3 lg3 class="filter-select">
          <v-text-field
            v-model="searchQua"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-flex>
        <v-flex md3 xl3 lg3 class="filter-select2">
          <v-autocomplete outlined v-model="filterPositionQua" :items="['All Position', ...quaPositionList]" dense label="Filter Position" return-object hide-details></v-autocomplete>
        </v-flex>
        <v-btn color="#007fc4" dark @click="showQuaAdd('add'), filterDepartment = 'All Department'">ADD</v-btn>
      </v-card-title>
      <v-data-table
      :headers="headersQua"
      :search="searchQua"
      :items="qualifications"
      >
        <template v-slot:items="props">
          <tr>
            <td class="text-left">{{ props.item.qualificationsID }}</td>
            <td class="text-left">{{ props.item.qualificationsEN }}</td>
            <td class="text-left">{{ props.item.qualificationsTH }}</td>
            <td class="text-left">{{ props.item.position_Name }}</td>
            <td class="text-left">
            <v-icon color="yellow darken-2" @click="showQuaAdd('edit', props), filterDepartment = 'All Department'">mdi-pencil</v-icon>
            <v-icon color="red" @click="deleteQua(props.item.qualificationsID)">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snackbar" color="red">
      {{ snackbarMessage }}
      <v-btn flat color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
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
        showDepDialog: false,
        showPosDialog: false,
        showDescDialog: false,
        showQuaDialog: false,
        formtype1: '',
        formtype2: '',
        formtype3: '',
        formtype4: '',
        showTable: 1,
        selectID: '',
        selectID2: '',
        selectID3: '',
        selectID4: '',
        departments:[],
        positions:[],
        descriptions:[],
        qualifications:[],
        filterDepartment: null,
        filterPositionDesc: null,
        filterPositionQua: null,
        posRawData: [],
        descRawData: [],
        quaRawData: [],
        departmentList: [], 
        descPositionList: [],
        quaPositionList: [],
        descEN: '',
        descTH: '',
        descStatus: '',
        posStatus: '',
        statusList: ['ACTIVE', 'INACTIVE'],
        posName: '',
        depID: '',
        jobDescEN: '',
        jobDescTH: '',
        posID: '',
        quaEN: '',
        quaTH: '',
        headersDep: [
          { text: 'ID', value: 'departmentID' },
          { text: 'Department EN', value: 'department_DescEN' },
          { text: 'Department TH', value: 'department_DescTH' },
          { text: 'Status', value: 'status' },
          { text: 'Action', sortable: false}
        ],
        headersPos: [
          { text: 'ID', value: 'positionID' },
          { text: 'Position', value: 'position_Name' },
          { text: 'Department', value: 'department_DescEN' },
          { text: 'Status', value: 'status' },
          { text: 'Action', sortable: false}
        ],
        headersDesc: [
          { text: 'ID', value: 'descriptionID' },
          { text: 'Description EN', value: 'descriptionEN' },
          { text: 'Description TH', value: 'descriptionTH' },
          { text: 'Position', value: 'position_Name' },
          { text: 'Action', sortable: false}
        ],
        headersQua: [
          { text: 'ID', value: 'qualificationsID' },
          { text: 'Qualification EN', value: 'qualificationsEN' },
          { text: 'Qualification TH', value: 'qualificationsTH' },
          { text: 'Position', value: 'position_Name' },
          { text: 'Action', sortable: false}
        ],
        snackbar: false,
        snackbarMessage: '',
        keyFilter,
        searchDep: '',
        searchPos: '',
        searchDesc: '',
        searchQua: '',
      };
    },
  
    computed: {
      ...sync("*"),
    },
  
    created() {
      this.fetchDepartments();
      this.fetchPositions();
      this.fetchDescriptions();
      this.fetchQualifications();
    },
    
    watch: {
      filterDepartment: {
        handler: 'filterDepartments',
        immediate: true // เรียกใช้ filterDepartments เมื่อค่าเริ่มต้นของ filterDepartment มีค่า
      },
      filterPositionDesc: {
        handler: 'filterPositions',
        immediate: true // เรียกใช้ filterDepartments เมื่อค่าเริ่มต้นของ filterDepartment มีค่า
      },
      filterPositionQua: {
        handler: 'filterQualifications',
        immediate: true // เรียกใช้ filterDepartments เมื่อค่าเริ่มต้นของ filterDepartment มีค่า
      }
    },
    
    methods: {
      filterDepartments() { // filter ตาราง position โดยใช้ department
        if (this.filterDepartment === 'All Department') {
          this.positions = this.posRawData;
        } else {
          this.positions = this.posRawData.filter((position) =>
            position.department_DescEN === this.filterDepartment
          );
        }
      },

      filterPositions() { // filter ตาราง description โดยใช้ position
        if (this.filterPositionDesc === 'All Position') {
          this.descriptions = this.descRawData;
        } else {
          this.descriptions = this.descRawData.filter((description) =>
            description.position_Name === this.filterPositionDesc
          );
        }
      },

      filterQualifications() { // filter ตาราง qualification โดยใช้ position
        if (this.filterPositionQua === 'All Position') {
          this.qualifications = this.quaRawData;
        } else {
          this.qualifications = this.quaRawData.filter((qualification) =>
            qualification.position_Name === this.filterPositionQua
          );
        }
      },

      async showDepAdd(type, data){
        if(type == 'edit'){
          this.showDepDialog = true;
          this.formtype1 = type;
          this.selectID = data.item.departmentID;
          this.descEN = '';
          this.descEN = data.item.department_DescEN;
          this.descTH = '';
          this.descTH = data.item.department_DescTH;
          this.descStatus = '';
          this.descStatus = data.item.status;
          console.log('id', this.selectID);
        }
        else{
          this.showDepDialog = true;
          this.formtype1 = type;
          this.descEN = '';
          this.descTH = '';
          this.descStatus = '';
          console.log('id', this.selectID);
        }
      },

      async showPosAdd(type, data){
        if(type == 'edit'){
          this.showPosDialog = true;
          this.formtype2 = type;
          this.selectID2 = data.item.positionID;
          this.posName = '';
          this.posName = data.item.position_Name;
          this.depID = '';
          this.depID = data.item.departmentID;
          this.posStatus = '';
          this.posStatus = data.item.status;
        }
        else{
          this.showPosDialog = true;
          this.formtype2 = type;
          this.posName = '';
          this.depID = '';
          this.posStatus = '';
        }
      },

      async showDescAdd(type, data){
        if(type == 'edit'){
          this.showDescDialog = true;
          this.formtype3 = type;
          this.selectID3 = data.item.descriptionID;
          this.jobDescEN = '';
          this.jobDescEN = data.item.descriptionEN;
          this.jobDescTH = '';
          this.jobDescTH = data.item.descriptionTH;
          this.posID = '';
          this.posID = data.item.positionID;
        }
        else{
          this.showDescDialog = true;
          this.formtype3 = type;
          this.jobDescEN = '';
          this.jobDescTH = '';
          this.posID = '';
        }
      },

      async showQuaAdd(type, data){
        if(type == 'edit'){
          this.showQuaDialog = true;
          this.formtype4 = type;
          this.selectID4 = data.item.qualificationsID;
          this.quaEN = '';
          this.quaEN = data.item.qualificationsEN;
          this.quaTH = '';
          this.quaTH = data.item.qualificationsTH;
          this.posID = '';
          this.posID = data.item.positionID;
        }
        else{
          this.showQuaDialog = true;
          this.formtype4 = type;
          this.quaEN = '';
          this.quaTH = '';
          this.posID = '';
        }
      },

      async fetchDepartments() {
        try {
          const response = await apiService.getDepartment();
          this.departments = response.data;
        } catch (error) {
          console.error(error);
        }
      },

      async fetchPositions() {
        try {
          const response = await apiService.getPosition();
          this.posRawData = response.data;
          this.departmentList = this.posRawData
          .map(item => item.department_DescEN)
          .filter((value, index, self) => self.indexOf(value) === index);
          this.filterDepartments(); // Re-apply the filter with the new data
        } catch (error) {
          console.error(error);
        }
      },

      async fetchDescriptions() {
        try {
          const response = await apiService.getDescription();
          this.descRawData = response.data;
          this.descPositionList = this.descRawData
          .map(item => item.position_Name)
          .filter((value, index, self) => self.indexOf(value) === index);
          console.log(this.descRawData);
          this.filterPositions();
        } catch (error) {
          console.error(error);
        }
      },

      async fetchQualifications() {
        try {
          const response = await apiService.getQualification();
          this.quaRawData = response.data;
          this.quaPositionList = this.quaRawData
          .map(item => item.position_Name)
          .filter((value, index, self) => self.indexOf(value) === index);
          this.filterQualifications();
        } catch (error) {
          console.error(error);
        }
      },

      validateDepartment() {
        if (isEmpty(this.descEN) || isEmpty(this.descTH)) {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill in all fields.';
        } else {
          this.addDep();
        }
      },

      validatePosition() {
        if (isEmpty(this.posName) || this.depID == '') {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill in all fields.';
        } else {
          this.addPos();
        }
      },

      validateDesc() {
        if (isEmpty(this.jobDescEN) || isEmpty(this.jobDescTH) || this.posID == '') {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill in all fields.';
        } else {
          this.addDesc();
        }
      },

      validateQua() {
        if (isEmpty(this.quaEN) || isEmpty(this.quaTH) || this.posID == '') {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill in all fields.';
        } else {
          this.addQua();
        }
      },

      async addDep() {
        const data = this.formtype1 == 'add'? {
        Department_DescEN: this.descEN,
        Department_DescTH: this.descTH,
        Status: this.descStatus
        } : {        
        DepartmentID: this.selectID,
        Department_DescEN: this.descEN,
        Department_DescTH: this.descTH,
        Status: this.descStatus
        }
        console.log('Data', data);
        try {
          const response = this.formtype1 === 'add' ? await apiService.postDepartment(data) :  await apiService.updateDepartment(data);
          console.log('Response:', response.data);
          this.showDepDialog = false;
          if(this.formtype1 == 'add'){
            Swal.fire({
              title: 'Success!',
              text: 'Add data succes',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          } else {
            Swal.fire({
              title: 'Success!',
              text: 'Update data succes',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          }
          this.fetchDepartments();
        } catch (error) {
          console.error('Error:', error);
        }
      },

      async addPos() {
        const data = this.formtype2 == 'add'? {
        Position_Name: this.posName,
        DepartmentID: this.depID,
        Status: this.posStatus
        } : {        
        PositionID: this.selectID2,
        Position_Name: this.posName,
        DepartmentID: this.depID,
        Status: this.posStatus
        }
        console.log('Data', data);
        try {
          const response = this.formtype2 === 'add' ? await apiService.postPosition(data) :  await apiService.updatePosition(data);
          console.log('Response:', response.data);
          this.showPosDialog = false;
          if(this.formtype2 == 'add'){
            Swal.fire({
              title: 'Success!',
              text: 'Add data succes',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          } else {
            Swal.fire({
              title: 'Success!',
              text: 'Update data succes',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          }
          this.fetchPositions();
        } catch (error) {
          console.error('Error:', error);
        }
      },
      
      async addDesc() {
        const data = this.formtype3 == 'add'? {
        DescriptionEN: this.jobDescEN,
        DescriptionTH: this.jobDescTH,
        PositionID: this.posID
        } : {    
        DescriptionID: this.selectID3,
        DescriptionEN: this.jobDescEN,
        DescriptionTH: this.jobDescTH,
        PositionID: this.posID
        }
        console.log('Data', data);
        try {
          const response = this.formtype3 === 'add' ? await apiService.postDescription(data) :  await apiService.updateDescription(data);
          console.log('Response:', response.data);
          this.showDescDialog = false;
          if(this.formtype3 == 'add'){
            Swal.fire({
              title: 'Success!',
              text: 'Add data succes',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          } else {
            Swal.fire({
              title: 'Success!',
              text: 'Update data succes',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          }
          this.fetchDescriptions();
        } catch (error) {
          console.error('Error:', error);
        }
      },

      async addQua() {
        const data = this.formtype4 == 'add'? {
        QualificationsEN: this.quaEN,
        QualificationsTH: this.quaTH,
        PositionID: this.posID
        } : {    
        PositionID: this.posID,
        QualificationsID: this.selectID4,
        QualificationsEN: this.quaEN,
        QualificationsTH: this.quaTH
        }
        console.log('Data', data);
        try {
          const response = this.formtype4 === 'add' ? await apiService.postQualification(data) :  await apiService.updateQualification(data);
          console.log('Response:', response.data);
          this.showQuaDialog = false;
          if(this.formtype4 == 'add'){
            Swal.fire({
              title: 'Success!',
              text: 'Add data succes',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          } else {
            Swal.fire({
              title: 'Success!',
              text: 'Update data succes',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          }
          this.fetchQualifications();
        } catch (error) {
          console.error('Error:', error);
        }
      },

      async deleteDep(departmentId) {
        Swal.fire({
          title: 'Are you sure you want to delete this item ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmDeleteDepartment(departmentId);
          }
        });
      },
      async confirmDeleteDepartment(departmentId) {
        const id = { departmentID: departmentId };
        console.log('id', id);
        try {
          const response = await apiService.deleteDepartment(id);
          if (response.data.statusCode === 200) {
            Swal.fire({
              title: 'Success!',
              text: response.data.message,
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
            this.fetchDepartments();
          } else if (response.data.statusCode === 409) {
            Swal.fire({
              title: 'Error!',
              text: response.data.message,
              icon: 'error',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          }
        } catch (error) {
          console.error('Error:', error);
          this.delDepMessage = 'An unexpected error occurred.';
          this.DelDepDialog = true;
        }
      },

      async deletePos(positionId) {
        Swal.fire({
          title: 'Are you sure you want to delete this item ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmDeletePosition(positionId);
          }
        });
      },
      async confirmDeletePosition(positionId) {
        const id = { positionID: positionId };
        try {
          const response = await apiService.deletePosition(id);
          if (response.data.statusCode === 200) {
            Swal.fire({
              title: 'Success!',
              text: response.data.message,
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
            this.fetchPositions();
          } else if (response.data.statusCode === 409) {
            Swal.fire({
              title: 'Error!',
              text: response.data.message,
              icon: 'error',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          }
        } catch (error) {
          console.error('Error:', error);
          this.delPosMessage = 'An unexpected error occurred.';
          this.DelPosDialog = true;
        }
      },

      async deleteDesc(descriptionId) {
        Swal.fire({
          title: 'Are you sure you want to delete this item ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmDeleteDesc(descriptionId);
          }
        });
      },
      async confirmDeleteDesc(descriptionId) {
        const id = { descriptionID : descriptionId };
        try {
          const response = await apiService.deleteDescription(id);
          console.log('Deleted successfully', response.data);
          Swal.fire({
              title: 'Success!',
              text: 'Delete Successful!',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          this.fetchDescriptions();
        } catch (error) {
          console.error('Error:', error);
        }
      },

      async deleteQua(qualifiactionId) {
        Swal.fire({
          title: 'Are you sure you want to delete this item ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmDeleteQua(qualifiactionId);
          }
        });
      },
      async confirmDeleteQua(qualifiactionId) {
        const id = { QualificationsID : qualifiactionId};
        try {
          const response = await apiService.deleteQualification(id);
          console.log('Deleted successfully', response.data);
          this.showQuaDailog = false;
          Swal.fire({
              title: 'Success!',
              text: 'Delete Successful!',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });
          this.fetchQualifications();
        } catch (error) {
          console.error('Error:', error);
        }
      },
    }
  };
</script>
  
<style scoped>
.job-item {
  padding: 20px;
  color: black;
}

.filter-select {
  padding-right: 10px;
  padding-left: 10px;
  border-right: 1.5px solid #abacad; /* Adjust the color and width as needed */
  border-left: 1.5px solid #abacad;
}

.filter-select2 {
  padding-right: 10px;
  padding-left: 10px;
  border-right: 1.5px solid #abacad; /* Adjust the color and width as needed */
}

.section {
  padding-bottom: 10px;
}

.custom-label{
  padding-bottom: 10px;
  font-size: 17px;
}

.v-card {
  font-size: 18px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25em 0.5em;
  border-radius: 20px;
  font-weight: 500;
  width: fit-content;
}
.status-badge.active {
  background-color: #d1f5d1;
  color: #1fac24;
}
.status-badge.inactive {
  background-color: #fad3ce;
  color: #f5372a;
}
</style>