<template>
  <div style="padding: 0px 20px 0px 20px;">
    <div class="section">
      <!-- Button to show table -->
      <v-btn @click="showTable = 1, fetchDepartments()" color="#007fc4" dark class="mb-2">
        Table Department
      </v-btn>
      <v-btn @click="showTable = 2, filterDepartment = 'All Department', fetchPositions()" color="#007fc4" dark class="mb-2">
        Table Position
      </v-btn>
      <v-btn @click="showTable = 3, filterPositionDesc = 'All Position', fetchDescriptions()" color="#007fc4" dark class="mb-2">
        Table Description
      </v-btn>
      <v-btn @click="showTable = 4, filterPositionQua = 'All Position', fetchQualifications()" color="#007fc4" dark class="mb-2">
        Table Qualification
      </v-btn>
    </div>

    <!-- Form Add Department -->
    <v-dialog v-model="showDepDialog" persistent  width="50%">
      <v-card style="padding-bottom: 10px;">
        <v-card-title style="font-weight: bold;">
          <v-icon left>home</v-icon>{{ formtype1 === 'add' ? 'Add New Department' : 'Update Department' }}
        </v-card-title>
        <v-form ref="form" style="padding: 10px 20px 10px 20px;">
          <label class="custom-label">Department EN</label>
          <v-text-field v-model="descEN" outline single-line placeholder="EN" @keydown.native="keyFilter($event, 'Group')" background-color="#64B5F6"></v-text-field>
          <label class="custom-label">Department TH</label>
          <v-text-field v-model="descTH" outline single-line placeholder="TH" @keydown.native="keyFilter($event, 'GroupTh')" background-color="#64B5F6"></v-text-field>
          <label class="custom-label">Status</label>
          <v-select v-model="descStatus" :items="statusList" label="Select Status" outline single-line background-color="#64B5F6"></v-select>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" dark @click="validateDepartment">Submit</v-btn>
          <v-btn color="yellow darken-3" dark @click="showDepDialog = false">Close</v-btn>
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
              <v-icon color="yellow darken-2" @click="showDepAdd('edit', props)">mdi-pencil</v-icon>
              <v-icon color="red" @click="deleteDep(props.item.departmentID)">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Form Add Position -->
    <v-dialog v-model="showPosDialog" persistent width="50%">
      <v-card style="padding-bottom: 10px;">
        <v-card-title style="font-weight: bold;">
          <v-icon left>home</v-icon>{{ formtype2 === 'add' ? 'Add New Position' : 'Update Position' }}
        </v-card-title>
        <v-form ref="form" style="padding: 10px 20px 10px 20px;">
          <label class="custom-label">Position Name</label>
          <v-text-field v-model="posName" type="text" placeholder="EN" outline single-line @keydown.native="keyFilter($event, 'Group')" background-color="#64B5F6"></v-text-field>
          <label class="custom-label">Department Name</label>
          <v-autocomplete v-model="depID" :items="departments" item-text="department_DescEN" item-value="departmentID" label="Select Department" outline single-line background-color="#64B5F6"></v-autocomplete>
          <v-layout>
            <v-flex style="padding-right: 10px;">
              <label class="custom-label">JD Name</label>
              <v-autocomplete v-model="posJD" :items="selectJD" item-text="jD_Name" item-value="descriptionID" label="Select Description" outline single-line background-color="#64B5F6"></v-autocomplete>
            </v-flex>
            <v-flex style="padding-left: 10px;">
              <label class="custom-label">JQ Name</label>
              <v-autocomplete v-model="posJQ" :items="selectJQ" item-text="jQ_Name" item-value="qualificationID" label="Select Qualification" outline single-line background-color="#64B5F6"></v-autocomplete>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex style="padding-right: 10px;">
              <label class="custom-label">Status</label>
              <v-select v-model="posStatus" :items="statusList" label="Select Status" outline single-line background-color="#64B5F6"></v-select>
            </v-flex>
            <v-flex style="padding-left: 10px;">
              <label class="custom-label">Priority</label>
              <v-select v-model="posPriority" :items="priorityList" label="Select Priority" outline single-line background-color="#64B5F6"></v-select>
            </v-flex>
          </v-layout>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" dark @click="validatePosition">Submit</v-btn>
          <v-btn color="yellow darken-3" dark @click="showPosDialog = false">Close</v-btn>
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
        <v-btn color="#007fc4" dark @click="setPositionModel('add')">ADD</v-btn>
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
            <td>{{ props.item.jD_Name }}</td>
            <td>{{ props.item.jQ_Name }}</td>
            <td>
              <div :class="['status-badge', props.item.status.toLowerCase()]">
                {{ props.item.status }}
              </div>
            </td>
            <td>
              <div :class="['priority-badge', props.item.priority.toLowerCase()]">
                {{ props.item.priority }}
              </div>
            </td>
            <td>
              <v-icon color="yellow darken-2" @click="setPositionModel('edit', props)">mdi-pencil</v-icon>
              <v-icon color="red" @click="deletePos(props.item.positionID)">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

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
        <!-- <v-flex md3 xl3 lg3 class="filter-select2">
        <v-autocomplete outlined v-model="filterPositionDesc" :items="['All Position', ...descPositionList]" dense label="Filter Position" return-object hide-details></v-autocomplete>
        </v-flex> -->
        <v-btn color="#007fc4" dark @click="setDescModel('add')">ADD</v-btn>
      </v-card-title>
      <v-data-table
      :headers="headersDesc"
      :search="searchDesc"
      :items="descRawData"
      >
        <template v-slot:items="props">
          <tr>
            <td class="text-left">{{ props.item.descriptionID }}</td>
            <td class="text-left">{{ props.item.jD_Name }}</td>
            <td class="text-left">{{ props.item.department_DescEN }}</td>
            <td class="text-left">
            <v-icon color="yellow darken-2" @click="fetchDescriptionsDetail(props.item.descriptionID), setDescModel('edit', props)">mdi-pencil</v-icon>
            <v-icon color="red" @click="deleteDesc(props.item.descriptionID)">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <!-- New Description -->
    <v-dialog v-model="descDetailTable" persistent width="75%">
      <v-card style="padding: 15px;">
        <v-card-tile style="display: flex; align-items: center; justify-content: space-between; padding: 0px 0px 15px 15px;">
          <v-flex style="display: flex; align-items: center; font-weight: bold;">
            <v-icon style="padding-right: 10px;">home</v-icon>{{ formtype3 === 'add' ? 'Add New Description' : 'Update Description' }}
          </v-flex>
          <v-icon size="30" color="red" @click="descDetailTable = false">mdi-close-box</v-icon>
        </v-card-tile>

        <v-form ref="form" style="padding: 10px 10px 10px 10px;">
          <v-layout>
            <v-flex style="padding-right: 10px;">
              <label class="custom-label">JD Name</label>
              <v-text-field v-model="jobDescName" type="text" placeholder="EN" outline single-line @keydown.native="keyFilter($event, 'Group')" background-color="#64B5F6"></v-text-field>
            </v-flex>
            <v-flex style="padding-left: 10px;">
              <label class="custom-label">Department</label>
              <v-autocomplete v-model="depDescID" :items="departments" item-text="department_DescEN" item-value="departmentID" label="Select Department" outlined outline single-line background-color="#64B5F6"></v-autocomplete>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex style="padding-right: 10px;">
              <label class="custom-label">Description EN</label>
              <v-textarea rows="1" v-model="jobDescEN" type="text" placeholder="EN" outline single-line @keydown.native="keyFilter($event, 'Group')" background-color="#64B5F6"></v-textarea>
            </v-flex>
            <v-flex style="padding-left: 10px;">
              <label class="custom-label">Description TH</label>
              <v-textarea rows="1" v-model="jobDescTH" type="text" placeholder="TH" outline single-line @keydown.native="keyFilter($event, 'GroupTh')" background-color="#64B5F6"></v-textarea>
            </v-flex>
            <div style="display:flex; align-items: center; padding-left: 5px;">
              <v-btn fab dark color="cyan" @click="validateDescItemEdit" v-if="descItemButton == 'old'"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn fab dark color="cyan" @click="validateDescItemAdd" v-if="descItemButton == 'new'"><v-icon>mdi-plus</v-icon></v-btn>
            </div>
          </v-layout>
        </v-form>
        
        <v-data-table
        :headers="headersDescDetail"
        :items="descDetailData"
        >
          <template v-slot:items="props">
            <tr>
              <td class="text-left">{{ props.item.descriptionNo }}</td>
              <td class="text-left">{{ props.item.descriptionEN }}</td>
              <td class="text-left">{{ props.item.descriptionTH }}</td>
              <td class="text-left">
              <v-icon color="yellow darken-2" @click="setItemDescModel(props)">mdi-pencil</v-icon>
              <v-icon color="red" @click="deleteItemDescription(props.index)">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" dark @click="validateDescription()">Submit</v-btn>
          <v-btn color="yellow darken-3" dark @click="descDetailTable = false">Close</v-btn>
        </v-card-actions>
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
        <!-- <v-flex md3 xl3 lg3 class="filter-select2">
          <v-autocomplete outlined v-model="filterPositionQua" :items="['All Position', ...quaPositionList]" dense label="Filter Position" return-object hide-details></v-autocomplete>
        </v-flex> -->
        <v-btn color="#007fc4" dark @click="setQuaModel('add')">ADD</v-btn>
      </v-card-title>
      <v-data-table
      :headers="headersQua"
      :search="searchQua"
      :items="quaRawData"
      >
        <template v-slot:items="props">
          <tr>
            <td class="text-left">{{ props.item.qualificationID }}</td>
            <td class="text-left">{{ props.item.jQ_Name }}</td>
            <td class="text-left">{{ props.item.department_DescEN }}</td>
            <td class="text-left">
            <v-icon color="yellow darken-2" @click="fetchQualificationsDetail(props.item.qualificationID), setQuaModel('edit', props)">mdi-pencil</v-icon>
            <v-icon color="red" @click="deleteQua(props.item.qualificationID)">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <!-- New Qualification -->
    <v-dialog v-model="quaDetailTable" persistent width="75%">
      <v-card style="padding: 15px;">
        <v-card-tile style="display: flex; align-items: center; justify-content: space-between; padding: 0px 0px 15px 15px;">
          <v-flex style="display: flex; align-items: center; font-weight: bold;">
            <v-icon style="padding-right: 10px;">home</v-icon>{{ formtype4 === 'add' ? 'Add New Qualification' : 'Update Qualification' }}
          </v-flex>
          <v-icon size="30" color="red" @click="quaDetailTable = false">mdi-close-box</v-icon>
        </v-card-tile>

        <v-form ref="form" style="padding: 10px 20px 10px 20px;">
          <v-layout>
            <v-flex style="padding-right: 10px;">
              <label class="custom-label">JQ Name</label>
              <v-text-field v-model="jobQuaName" type="text" placeholder="EN" outline single-line @keydown.native="keyFilter($event, 'Group')" background-color="#64B5F6"></v-text-field>
            </v-flex>
            <v-flex style="padding-left: 10px;">
              <label class="custom-label" >Department</label>
              <v-autocomplete v-model="depQuaID" :items="departments" item-text="department_DescEN" item-value="departmentID" label="Select Department" outlined outline single-line background-color="#64B5F6"></v-autocomplete>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex style="padding-right: 10px;" >
              <label class="custom-label">Qualification EN</label>
              <v-textarea rows="1" v-model="jobQuaEN" type="text" placeholder="EN" outline single-line @keydown.native="keyFilter($event, 'Group')" background-color="#64B5F6"></v-textarea>
            </v-flex>
            <v-flex style="padding-left: 10px;">
              <label class="custom-label">Qualification TH</label>
              <v-textarea rows="1" v-model="jobQuaTH" type="text" placeholder="TH" outline single-line @keydown.native="keyFilter($event, 'GroupTh')" background-color="#64B5F6"></v-textarea>
            </v-flex>
            <div style="display:flex; align-items: center; padding-left: 5px;">
              <v-btn fab dark color="cyan" @click="validateQuaItemEdit" v-if="quaItemButton == 'old'"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn fab dark color="cyan" @click="validateQuaItemAdd" v-if="quaItemButton == 'new'"><v-icon>mdi-plus</v-icon></v-btn>
            </div>
          </v-layout>
        </v-form>
        
        <v-data-table
        :headers="headersQuaDetail"
        :items="quaDetailData"
        >
          <template v-slot:items="props">
            <tr>
              <td class="text-left">{{ props.item.qualificationNo }}</td>
              <td class="text-left">{{ props.item.qualificationEN }}</td>
              <td class="text-left">{{ props.item.qualificationTH }}</td>
              <td class="text-left">
              <v-icon color="yellow darken-2" @click="setItemQuaModel(props)">mdi-pencil</v-icon>
              <v-icon color="red" @click="deleteItemQualification(index)">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" dark @click="validateQualification()">Submit</v-btn>
          <v-btn color="yellow darken-3" dark @click="quaDetailTable = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


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
        descDetailData: [],
        quaRawData: [],
        quaDetailData: [],
        departmentList: [], 
        descPositionList: [], //ปิด
        quaPositionList: [], //ปิด
        descEN: '',
        descTH: '',
        descStatus: '',
        posStatus: '',
        posPriority: '',
        statusList: ['ACTIVE', 'INACTIVE'],
        priorityList: ['URGENT', 'NORMAL'],
        posName: '',
        depID: '',
        posID: '',
        posJD: '',
        posJQ: '',
        jobDescName: '',
        jobQuaName: '',
        depDescID: '',
        depQuaID: '',
        jobDescEN: '',
        jobDescTH: '',
        jobQuaEN: '',
        jobQuaTH: '',
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
          { text: 'JD', value: 'descriptionID' },
          { text: 'JQ', value: 'qualificationID' },
          { text: 'Status', value: 'status' },
          { text: 'Priority', value: 'priority' },
          { text: 'Action', sortable: false}
        ],
        headersDesc: [
          { text: 'ID', value: 'descriptionID' },
          { text: 'Name', value: 'jD_Name' },
          { text: 'Department', value: 'department_DescEN' },
          { text: 'Action', sortable: false}
        ],
        headersDescDetail: [
          { text: 'No', value: 'descriptionNo' },
          { text: 'EN', value: 'descriptionEN' },
          { text: 'TH', value: 'descriptionTH' },
          { text: 'Action', sortable: false}
        ],
        headersQua: [
          { text: 'ID', value: 'qualificationID' },
          { text: 'Name', value: 'jQ_Name' },
          { text: 'Department', value: 'department_DescEN' },
          { text: 'Action', sortable: false}
        ],
        headersQuaDetail: [
          { text: 'No', value: 'qualificationNo' },
          { text: 'EN', value: 'qualificationEN' },
          { text: 'TH', value: 'qualificationTH' },
          { text: 'Action', sortable: false}
        ],
        snackbar: false,
        snackbarMessage: '',
        keyFilter,
        searchDep: '',
        searchPos: '',
        searchDesc: '',
        searchQua: '',
        descDetailTable: false,
        quaDetailTable: false,
        descItemButton: 'new',
        quaItemButton: 'new',
        selectIndex: null,
        selectJD: [],
        selectJQ: []
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
        immediate: true
      },
      depID: {
        handler: 'combinedFilter',
        immediate: true
      },
      // filterPositionDesc: {
      //   handler: 'filterPositions',
      //   immediate: true
      // },
      // filterPositionQua: {
      //   handler: 'filterQualifications',
      //   immediate: true
      // }
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

      filterJDs() { 
        this.selectJD = this.descRawData.filter((description) =>
          description.departmentID == this.depID
        );
      },
      filterJQs() { 
        this.selectJQ = this.quaRawData.filter((qualification) =>
          qualification.departmentID == this.depID
        );
      },
      combinedFilter() {
        this.filterJDs();
        this.filterJQs();
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

      async setPositionModel(type, data){
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
          this.posPriority = '';
          this.posPriority = data.item.priority;
          this.posJD = '';
          this.posJD = data.item.descriptionID;
          this.posJQ = '';
          this.posJQ = data.item.qualificationID;
        }
        else{
          this.showPosDialog = true;
          this.formtype2 = type;
          this.posName = '';
          this.depID = '';
          this.posStatus = '';
          this.posPriority = '';
          this.posJD = '';
          this.posJQ = '';
          this.selectJD = this.descRawData;
          this.selectJQ = this.quaRawData;
        }
      },

      async setDescModel(type, data){
        if(type == 'edit'){
          this.descDetailTable = true;
          this.descItemButton = 'new';
          this.formtype3 = type;
          this.selectID3 = data.item.descriptionID;
          this.jobDescName = '';
          this.jobDescName = data.item.jD_Name
          this.depDescID = '';
          this.depDescID = data.item.departmentID
          this.jobDescEN = '';
          this.jobDescEN = data.item.descriptionEN;
          this.jobDescTH = '';
          this.jobDescTH = data.item.descriptionTH;
        }
        else{
          this.descDetailTable = true;
          this.descItemButton = 'new';
          this.formtype3 = type;
          this.selectID3 = '';
          this.jobDescName = '';
          this.depDescID = '';
          this.jobDescEN = '';
          this.jobDescTH = '';
          this.descDetailData = [];
        }
      },
      async setItemDescModel(data){
          this.descItemButton = 'old';
          this.editingIndex = data.item.descriptionNo - 1;
          this.jobDescEN = '';
          this.jobDescEN = data.item.descriptionEN;
          this.jobDescTH = '';
          this.jobDescTH = data.item.descriptionTH;
      },

      addItemDescription() {
        const itemDescription = {
          descriptionNo: this.descDetailData.length + 1,
          descriptionEN: this.jobDescEN,
          descriptionTH: this.jobDescTH,
        };
        this.descDetailData.push(itemDescription);
        this.jobDescEN = "";
        this.jobDescTH = "";
      },
      editItemDescription() {
        this.descDetailData[this.editingIndex].descriptionEN = this.jobDescEN;
        this.descDetailData[this.editingIndex].descriptionTH = this.jobDescTH;
        this.editingIndex = null;
        this.jobDescEN = "";
        this.jobDescTH = "";
        this.descItemButton = 'new';
      },
      // async deleteItemDescription(index) {
      //   Swal.fire({
      //     title: 'Are you sure you want to delete this item ?',
      //     text: "You won't be able to revert this!",
      //     icon: 'warning',
      //     showCancelButton: true,
      //     confirmButtonColor: '#3085d6',
      //     cancelButtonColor: '#d33',
      //     confirmButtonText: 'Yes, delete it!',
      //     allowOutsideClick: false,
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       this.confirmDeleteItemDescription(index);
      //     }
      //   });
      // },
      deleteItemDescription(index) {
        this.descDetailData.splice(index, 1);
        this.descDetailData.forEach((item, i) => {
          item.descriptionNo = i + 1;
        });
      },

      async setQuaModel(type, data){
        if(type == 'edit'){
          this.quaDetailTable = true;
          this.quaItemButton = 'new';
          this.formtype4 = type;
          this.selectID4 = data.item.qualificationID;
          this.jobQuaName = '';
          this.jobQuaName = data.item.jQ_Name
          this.depQuaID = '';
          this.depQuaID = data.item.departmentID
          this.jobQuaEN = '';
          this.jobQuaEN = data.item.qualificationEN;
          this.jobQuaTH = '';
          this.jobQuaTH = data.item.qualificationTH;
        }
        else{
          this.quaItemButton = 'new';
          this.quaDetailTable = true;
          this.formtype4 = type;
          this.selectID4 = '';
          this.jobQuaName = '';
          this.depQuaID = '';
          this.jobQuaEN = '';
          this.jobQuaTH = '';
          this.quaDetailData = [];
        }
      },
      async setItemQuaModel(data){
          this.quaItemButton = 'old';
          this.editingIndex2 = data.item.qualificationNo - 1;
          this.jobQuaEN = '';
          this.jobQuaEN = data.item.qualificationEN;
          this.jobQuaTH = '';
          this.jobQuaTH = data.item.qualificationTH;
      },

      addItemQualification() {
        const itemQualification = {
          qualificationNo: this.quaDetailData.length + 1,
          qualificationEN: this.jobQuaEN,
          qualificationTH: this.jobQuaTH,
        };
        this.quaDetailData.push(itemQualification);
        this.jobQuaEN = "";
        this.jobQuaTH = "";
      },
      editItemQualification() {
        this.quaDetailData[this.editingIndex2].qualificationEN = this.jobQuaEN;
        this.quaDetailData[this.editingIndex2].qualificationTH = this.jobQuaTH;
        this.editingIndex2 = null;
        this.jobQuaEN = "";
        this.jobQuaTH = "";
        this.quaItemButton = 'new';
      },
      async deleteItemQualification(index) {
        Swal.fire({
          title: 'Are you sure you want to delete this item ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmDeleteItemQualification(index);
          }
        });
      },
      confirmDeleteItemQualification(index) {
        this.quaDetailData.splice(index, 1);
        this.quaDetailData.forEach((item, i) => {
          item.qualificationNo = i + 1;
        });
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
          // this.descPositionList = this.descRawData
          // .map(item => item.position_Name)
          // .filter((value, index, self) => self.indexOf(value) === index);
          // this.filterPositions();
        } catch (error) {
          console.error(error);
        }
      },
      async fetchDescriptionsDetail(headID) {
        this.descDetailTable = true;
        try {
          const response = await apiService.getDescriptionDetail(headID);
          this.descDetailData = response.data;
        } catch (error) {
          console.error(error);
        }
      },

      async fetchQualifications() {
        try {
          const response = await apiService.getQualification();
          this.quaRawData = response.data;
          // this.quaPositionList = this.quaRawData
          // .map(item => item.position_Name)
          // .filter((value, index, self) => self.indexOf(value) === index);
          // this.filterQualifications();
        } catch (error) {
          console.error(error);
        }
      },
      async fetchQualificationsDetail(headID) {
        this.quaDetailTable = true;
        try {
          const response = await apiService.getQualificationDetail(headID);
          this.quaDetailData = response.data;
        } catch (error) {
          console.error(error);
        }
      },

      validateDepartment() {
        if (isEmpty(this.descEN) || isEmpty(this.descTH) || isEmpty(this.descStatus)) {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill your information completely.';
        } else {
          this.addDep();
        }
      },

      validatePosition() {
        if (isEmpty(this.posName) || this.depID == '' || isEmpty(this.posStatus) || isEmpty(this.posPriority) || isEmpty(this.posJD) || isEmpty(this.posJQ)) {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill your information completely.';
        } else {
          this.addPos();
        }
      },

      validateDescription() {
        if (isEmpty(this.jobDescName) || this.depDescID == '' || isEmpty(this.descDetailData) ) {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill your information completely.';
        } else {
          this.addDesc();
        }
      },
      validateDescItemAdd() {
        if (isEmpty(this.jobDescEN) && isEmpty(this.jobDescTH)) {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill your information completely.';
        } else {
          this.addItemDescription();
        }
      },
      validateDescItemEdit() {
        if (isEmpty(this.jobDescEN) && isEmpty(this.jobDescTH)) {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill in description.';
        } else {
          this.editItemDescription();
        }
      },

      validateQualification() {
        if (isEmpty(this.jobQuaName) || this.depQuaID == '' || isEmpty(this.quaDetailData) ) {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill your information completely.';
        } else {
          this.addQua();
        }
      },
      validateQuaItemAdd() {
        if (isEmpty(this.jobQuaEN) && isEmpty(this.jobQuaTH)) {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill in qualification.';
        } else {
          this.addItemQualification();
        }
      },
      validateQuaItemEdit() {
        if (isEmpty(this.jobQuaEN) && isEmpty(this.jobQuaTH)) {
          this.snackbar = true;
          this.snackbarMessage = 'Please fill in qualification.';
        } else {
          this.editItemQualification();
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
        Status: this.posStatus,
        Priority: this.posPriority,
        DescriptionID: this.posJD,
        QualificationID: this.posJQ
        } : {        
        PositionID: this.selectID2,
        Position_Name: this.posName,
        DepartmentID: this.depID,
        Status: this.posStatus,
        Priority: this.posPriority,
        DescriptionID: this.posJD,
        QualificationID: this.posJQ
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
        Swal.fire({
          title: this.formtype3 == 'add' ? 'Are you sure you want to add this item?' : 'Are you sure you want to update this item?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmAddDesc();
          }
        });
      },
      async confirmAddDesc() {
        const data = {
          descriptionID: this.selectID3,
          jD_Name: this.jobDescName,
          departmentID: this.depDescID,
          detail: this.descDetailData
        };
        console.log('Data', data);
        try {
          const response = await apiService.postDescription(data);
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
          this.descDetailTable = false;
          this.fetchDescriptions();
        } catch (error) {
          console.error('Error:', error);
        }
      },

      async addQua() {
        Swal.fire({
          title: this.formtype4 == 'add' ? 'Are you sure you want to add this item?' : 'Are you sure you want to update this item?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmAddQua();
          }
        });
      },
      async confirmAddQua() {
        const data = {
          qualificationID: this.selectID4,
          jQ_Name: this.jobQuaName,
          departmentID: this.depQuaID,
          detail: this.quaDetailData
        };
        console.log('Data', data);
        try {
          const response = await apiService.postQualification(data);
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
          this.quaDetailTable = false;
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
          confirmButtonText: 'Yes, delete it!',
          allowOutsideClick: false,
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
          confirmButtonText: 'Yes, delete it!',
          allowOutsideClick: false,
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
          allowOutsideClick: false,
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

      async deleteQua(qualificationId) {
        Swal.fire({
          title: 'Are you sure you want to delete this item ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.confirmDeleteQua(qualificationId);
          }
        });
      },
      async confirmDeleteQua(qualificationId) {
        const id = { QualificationID : qualificationId};
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
  border-right: 1.5px solid #abacad;
  border-left: 1.5px solid #abacad;
}

.filter-select2 {
  padding-right: 10px;
  padding-left: 10px;
  border-right: 1.5px solid #abacad;
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

.priority-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25em 0.5em;
  border-radius: 20px;
  font-weight: 500;
  width: fit-content;
}
.priority-badge.normal {
  background-color: #96d6f3;
  color: #0f4ba7;
}
.priority-badge.urgent {
  background-color: #fad3ce;
  color: #f5372a;
}
</style>