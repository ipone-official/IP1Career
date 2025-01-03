<template>
  <div class="px-3 pb-3">
    <v-toolbar color="#f8c849" dark tabs>
      <v-tabs v-model="mTab" color="#f8c849" grow slider-color="white">
        <v-tab v-for="item in mainItems" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="mTab">
      <v-tab-item v-for="(item, index) in mainItems" :key="index">
        <div v-if="item === 'Department'">
          <v-card>
            <v-card-title>
              <span class="item-title"> Department</span>
              <v-spacer></v-spacer>
              <v-flex sm6 md4 lg4 xl3 class="filter-select">
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
                  <td>{{ props.item.departmentID }}</td>
                  <td>{{ props.item.department_DescEN }}</td>
                  <td>{{ props.item.department_DescTH }}</td>
                  <td>
                    <div
                      :class="['status-badge', props.item.status.toLowerCase()]"
                    >
                      {{ props.item.status }}
                    </div>
                  </td>
                  <td v-if="userRole != 'CANT'">
                    <v-icon
                      class="custom-icon"
                      size="18"
                      color="white"
                      @click="showDepAdd('edit', props)"
                      >mdi-pencil</v-icon
                    >
                    <v-icon
                      class="custom-icon-delete"
                      size="18"
                      color="white"
                      @click="deleteDep(props.item.departmentID)"
                      >mdi-delete</v-icon
                    >
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </div>

        <div v-else-if="item === 'Position'">
          <v-card>
            <v-card-title>
              <span class="item-title"> Position </span>
              <v-spacer></v-spacer>
              <v-flex md3 xl3 lg3 class="filter-search-position">
                <v-text-field
                  v-model="searchPos"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-flex>
              <v-flex md3 xl3 lg3 class="filter-department">
                <v-autocomplete
                  outlined
                  v-model="filterDepartment"
                  :items="['All Department', ...departmentList]"
                  dense
                  label="Filter Department"
                  return-object
                  hide-details
                ></v-autocomplete>
              </v-flex>
              <v-btn color="#007fc4" dark @click="setPositionModel('add')"
                >ADD</v-btn
              >
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
                    <div
                      :class="['status-badge', props.item.status.toLowerCase()]"
                    >
                      {{ props.item.status }}
                    </div>
                  </td>
                  <td>
                    <div
                      :class="[
                        'priority-badge',
                        props.item.priority.toLowerCase(),
                      ]"
                    >
                      {{ props.item.priority }}
                    </div>
                  </td>
                  <td v-if="userRole != 'CANT'">
                    <v-icon
                      class="custom-icon"
                      size="18"
                      color="white"
                      @click="setPositionModel('edit', props)"
                      >mdi-pencil</v-icon
                    >
                    <v-icon
                      class="custom-icon-delete"
                      size="18"
                      color="white"
                      @click="
                        deletePos(
                          props.item.positionID,
                          props.item.position_Name
                        )
                      "
                      >mdi-delete</v-icon
                    >
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </div>
      </v-tab-item>
    </v-tabs-items>

    <!-- Form Add Department -->
    <v-dialog v-model="showDepDialog" persistent width="60%">
      <v-card style="padding-bottom: 10px">
        <v-card-title class="light-blue darken-3 white--text">
          <v-icon color="white" style="padding-right: 5px"
            >mdi-office-building</v-icon
          >{{
            formtype1 === "add" ? "Add New Department" : "Update Department"
          }}
        </v-card-title>
        <v-form ref="form" style="padding: 20px 30px 0px 30px">
          <v-layout wrap>
            <v-flex xl3 lg3 md3 sm4 xs12 d-flex align-center>
              <label class="custom-label">Department Name (EN)</label>
            </v-flex>
            <v-flex xl9 lg9 md9 sm8>
              <v-text-field
                v-model="descEN"
                label="EN"
                @keydown.native="keyFilter($event, 'Group')"
                prepend-inner-icon="mdi-office-building-plus"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xl3 lg3 md3 sm4 xs12 d-flex align-center>
              <label class="custom-label">Department Name (TH)</label>
            </v-flex>
            <v-flex xl9 lg9 md9 sm8>
              <v-text-field
                v-model="descTH"
                label="TH"
                @keydown.native="keyFilter($event, 'GroupTh')"
                prepend-inner-icon="mdi-office-building-plus"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xl3 lg3 md3 sm4 xs12 d-flex align-center>
              <label class="custom-label">Status</label>
            </v-flex>
            <v-flex xl9 lg9 md9 sm8>
              <v-select
                v-model="descStatus"
                :items="statusList"
                label="Select Status"
                prefix="*"
                class="prefix"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-form>
        <v-divider dark></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" dark @click="validateDepartment">Submit</v-btn>
          <v-btn color="#f8c849" @click="showDepDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Form Add Position -->
    <v-dialog v-model="showPosDialog" persistent width="75%">
      <v-card style="padding-bottom: 10px">
        <v-card-title
          style="
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <v-flex style="display: flex; align-items: center; font-weight: bold">
            <v-icon style="padding-right: 5px">mdi-briefcase</v-icon
            >{{ formtype2 === "add" ? "Add New Position" : "Update Position" }}
          </v-flex>
          <v-icon
            size="30"
            color="white"
            style="display: flex; justify-content: flex-end"
            @click="showPosDialog = false"
            >mdi-close-box</v-icon
          >
        </v-card-title>

        <v-toolbar color="#0882c8" dark tabs>
          <v-tabs v-model="tab" color="#0882c8" grow slider-color="white">
            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </v-toolbar>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(item, index) in items" :key="index">
            <v-card flat>
              <v-card-text>
                <div v-if="item === 'Position'" style="padding-top: 10px">
                  <v-layout wrap>
                    <v-flex xl2 lg2 md3 sm3 xs12 d-flex align-center>
                      <label class="custom-label">Position Name</label>
                    </v-flex>
                    <v-flex xl10 lg10 md9 sm9>
                      <v-text-field
                        v-model="posName"
                        type="text"
                        label="Position Name (EN)"
                        @keydown.native="keyFilter($event, 'Group')"
                        prepend-inner-icon="mdi-briefcase-plus"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout wrap>
                    <v-flex xl2 lg2 md3 sm3 xs12 d-flex align-center>
                      <label class="custom-label">Department Name</label>
                    </v-flex>
                    <v-flex xl10 lg10 md9 sm9>
                      <v-autocomplete
                        v-model="depID"
                        :items="departments"
                        item-text="department_DescEN"
                        item-value="departmentID"
                        label="Select Department"
                        prepend-inner-icon="mdi-office-building"
                      ></v-autocomplete>
                    </v-flex>
                  </v-layout>

                  <v-layout wrap>
                    <v-flex lg2 sm1 xs12 d-flex align-center>
                      <label class="custom-label">Status</label>
                    </v-flex>
                    <v-flex lg4 sm5 xs12>
                      <v-select
                        v-model="posStatus"
                        :items="statusList"
                        label="Select Status"
                        prefix="*"
                        class="prefix"
                      ></v-select>
                    </v-flex>
                    <v-flex lg2 sm2 xs12 class="custom-label-priority">
                      <label style="font-size: 15px">Priority</label>
                    </v-flex>
                    <v-flex lg4 sm4 xs12>
                      <v-select
                        v-model="posPriority"
                        :items="priorityList"
                        label="Select Priority"
                        prefix="*"
                        class="prefix"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </div>

                <div v-else-if="item === 'Description'">
                  <v-layout wrap>
                    <v-flex xl6 lg6 md6 sm6 xs12 class="padding-en">
                      <label class="custom-label-detail"
                        >Description (EN)</label
                      >
                      <v-textarea
                        rows="1"
                        v-model="jobDescEN"
                        type="text"
                        label="EN"
                        maxlength="255"
                        @keydown.native="keyFilter($event, 'Group')"
                        background-color="white"
                      ></v-textarea>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm6 xs12 class="padding-th">
                      <label class="custom-label-detail"
                        >Description (TH)</label
                      >
                      <v-textarea
                        rows="1"
                        v-model="jobDescTH"
                        type="text"
                        label="TH"
                        maxlength="255"
                        @keydown.native="keyFilter($event, 'GroupTh')"
                        background-color="white"
                      >
                        <template v-slot:append-outer>
                          <v-icon
                            @click="
                              descItemButton === 'old'
                                ? validateDescItemEdit()
                                : validateDescItemAdd()
                            "
                            :size="35"
                            color="#fbc02d"
                          >
                            {{
                              descItemButton === "old"
                                ? "mdi-pencil-circle"
                                : "mdi-plus-circle"
                            }}
                          </v-icon>
                        </template>
                      </v-textarea>
                    </v-flex>
                  </v-layout>

                  <v-data-table
                    :headers="headersDescDetail"
                    :items="descDetailData"
                  >
                    <template v-slot:items="props">
                      <tr>
                        <td class="text-left">
                          {{ props.item.descriptionNo }}
                        </td>
                        <td class="text-left">
                          {{ props.item.descriptionEN }}
                        </td>
                        <td class="text-left">
                          {{ props.item.descriptionTH }}
                        </td>
                        <td class="text-left" style="width: 10rem">
                          <v-icon
                            class="custom-icon"
                            size="18"
                            color="white"
                            @click="setItemDescModel(props)"
                            >mdi-pencil</v-icon
                          >
                          <v-icon
                            class="custom-icon-delete"
                            size="18"
                            color="white"
                            @click="deleteItemDescription(props.index)"
                            >mdi-delete</v-icon
                          >
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </div>

                <div v-else-if="item === 'Qualification'">
                  <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm6 xs12>
                      <label class="custom-label-detail"
                        >Qualification (EN)</label
                      >
                      <v-textarea
                        rows="1"
                        v-model="jobQuaEN"
                        type="text"
                        label="EN"
                        maxlength="255"
                        @keydown.native="keyFilter($event, 'Group')"
                        background-color="white"
                      ></v-textarea>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm6 xs12>
                      <label class="custom-label-detail"
                        >Qualification (TH)</label
                      >
                      <v-textarea
                        rows="1"
                        v-model="jobQuaTH"
                        type="text"
                        label="TH"
                        maxlength="255"
                        @keydown.native="keyFilter($event, 'GroupTh')"
                        background-color="white"
                      >
                        <template v-slot:append-outer>
                          <v-icon
                            @click="
                              quaItemButton === 'old'
                                ? validateQuaItemEdit()
                                : validateQuaItemAdd()
                            "
                            :size="35"
                            color="#fbc02d"
                          >
                            {{
                              quaItemButton === "old"
                                ? "mdi-pencil-circle"
                                : "mdi-plus-circle"
                            }}
                          </v-icon>
                        </template>
                      </v-textarea>
                    </v-flex>
                  </v-layout>

                  <v-data-table
                    :headers="headersQuaDetail"
                    :items="quaDetailData"
                  >
                    <template v-slot:items="props">
                      <tr>
                        <td class="text-left">
                          {{ props.item.qualificationNo }}
                        </td>
                        <td class="text-left">
                          {{ props.item.qualificationEN }}
                        </td>
                        <td class="text-left">
                          {{ props.item.qualificationTH }}
                        </td>
                        <td class="text-left" style="width: 10rem">
                          <v-icon
                            class="custom-icon"
                            size="18"
                            color="white"
                            @click="setItemQuaModel(props)"
                            >mdi-pencil</v-icon
                          >
                          <v-icon
                            class="custom-icon-delete"
                            size="18"
                            color="white"
                            @click="deleteItemQualification(props.index)"
                            >mdi-delete</v-icon
                          >
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" dark @click="validatePosition">Submit</v-btn>
          <v-btn color="#f8c849" @click="showPosDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" color="amber darken-1">
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
import apiService from "@/services/apiService";
import { watch } from "vue";
import "bootstrap/dist/css/bootstrap.css";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      showDepDialog: false,
      showPosDialog: false,
      formtype1: "",
      formtype2: "",
      showTable: 1,
      selectID1: "",
      selectID2: "",
      departments: [],
      positions: [],
      descriptions: [],
      qualifications: [],
      filterDepartment: "All Department",
      posRawData: [],
      descDetailData: [],
      quaDetailData: [],
      departmentList: [],
      descEN: "",
      descTH: "",
      descStatus: "",
      posStatus: "",
      posPriority: "",
      statusList: ["ACTIVE", "INACTIVE"],
      priorityList: ["URGENT", "NORMAL"],
      posName: "",
      depID: "",
      posJD: "",
      posJQ: "",
      jobDescEN: "",
      jobDescTH: "",
      jobQuaEN: "",
      jobQuaTH: "",
      headersDep: [
        { text: "ID", value: "departmentID" },
        { text: "Department (EN)", value: "department_DescEN" },
        { text: "Department (TH)", value: "department_DescTH" },
        { text: "Status", value: "status" },
        { text: "Action", sortable: false },
      ],
      headersPos: [
        { text: "ID", value: "positionID" },
        { text: "Position", value: "position_Name" },
        { text: "Department", value: "department_DescEN" },
        { text: "Status", value: "status" },
        { text: "Priority", value: "priority" },
        { text: "Action", sortable: false },
      ],
      headersDesc: [
        { text: "ID", value: "descriptionID" },
        { text: "Name", value: "jD_Name" },
        { text: "Department", value: "department_DescEN" },
        { text: "Action", sortable: false },
      ],
      headersDescDetail: [
        { text: "No", value: "descriptionNo" },
        { text: "EN", value: "descriptionEN" },
        { text: "TH", value: "descriptionTH" },
        { text: "Action", sortable: false },
      ],
      headersQua: [
        { text: "ID", value: "qualificationID" },
        { text: "Name", value: "jQ_Name" },
        { text: "Department", value: "department_DescEN" },
        { text: "Action", sortable: false },
      ],
      headersQuaDetail: [
        { text: "No", value: "qualificationNo" },
        { text: "EN", value: "qualificationEN" },
        { text: "TH", value: "qualificationTH" },
        { text: "Action", sortable: false },
      ],
      snackbar: false,
      snackbarMessage: "",
      keyFilter,
      searchDep: "",
      searchPos: "",
      descItemButton: "new",
      quaItemButton: "new",
      selectIndex: null,
      items: ["Position", "Description", "Qualification"],
      mainItems: ["Department", "Position"],
      tab: null,
      mTab: null,
      userRole: '',
    };
  },

  computed: {
    ...sync("*"),
  },

  created() {
    this.fetchDepartments();
    this.fetchPositions();

    setTimeout(() => {
      this.checkRoleHeader();
    }, 500);
  },

  watch: {
    filterDepartment: {
      handler: "filterDepartments",
      immediate: true,
    },
    mTab(val) {
      if (val == 0) {
        this.fetchDepartments();
      } else {
        this.fetchPositions();
      }
    },
    tab(val) {
      if (val == 1) {
        this.jobDescEN = "";
        this.jobDescTH = "";
        this.descItemButton = "new";
      } else {
        this.jobQuaEN = "";
        this.jobQuaTH = "";
        this.quaItemButton = "new";
      }
    },
  },

  methods: {
    checkRoleHeader() {
      if (this.infoLogin.ADgroup.includes("User_Career")) {
        this.headersDep.pop();
        this.headersPos.pop();
        this.userRole = 'CANT';
      }
    },
    filterDepartments() { // filter ตาราง position โดยใช้ department
      if (this.filterDepartment === "All Department") {
        this.positions = this.posRawData;
      } else {
        this.positions = this.posRawData.filter(
          (position) => position.department_DescEN === this.filterDepartment
        );
      }
    },

    async showDepAdd(type, data) {
      if (type == "edit") {
        this.showDepDialog = true;
        this.formtype1 = type;
        this.selectID1 = data.item.departmentID;
        this.descEN = "";
        this.descEN = data.item.department_DescEN;
        this.descTH = "";
        this.descTH = data.item.department_DescTH;
        this.descStatus = "";
        this.descStatus = data.item.status;
      } else {
        this.showDepDialog = true;
        this.formtype1 = type;
        this.descEN = "";
        this.descTH = "";
        this.descStatus = "ACTIVE";
      }
    },

    async setPositionModel(type, data) {
      if (type == "edit") {
        this.showPosDialog = true;
        this.tab = 0;
        this.formtype2 = type;
        this.selectID2 = data.item.positionID;
        this.posName = "";
        this.posName = data.item.position_Name;
        this.depID = "";
        this.depID = data.item.departmentID;
        this.posStatus = "";
        this.posStatus = data.item.status;
        this.posPriority = "";
        this.posPriority = data.item.priority;
        this.posJD = "";
        this.posJD = data.item.descriptionID;
        this.posJQ = "";
        this.posJQ = data.item.qualificationID;
        this.fetchDescriptionsDetail(data.item.descriptionID);
        this.fetchQualificationsDetail(data.item.qualificationID);
        this.jobDescEN = "";
        this.jobDescTH = "";
        this.descItemButton = "new";
        this.jobQuaEN = "";
        this.jobQuaTH = "";
        this.quaItemButton = "new";
      } else {
        this.showPosDialog = true;
        this.tab = 0;
        this.formtype2 = type;
        this.selectID2 = "";
        this.posName = "";
        this.depID = "";
        this.posStatus = "ACTIVE";
        this.posPriority = "";
        this.posJD = "";
        this.posJQ = "";
        this.descDetailData = [];
        this.quaDetailData = [];
        this.jobDescEN = "";
        this.jobDescTH = "";
        this.descItemButton = "new";
        this.jobQuaEN = "";
        this.jobQuaTH = "";
        this.quaItemButton = "new";
      }
    },

    async setItemDescModel(data) {
      this.descItemButton = "old";
      this.editingIndex = data.item.descriptionNo - 1;
      this.jobDescEN = "";
      this.jobDescEN = data.item.descriptionEN;
      this.jobDescTH = "";
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
      this.descItemButton = "new";
    },
    async deleteItemDescription(index) {
      Swal.fire({
        title: "Are you sure you want to delete this item ?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmDeleteItemDescription(index);
        }
      });
    },
    confirmDeleteItemDescription(index) {
      this.descDetailData.splice(index, 1);
      this.descDetailData.forEach((item, i) => {
        item.descriptionNo = i + 1;
      });
      this.jobDescEN = "";
      this.jobDescTH = "";
      this.descItemButton = "new";
    },

    async setItemQuaModel(data) {
      this.quaItemButton = "old";
      this.editingIndex2 = data.item.qualificationNo - 1;
      this.jobQuaEN = "";
      this.jobQuaEN = data.item.qualificationEN;
      this.jobQuaTH = "";
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
      this.quaItemButton = "new";
    },
    async deleteItemQualification(index) {
      Swal.fire({
        title: "Are you sure you want to delete this item ?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
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
      this.jobQuaEN = "";
      this.jobQuaTH = "";
      this.quaItemButton = "new";
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
          .map((item) => item.department_DescEN)
          .filter((value, index, self) => self.indexOf(value) === index);
        this.filterDepartments(); // Re-apply the filter with the new data
      } catch (error) {
        console.error(error);
      }
    },

    async fetchDescriptionsDetail(headID) {
      try {
        const response = await apiService.getSelectDescriptionDetail(headID);
        this.descDetailData = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchQualificationsDetail(headID) {
      try {
        const response = await apiService.getSelectQualificationDetail(headID);
        this.quaDetailData = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    validateDepartment() {
      if (
        isEmpty(this.descEN) ||
        isEmpty(this.descTH) ||
        isEmpty(this.descStatus)
      ) {
        this.snackbar = true;
        this.snackbarMessage = "Please fill your information completely.";
      } else {
        this.addDep();
      }
    },

    validatePosition() {
      if (
        isEmpty(this.posName) ||
        this.depID == "" ||
        isEmpty(this.posStatus) ||
        isEmpty(this.posPriority) ||
        isEmpty(this.descDetailData) ||
        isEmpty(this.quaDetailData)
      ) {
        this.snackbar = true;
        this.snackbarMessage = "Please fill your information completely.";
      } else {
        this.addPos();
      }
    },

    validateDescItemAdd() {
      if (isEmpty(this.jobDescEN) && isEmpty(this.jobDescTH)) {
        this.snackbar = true;
        this.snackbarMessage = "Please fill your information completely.";
      } else {
        this.addItemDescription();
      }
    },
    validateDescItemEdit() {
      if (isEmpty(this.jobDescEN) && isEmpty(this.jobDescTH)) {
        this.snackbar = true;
        this.snackbarMessage = "Please fill in description.";
      } else {
        this.editItemDescription();
      }
    },

    validateQuaItemAdd() {
      if (isEmpty(this.jobQuaEN) && isEmpty(this.jobQuaTH)) {
        this.snackbar = true;
        this.snackbarMessage = "Please fill in qualification.";
      } else {
        this.addItemQualification();
      }
    },
    validateQuaItemEdit() {
      if (isEmpty(this.jobQuaEN) && isEmpty(this.jobQuaTH)) {
        this.snackbar = true;
        this.snackbarMessage = "Please fill in qualification.";
      } else {
        this.editItemQualification();
      }
    },

    async addDep() {
      const data =
        this.formtype1 == "add"
          ? {
              Department_DescEN: this.descEN,
              Department_DescTH: this.descTH,
              Status: this.descStatus,
            }
          : {
              DepartmentID: this.selectID1,
              Department_DescEN: this.descEN,
              Department_DescTH: this.descTH,
              Status: this.descStatus,
            };
      console.log("Data", data);
      try {
        const response =
          this.formtype1 === "add"
            ? await apiService.postDepartment(data)
            : await apiService.updateDepartment(data);
        console.log("Response:", response.data);
        this.showDepDialog = false;
        if (this.formtype1 == "add") {
          Swal.fire({
            title: "Success!",
            text: "Add data success",
            icon: "success",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        } else {
          Swal.fire({
            title: "Success!",
            text: "Update data success",
            icon: "success",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }
        this.fetchDepartments();
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async addPos() {
      Swal.fire({
        title:
          this.formtype2 == "add"
            ? "Are you sure you want to add this item?"
            : "Are you sure you want to update this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmAddPos();
        }
      });
    },
    async confirmAddPos() {
      const data = {
        PositionID: this.selectID2,
        Position_Name: this.posName,
        DepartmentID: this.depID,
        detailsDescription: this.descDetailData,
        detailQualification: this.quaDetailData,
        Status: this.posStatus,
        Priority: this.posPriority,
        DescriptionID: this.posJD,
        QualificationID: this.posJQ,
      };
      console.log("Data", data);
      try {
        const response = await apiService.postPosition(data);
        console.log("Response:", response.data);
        this.showPosDialog = false;
        if (this.formtype2 == "add") {
          Swal.fire({
            title: "Success!",
            text: "Add data success",
            icon: "success",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        } else {
          Swal.fire({
            title: "Success!",
            text: "Update data success",
            icon: "success",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }
        this.fetchPositions();
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async deleteDep(departmentId) {
      Swal.fire({
        title: "Are you sure you want to delete this item ?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmDeleteDepartment(departmentId);
        }
      });
    },
    async confirmDeleteDepartment(departmentId) {
      const id = { departmentID: departmentId };
      console.log("id", id);
      try {
        const response = await apiService.deleteDepartment(id);
        if (response.data.statusCode === 200) {
          Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
          this.fetchDepartments();
        } else if (response.data.statusCode === 409) {
          Swal.fire({
            title: "Error!",
            text: response.data.message,
            icon: "error",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        this.delDepMessage = "An unexpected error occurred.";
        this.DelDepDialog = true;
      }
    },

    async deletePos(positionId, positionName) {
      Swal.fire({
        title: "Are you sure you want to delete this item ?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmDeletePosition(positionId, positionName);
        }
      });
    },
    async confirmDeletePosition(positionId, positionName) {
      const id = {
        positionID: positionId,
        position_Name: positionName,
      };
      try {
        const response = await apiService.deletePosition(id);
        if (response.data.statusCode === 200) {
          Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
          this.fetchPositions();
        } else if (response.data.statusCode === 409) {
          Swal.fire({
            title: "Error!",
            text: response.data.message,
            icon: "error",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        this.delPosMessage = "An unexpected error occurred.";
        this.DelPosDialog = true;
      }
    },
  },
};
</script>

<style scoped>
.job-item {
  padding: 20px;
  color: black;
}

.prefix {
  text-align: right;
  padding-right: 4px;
  color: red;
}

.filter-select {
  padding-right: 10px;
  padding-left: 10px;
  border-right: 1.5px solid #abacad;
  border-left: 1.5px solid #abacad;
}

.filter-search-position {
  padding-right: 10px;
  padding-left: 10px;
  border-right: 1.5px solid #abacad;
  border-left: 1.5px solid #abacad;
}

.filter-department {
  padding-right: 10px;
  padding-left: 10px;
  border-right: 1.5px solid #abacad;
}

.section {
  padding-bottom: 10px;
}

.custom-label {
  font-size: 15px;
}

.custom-label-priority {
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-label-detail {
  padding: 10px 0px 10px 0px;
  font-size: 16px;
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

.custom-icon {
  background-color: #fbc02d;
  border-radius: 50%;
  padding: 6px;
  margin: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.custom-icon-delete {
  background-color: #ef5350;
  border-radius: 50%;
  padding: 6px;
  margin: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.custom-autocomplete .v-input__prefix {
  color: red;
}

.item-title {
  font-weight: bold;
  font-size: 18px;
}

.padding-en {
  padding-right: 10px;
}

.padding-th {
  padding-left: 10px;
}

.extra-small-btn {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  min-height: 30px !important;
}

@media (max-width: 600px) {
  .custom-label-priority {
    justify-content: flex-start;
  }

  .padding-en {
    padding-right: 0px;
  }

  .padding-th {
    padding-left: 0px;
  }
}

@media (max-width: 675px) {
  .filter-department {
    border-left: 1.5px solid #abacad;
    margin-bottom: 10px;
  }

  .filter-select {
    margin-bottom: 10px;
  }
}

@media (max-width: 407px) {
  .item-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
  }
}
</style>
