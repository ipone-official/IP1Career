<template>
  <v-card class="pa-3">
    <v-card-title>
      <span style="font-weight: bold; font-size: 17px">
        Employee Asset List
      </span>
      <v-spacer></v-spacer>
      <v-flex xl3 lg3 class="filter-select">
        <v-autocomplete outlined v-model="filterStatus" :items="['All Status', ...statusList]" dense
          label="Filter Status" return-object hide-details></v-autocomplete>
      </v-flex>
      <v-flex xl3 lg3 class="filter-search">
        <v-text-field v-model="searchEmpAsset" append-icon="search" label="Search" single-line
          hide-details></v-text-field>
      </v-flex>
    </v-card-title>
    <v-data-table :headers="headers" :search="searchEmpAsset" :items="employeeAssetLists"
      :rows-per-page-items="rowPerPageItems">
      <!-- Customize items -->
      <template v-slot:items="props">
        <tr>
          <td class="text-left">{{ props.item.employment_ID }}</td>
          <td class="text-left">{{ props.item.employee_Name }}</td>
          <td class="text-left">{{ props.item.employee_Surname }}</td>
          <td>
            <div :class="['status-badge', props.item.formStatus.toLowerCase()[0]]">
              {{ props.item.formStatus }}
            </div>
          </td>
          <td class="text-left">{{ props.item.createDate }}</td>
          <td class="text-left">{{ props.item.createByFullName }}</td>
          <td class="text-left">{{ props.item.updateDate }}</td>
          <td class="text-left">{{ props.item.updateByFullName }}</td>
          <td class="text-left">{{ props.item.approveDate }}</td>
          <td class="text-left">{{ props.item.approveByFullName }}</td>
          <td class="text-left">{{ props.item.receiveDate }}</td>
          <td class="text-left">{{ props.item.receiveBy }}</td>
          <td class="text-left">{{ props.item.effectiveDate }}</td>
          <td>
            <v-layout>
              <v-btn fab dark small class="extra-small-btn" depressed
                @click="openAssetForm(props.item.employeeAsset_ID, props.item.employment_ID)" color="#007fc4">
                <v-icon dark>mdi-open-in-new</v-icon>
              </v-btn>
              <v-btn fab dark small color="red" class="extra-small-btn" depressed
                v-if="props.item.formStatus == 'IN PROCESS' && !infoLogin.ADgroup.includes('User_Career')"
                @click="updateStatusEmployee('TURNDOWN', props.item.employeeAsset_ID)">
                <v-icon dark>mdi-close-thick</v-icon>
              </v-btn>
              <v-btn fab dark small color="green" @click="setUpdatePeoplePlus(props)" class="extra-small-btn" depressed
                v-if="props.item.formStatus == 'ONBOARDING' && props.item.employeeStatus == '0'">
                <v-icon>mdi-account-arrow-right</v-icon>
              </v-btn>
              <v-btn fab dark small color="#f8c849" class="extra-small-btn" depressed
                v-if="props.item.formStatus == 'ONBOARDING' && !infoLogin.ADgroup.includes('User_Career') && props.item.employeeStatus == '1'"
                @click="setProp(props)">
                <v-icon size="18">mdi-logout</v-icon>
              </v-btn>
            </v-layout>
          </td>
        </tr>
      </template>
    </v-data-table>

    <div v-if="loadingDialog">
      <Loading :value="loadingDialog" />
    </div>

    <v-dialog v-model="retireMenu" persistent>
      <v-card>
        <v-card-title style="padding-bottom: 0px">
          <v-chip color="#f8c849">แจ้งพนักงานลาออก {{ currentEmpID }} - {{ currentFullName }}</v-chip>
          <v-spacer></v-spacer>
          <v-chip color="#f8c849">วันที่บันทึก {{ currentDate }}</v-chip>
        </v-card-title>

        <v-card-text>
          <v-layout row wrap class="px-2">
            <v-flex lg3 xl3>
              <v-layout>
                <v-menu ref="effectiveMenu" v-model="effectiveMenu" :close-on-content-click="false" :nudge-right="40"
                  lazy transition="scale-transition" offset-y full-width min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="customEffectiveDate" readonly hide-details v-on="on" class="pr-2">
                      <template v-slot:label>
                        วันพ้นสภาพพนักงาน
                        <v-icon style="vertical-align: middle">mdi-calendar</v-icon>
                      </template></v-text-field>
                  </template>
                  <v-date-picker v-model="effectiveDate1" no-title scrollable @input="formatSelectedDate">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="effectiveMenu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="effectiveMenu = false">OK</v-btn>
                  </v-date-picker>
                </v-menu>
                <v-text-field class="pl-2" label="เลขที่เอกสาร" v-model="documentNo"></v-text-field>
              </v-layout>
            </v-flex>
            <v-flex lg1 xl1>
              <v-autocomplete label="บันทึกลงบัญชีดำ" prefix="*" class="prefix-effective" :items="BlackList"
                item-text="blacklistName" item-value="blacklistValue" v-model="selectBlacklist"></v-autocomplete>
            </v-flex>
            <v-flex lg2 xl2>
              <v-autocomplete label="สาเหตุการพ้นสภาพ" prefix="*" class="prefix-effective" :items="ReasonResign"
                v-model="selectReasonResign" item-text="reasonDescTH" item-value="reasonResignCode"></v-autocomplete>
            </v-flex>
            <v-flex lg2 xl2>
              <v-autocomplete label="สาเหตุการสิ้นสุดเป็นผู้ประกันต้น" prefix="*" class="prefix-effective"
                v-model="selectReasonInsured" :items="ReasonInsured" item-text="reasonDescTH"
                item-value="reasonInsured"></v-autocomplete>
            </v-flex>
            <v-flex lg4 xl4>
              <v-textarea rows="1" label="หมายเหตุ" solo single-line flat class="inner-card-remark" v-model="Remark"
                background-color="#f4f4f4" hide-details></v-textarea>
            </v-flex>
          </v-layout>
          <!-- <hr class="custom-hr" /> -->
          <v-layout v-if="!noData">
            <v-flex lg2 xl2>
              <v-card flat>
                <v-card-title class="custom-title">
                  Advance Request No
                </v-card-title>
                <v-list>
                  <v-list-tile v-for="item in AdvanceRequestData" :key="item.advanceRequest_No">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="item.advanceRequest_No"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
            <v-flex lg2 xl2>
              <v-card flat>
                <v-card-title class="custom-title">
                  Advance By User
                </v-card-title>
                <v-list>
                  <v-list-tile v-for="item in AdvanceRequestData" :key="item.advanceRequest_No">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="item.advanceByUser_No"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
            <v-flex lg2 xl2>
              <v-card flat>
                <v-card-title class="custom-title">
                  SAP FI Document No
                </v-card-title>
                <v-list>
                  <v-list-tile v-for="item in AdvanceRequestData" :key="item.advanceRequest_No">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="item.saP_FI_DocumentNo"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
            <v-flex lg3 xl3>
              <v-card flat>
                <v-card-title class="custom-title">
                  Period
                </v-card-title>
                <v-list>
                  <v-list-tile v-for="item in AdvanceRequestData" :key="item.advanceRequest_No">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.periodStart }} - {{ item.periodEnd }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
            <v-flex lg3 xl3>
              <v-card flat>
                <v-card-title class="custom-title">
                  Amount
                </v-card-title>
                <v-list>
                  <v-list-tile v-for="item in AdvanceRequestData" :key="item.advanceRequest_No">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ functions.numberWithCommas(item.amount.toFixed(2)) }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout v-if="noData">
            <v-flex lg12 xl12>
              <v-card dark color="#007fc4">
                <v-card-text>
                  ไม่มีข้อมูล Advance Request
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark @click="checkSaveEffective()" color="#007fc4">ยืนยัน</v-btn>
          <v-btn @click="retireMenu = false" color="#f8c849">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="loginDialog" persistent width="30%">
      <v-card>
        <v-card-title class="primary white--text">
          แจ้งอนุมัติรายการทรัพย์สินพนักงานใหม่
        </v-card-title>
        <v-card-text>
          <p>ชื่อผู้ใช้</p>
          <v-text-field solo flat label="ชื่อผู้ใช้ของระบบ PeoplePlus" background-color="#f4f4f4" hide-details
            class="inner-card-item" prepend-inner-icon="mdi-account-circle" v-model="peoplePlusUsername"></v-text-field>
          <p class="mt-3">รหัสผ่าน</p>
          <v-text-field solo flat label="รหัสผ่านของระบบ PeoplePlus" background-color="#f4f4f4" hide-details
            :append-icon="showPassword ? 'visibility' : 'visibility_off'" :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword" class="inner-card-item" prepend-inner-icon="mdi-lock"
            v-model="peoplePlusPassword"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" @click="saveEffective()" dark>ยืนยัน</v-btn>
          <v-btn color="#f8c849" @click="loginDialog = false">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="loginDialogForUpdate" persistent width="30%">
      <v-card>
        <v-card-title style="background: linear-gradient(to right, #007ec3, #0065a4); color: white;">
          อัพเดทสถานะพนักงาน
        </v-card-title>
        <v-card-text>
          <p>ชื่อผู้ใช้</p>
          <v-text-field solo flat label="ชื่อผู้ใช้ของระบบ PeoplePlus" background-color="#f4f4f4" hide-details
            class="inner-card-item" prepend-inner-icon="mdi-account-circle" v-model="usernameForUpdate"></v-text-field>
          <p class="mt-3">รหัสผ่าน</p>
          <v-text-field solo flat label="รหัสผ่านของระบบ PeoplePlus" background-color="#f4f4f4" hide-details
            :append-icon="showPassword ? 'visibility' : 'visibility_off'" :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword" class="inner-card-item" prepend-inner-icon="mdi-lock"
            v-model="passwordForUpdate"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" @click="confirmUpdatePeoplePlus()" dark>ยืนยัน</v-btn>
          <v-btn color="#f8c849" @click="loginDialogForUpdate = false">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import Loading from "../components/core/Loading";
import { sync } from "vuex-pathify";
import apiMasterData from '../services/apiMasterData';
import apiService from "@/services/apiService";
import Swal from "sweetalert2";
import axios from "axios";
import functions from "../plugins/functions";

export default {
  components: {
    Loading,
  },

  data() {
    return {
      headers: [
        { text: "ID", value: "employment_ID" },
        { text: "First Name", value: "employee_Name" },
        { text: "Last Name", value: "employee_Surname" },
        { text: "Status", value: "formStatus" },
        { text: "Create Date", value: "createDate" },
        { text: "Create By", value: "createByFullName" },
        { text: "Update Date", value: "updateDate" },
        { text: "Update By", value: "updateByFullName" },
        { text: "Approve Date", value: "approveDate" },
        { text: "Approve By", value: "approveByFullName" },
        { text: "Receive Date", value: "receiveDate" },
        { text: "Receive By", value: "receiveBy" },
        { text: "Efective Date", value: "effectiveDate" },
        { text: "Action", sortable: false },
      ],
      rawEmployeeAssetLists: [],
      employeeAssetLists: [],
      searchEmpAsset: "",
      loadingDialog: false,
      loginDialog: false,
      effectiveMenu: false,
      effectiveDate1: "",
      customEffectiveDate: "",
      retireMenu: false,
      currentDate: new Date().toLocaleDateString("en-GB"),
      currentAssetID: "",
      currentEmpID: "",
      BlackList: [{ blacklistValue: "Y", blacklistName: 'ใช่' }, { blacklistValue: "N", blacklistName: 'ไม่ใช่' }],
      ReasonResign: [],
      ReasonInsured: [],
      AdvanceRequestData: [],
      noData: false,
      documentNo: "",
      selectBlacklist: "N",
      selectReasonResign: "",
      selectReasonInsured: "",
      Remark: "",
      ppToken: "",
      peoplePlusUsername: '',
      peoplePlusPassword: '',
      showPassword: false,
      currentFullName: '',
      functions,
      loginDialogForUpdate: false,
      tempData: {},
      statusList: [],
      filterStatus: null
    };
  },

  computed: {
    ...sync("*"),
    rowPerPageItems() {
      return [
        { text: "10", value: 10 },
        { text: "30", value: 30 },
        {
          text: "ALL",
          value: this.employeeAssetLists ? this.employeeAssetLists.length : 0,
        },
      ];
    },
  },

  watch: {
    filterStatus: {
      handler: 'filterStatus1',
      immediate: true
    },
  },

  created() {
    this.fetchEmployeeAssetList();
    this.fetchReasonResign();
    this.fetchReasonInsured();
  },

  methods: {
    setProp(data) {
      this.retireMenu = true;
      this.currentAssetID = data.item.employeeAsset_ID;
      this.currentEmpID = data.item.employee_ID;
      this.currentFullName = data.item.employee_NameEN + ' ' + data.item.employee_SurnameEN
      // this.getAdvanceRequest(this.currentEmpID)
      this.getAdvanceRequest(this.currentEmpID)
    },
    formatSelectedDate(date) {
      const [year, month, day] = date.split("-");
      this.customEffectiveDate = `${day}/${month}/${year}`;
      this.menu = false;
    },
    checkSaveEffective() {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่ว่าต้องการแจ้งพนักงานลาออก ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.loginDialog = true;
        }
      });
    },
    async saveEffective() {
      this.loadingDialog = true;
      try {
        const peoplePlusLogin = {
          username: this.peoplePlusUsername,
          password: this.peoplePlusPassword,
          client_id: 4,
          client_secret: "aPz128qWFn02SRuvlQYPykCuZnQc9wkjn19oAPdI",
          grant_type: "password",
          scope: "*"
        };
        const loginResponse = await axios.post('https://api.ipo.peopleplushcm.com/v1/oauth/token', peoplePlusLogin);
        this.ppToken = loginResponse.data.access_token;

        const responseCheckIdNumber = await axios.get(`https://api.ipo.peopleplushcm.com/api/hrpmc2e/msgWarning?numoffid=${ this.groupPeoplePlus.employee_IDNumber }&codnatnl=&dteempdb=&numbank=&numbank2=&codempid=`, {
          headers: {
            'Authorization': `Bearer ${this.ppToken}`,
          }
        });
        if(responseCheckIdNumber.data.errorno != ""){
          this.loadingDialog = false;
          return  Swal.fire({
            title: `แจ้งเตือน`,
            text:  `${responseCheckIdNumber.data.msg_warning}`,
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }

        const responseCheckBank = await axios.get(`https://api.ipo.peopleplushcm.com/api/hrpmc2e/msgWarning?numoffid=&codnatnl=&dteempdb=&numbank=${ this.tempData.tempAccountNumber.replace(/-/g, '') }&numbank2=&codempid=`, {
          headers: {
            'Authorization': `Bearer ${this.ppToken}`,
          }
        });
        if(responseCheckBank.data.errorno != ""){
          this.loadingDialog = false;
          return  Swal.fire({
            title: `แจ้งเตือน`,
            text:  `${responseCheckBank.data.msg_warning}`,
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }

        const dataNewEmp = {
          detail: {
            codempid: this.currentEmpID,            //EmployeeID
            codexemp: this.selectReasonResign,              // Reason For Termination
            codreq: this.peoplePlusUsername,              // Recorded By
            dteeffec: this.customEffectiveDate,        // Effective Date
            dteeffec_o: this.customEffectiveDate,      // Effective Date Record
            numexemp: this.documentNo,           // Refdoc no.
            desnote: this.Remark,          // Remarks
            flgblist: this.selectBlacklist,                 // Blacklist
            dtecreate: this.currentDate,       // Create Date
            flgssm: this.selectReasonInsured,                   // Cause of ending
            staupd: "P"                    // Status Approval
          }
        }
        const poeplePlusResponse = await axios.post('https://api.ipo.peopleplushcm.com/api/hrpm4ie/save', dataNewEmp, {
          headers: {
            'Authorization': `Bearer ${this.ppToken}`,
          }
        });
        console.log('API Response:', poeplePlusResponse.data);

        const ADsData = {
          username: this.currentFullName,
          effectiveDate: this.customEffectiveDate
        }
        const updateADsResponse = await apiService.UpdateADsUser(ADsData)
        console.log(updateADsResponse.data);

        const data = {
          EmployeeAsset_ID: this.currentAssetID,
          EmployeeID: this.currentEmpID,
          EffectiveDate: this.customEffectiveDate,
          DocumentNo: this.documentNo,
          Blacklist: this.selectBlacklist,
          ReasonResign: this.selectReasonResign,
          ReasonInsured: this.selectReasonInsured,
          Remark: this.Remark,
          RecordBy: this.infoLogin.ADempId ? this.infoLogin.ADempId : localStorage.getItem('currentEmpID')
        }
        const updateResponse = await apiService.updateEffectiveDate(data);
        console.log(updateResponse.data);

        this.loadingDialog = false;
        this.loginDialog = false;

        Swal.fire({
          title: 'สำเร็จ!',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          allowOutsideClick: false,
        });
      } catch (error) {
        console.error('Error:', error);
        this.loadingDialog = false;
        this.loginDialog = false;
        Swal.fire({
          title: 'ไม่สำเร็จ!',
          html: 'ไม่สามารถส่งข้อมูลได้เนื่องจาก : ' + error.response.data.message, // แสดงข้อความจาก response
          icon: 'error',
          confirmButtonText: 'ตกลง',
          allowOutsideClick: false,
        });
      }
    },

    async fetchEmployeeAssetList() {
      try {
        const data = {
          CurrentEmpID: this.infoLogin.ADempId ? this.infoLogin.ADempId : localStorage.getItem('currentEmpID')
        }
        const response = await apiService.getEmploymentAssetList(data);
        this.rawEmployeeAssetLists = response.data;

        this.statusList = this.rawEmployeeAssetLists
          .map(item => item.formStatus)
          .filter((value, index, self) => self.indexOf(value) === index);

        this.filterStatus = 'All Status'
        this.filterStatus1();
      } catch (error) {
        console.error(error);
      }
    },
    async fetchReasonResign() {
      try {
        const response = await apiMasterData.getReasonResign();
        this.ReasonResign = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchReasonInsured() {
      try {
        const response = await apiMasterData.getReasonInsured();
        this.ReasonInsured = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getAdvanceRequest(code) {
      const data = {
        EmployeeCode: code,
      };

      try {
        const response = await apiMasterData.getAdvanceRequest(data);

        if (response.status === 204) {
          this.noData = true;
          console.log("No content available");
        } else {
          this.noData = false;
          this.AdvanceRequestData = response.data;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    filterStatus1() {
      if (this.filterStatus === 'All Status') {
        this.employeeAssetLists = this.rawEmployeeAssetLists;
      } else {
        this.employeeAssetLists = this.rawEmployeeAssetLists.filter((sta) =>
          sta.formStatus === this.filterStatus
        );
      }
    },

    openAssetForm(id, employmentid) {
      const encodedEmploymentID = btoa(employmentid);
      this.selectAssetID = id;
      this.selectEmploymentID = encodedEmploymentID;
      this.$router.push("/NewEmpForm");
      localStorage.setItem("selectAsset", this.selectAssetID);
      localStorage.setItem("selectEmployment", encodedEmploymentID);
    },

    setUpdatePeoplePlus(data) {
      const encodedEmploymentID = btoa(data.item.employment_ID);
      this.selectAssetID = data.item.employeeAsset_ID;
      this.selectEmploymentID = encodedEmploymentID;
      localStorage.setItem("selectAsset", this.selectAssetID);
      localStorage.setItem("selectEmployment", this.selectEmploymentID);

      this.getAssetFormForUpdate();
      this.getPersonalFormForUpdate();
      this.loginDialogForUpdate = true;
    },
    async confirmUpdatePeoplePlus() {
      this.loadingDialog = true;
      try {
        const peoplePlusLogin = {
          username: this.usernameForUpdate,
          password: this.passwordForUpdate,
          client_id: 4,
          client_secret: "aPz128qWFn02SRuvlQYPykCuZnQc9wkjn19oAPdI",
          grant_type: "password",
          scope: "*"
        };
        const loginResponse = await axios.post('https://api.ipo.peopleplushcm.com/v1/oauth/token', peoplePlusLogin);
        this.tokenForUpdate = loginResponse.data.access_token;


        const responseCheckIdNumber = await axios.get(`https://api.ipo.peopleplushcm.com/api/hrpmc2e/msgWarning?numoffid=${ this.groupPeoplePlus.employee_IDNumber }&codnatnl=&dteempdb=&numbank=&numbank2=&codempid=`, {
          headers: {
            'Authorization': `Bearer ${this.tokenForUpdate}`,
          }
        });
        console.log("responseCheck", responseCheckIdNumber)
        if(responseCheckIdNumber.data.errorno != ""){
          return  Swal.fire({
            title: `${responseCheckIdNumber.data.msg_warning}`,
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }

        const responseCheckBank = await axios.get(`https://api.ipo.peopleplushcm.com/api/hrpmc2e/msgWarning?numoffid=&codnatnl=&dteempdb=&numbank=${this.tempData.tempAccountNumber.replace(/-/g, '')}&numbank2=&codempid=`, {
          headers: {
            'Authorization': `Bearer ${this.tokenForUpdate}`,
          }
        });
        console.log("responseCheckBank", responseCheckBank)
        if(responseCheckBank.data.errorno != ""){
          return  Swal.fire({
            title: `${responseCheckBank.data.msg_warning}`,
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }

        const dataNewEmp = {
          p_codempid_query: this.tempData.tempEmployeeID,
          flgwarning: "S",
          param_json: {
            personal: {
              codempid: this.tempData.tempEmployeeID,
              image: "",
              path_image: "",
              signature: "",
              path_sign: "",
              codtitle: this.groupPeoplePlus.employee_Title,
              namfirst: this.groupPeoplePlus.employee_Name,
              namfirste: this.groupPeoplePlus.employee_NameEN,
              namfirstt: this.groupPeoplePlus.employee_Name,
              namfirst3: "",
              namfirst4: "",
              namfirst5: "",
              namlast: this.groupPeoplePlus.employee_Surname,
              namlaste: this.groupPeoplePlus.employee_SurnameEN,
              namlastt: this.groupPeoplePlus.employee_Surname,
              namlast3: "",
              namlast4: "",
              namlast5: "",
              nicknam: this.groupPeoplePlus.employee_NickName,
              nickname: this.groupPeoplePlus.employee_NickName,
              nicknamt: this.groupPeoplePlus.employee_NickName,
              nicknam3: "",
              nicknam4: "",
              nicknam5: "",
              numtelec: this.groupPeoplePlus.mobilePhone,
              nummobile: "",
              lineid: "",
              numoffid: this.groupPeoplePlus.employee_IDNumber,
              dteoffid: "",
              adrissue: "",
              codprovi: "",
              codclnsc: "",
              numpasid: "",
              dtepasid: "",
              numvisa: "",
              dtevisaexp: "",
              numlicid: "",
              dtelicid: "",
              dteempdb: this.groupPeoplePlus.employee_Birthday,
              coddomcl: "",
              age_year: "",
              age_month: "",
              codsex: this.groupPeoplePlus.employee_Sex,
              weight: "",
              high: "",
              codblood: this.groupPeoplePlus.employee_BloodGroup,
              codorgin: this.groupPeoplePlus.employee_Ethnicity,
              codnatnl: this.groupPeoplePlus.employee_Nationality,
              codrelgn: this.groupPeoplePlus.employee_Religion,
              stamarry: this.groupPeoplePlus.employee_PersonalStatus,
              stamilit: this.groupPeoplePlus.employee_Stamilit,
              numprmid: "",
              dteprmst: "",
              dteprmen: "",
              numappl: this.tempData.tempEmployeeID,
              dteretire: "",
              ageretrm: "",
              ageretrf: "",
              flg: "add",
            },
            address: {
              codempid: "",
              adrreg: this.groupPeoplePlus.employee_Address,
              adrrege: "",
              adrregt: this.groupPeoplePlus.employee_Address,
              adrreg3: "",
              adrreg4: "",
              adrreg5: "",
              codprovr: this.groupPeoplePlus.employee_Province,
              coddistr: this.groupPeoplePlus.employee_District,
              codsubdistr: this.groupPeoplePlus.employee_SubDistrict,
              codcntyr: this.groupPeoplePlus.employee_Country,
              codpostr: this.groupPeoplePlus.employee_ZipCode,
              adrcont: this.groupPeoplePlus.employee_Address,
              adrconte: "",
              adrcontt: this.groupPeoplePlus.employee_Address,
              adrcont3: "",
              adrcont4: "",
              adrcont5: "",
              codprovc: this.groupPeoplePlus.employee_Province,
              coddistc: this.groupPeoplePlus.employee_District,
              codsubdistc: this.groupPeoplePlus.employee_SubDistrict,
              codcntyc: this.groupPeoplePlus.employee_Country,
              codpostc: this.groupPeoplePlus.employee_ZipCode,
            },
            work: {
              codempid: "",
              dteempmt: this.tempData.tempOnboardDate,
              svyryre: 0,
              svyrmth: 0,
              staemp: "1",
              dteeffex: "",
              codcomp: this.tempData.tempCompanyCode,
              desc_codcomp: "",
              codpos: this.tempData.tempFormPosition,
              namabb: "",
              dteefpos: this.tempData.tempOnboardDate,
              numlvl: this.tempData.tempJobLevel,
              dteeflvl: this.tempData.tempOnboardDate,
              codbrlc: this.tempData.tempLocation,
              codempmt: this.tempData.tempEmploymentType,
              typpayroll: this.tempData.tempPayrollType,
              typemp: this.tempData.tempGroupEmployee,
              codcalen: this.tempData.tempGroupWork,
              flgatten: "Y",
              codjob: this.tempData.tempJobType,
              jobgrade: this.tempData.tempJobGrade,
              dteefstep: this.tempData.tempOnboardDate,
              codgrpgl: this.tempData.tempGLAccount,
              codempidh: "",
              codcomph: "",
              codposh: "",
              stapost: "",
              desc_stapost: "",
              stadisb: "N",
              numdisab: "",
              dtedisb: "",
              dtedisen: "",
              typdisp: "",
              desdisp: "",
              qtyduepr: "119",
              dteduepr: "18/08/2024",
              yredatrq: "",
              mthdatrq: "",
              dteoccup: "",
              numtelof: "",
              email: "",
              numreqst: "",
              param_numreqst: "",
              param_codpos: "",
              ocodempid: "",
              dtereemp: "",
              qtyredue: "",
              dteredue: "",
              qtywkday: "",
              lock_edit: "",
              lock_staemp: "",
              dteupd: "",
              coduser: "",
              last_empimg: "",
              default_qtyduepr: "119",
              flgpdpa: "Y",
              dtepdpa: this.tempData.tempOnboardDate,
              numlvlmin: 0,
              numlvlmax: 99,
            },
            travel: {
              codempid: "",
              typtrav: "",
              carlicen: "",
              typfuel: "",
              qtylength: "",
              codbusno: "",
              codbusrt: "",
            },
            income: {
              detail: {
                codempid: "",
                codcurr: "BAHT",
                afpro: "",
                amtothr: "",
                amtday: "",
                sumincom: "",
                lock_edit: "N",
                dteupd: "",
                coduser: "",
                last_empimg: "",
                disp_sal: "Y",
              },
              table: {
                rows: [
                  {
                      codincom: "01",
                      desincom: "เงินเดือน/ค่าแรง",
                      desunit: "ต่อเดือน",
                      amtmax: 1500000,
                      amtincom: this.assetSalary,
                      rowID: 1,
                      flgEdit: true,
                      amtincomOld: "",
                    },
                    {
                      codincom: "03",
                      desincom: "ค่าสึกหรอ",
                      desunit: "ต่อเดือน",
                      amtmax: "",
                      amtincom: this.assetDepreciation,
                      rowID: 2,
                      flgEdit: false,
                      amtincomOld: this.assetDepreciation,
                    },   
                    {
                      codincom: "05",
                      desincom: "ค่าตำแหน่ง",
                      desunit: "ต่อเดือน",
                      amtmax: "",
                      amtincom: "",
                      rowID: 3,
                      flgEdit: false,
                      amtincomOld: "",
                    }/*,
                    {
                      codincom: "93",
                      desincom: "รายได้ประจำอื่นๆ",
                      desunit: "ต่อเดือน",
                      amtmax: "",
                      amtincom: "",
                      rowID: 4,
                      flgEdit: false,
                      amtincomOld: "",
                    },*/
                ],
              },
            },
            tax: {
              tax_detail: {
                codempid: "",
                numtaxid: this.groupPeoplePlus.employee_IDNumber,
                numsaid: this.groupPeoplePlus.employee_IDNumber,
                frsmemb: "",
                flgtax: "1",
                typtax: "1",
                typincom: "1",
                dteyrrelf: "",
                dteyrrelt: "",
                amtrelas: "",
                amttaxrel: "",
                codbank: this.tempData.tempBankAccount,
                numbank: this.tempData.tempAccountNumber.replace(/-/g, ''),
                numbrnch: "",
                amtbank: "100",
                amttranb: "",
                codbank2: "",
                numbank2: "",
                numbrnch2: "",
                qtychldb: "",
                qtychlda: "",
                qtychldd: "",
                coddedchil: "D004",
                amtchldb: "30000.00",
                amtchlda: "60000.00",
                amtchldd: "30000.00",
                coddeduct2: "D014",
                amtchldi: "60000",
                qtychldi: "",
                flgslip: this.tempData.tempPayslip,
              },
              over_income: {
                codempid: "",
                dtebf: "",
                amtincbf: "",
                amttaxbf: "",
                amtpf: "123",
                amtsaid: "750",
              },
              tax_exemption: {
                rows: [],
              },
              tax_allowance: {
                rows: [],
              },
              others_deduct: {
                rows: [],
              },
            },
            spouse: {
              sp_over_income: {
                codempid: "",
                numtaxid: "",
                dtebfsp: "",
                amtincsp: "",
                amttaxsp: "",
                amtsasp: "",
                amtpfsp: "",
              },
              sp_tax_exemption: {
                rows: [],
              },
              sp_tax_deduct: {
                rows: [],
              },
              sp_others_deduct: {
                rows: [],
              },
            },
            hisname: {
              rows: [],
            },
            document: {
              rows: [],
            }
          }
        }
        const response = await axios.post('https://api.ipo.peopleplushcm.com/api/hrpmc2e/savePersonalTax', dataNewEmp, {
          headers: {
            'Authorization': `Bearer ${this.tokenForUpdate}`,
          }
        });
        console.log('API Response:', response.data);

        const updateStatus = {
          employeeID: this.tempData.tempEmployeeID,
        };
        const updateResponse = await apiService.updateEmployeeStatus(updateStatus);
        console.log('Status', updateResponse);

        this.loadingDialog = false;
        this.loginDialogForUpdate = false;

        this.fetchEmployeeAssetList();

        Swal.fire({
          title: "สำเร็จ!",
          text: "อัพเดทข้อมูลบนระบบสำเร็จแล้ว",
          icon: "success",
          confirmButtonText: "ตกลง",
          allowOutsideClick: false,
        });
      } catch (error) {
        console.error('Error:', error);
        this.loadingDialog = false;
        Swal.fire({
          title: 'ไม่สำเร็จ!',
          html: 'ไม่สามารถส่งข้อมูลได้เนื่องจาก : ' + error.response.data.message, // แสดงข้อความจาก response
          icon: 'error',
          confirmButtonText: 'ตกลง',
          allowOutsideClick: false,
        });
      }
    },
    async getAssetFormForUpdate() {
      const id = { EmployeeAsset_ID: localStorage.getItem('selectAsset') };
      try {
        const response = await apiService.getEmploymentAssetByID(id);
        this.tempData = {
          tempEmployeeID: response.data.employee_ID, //
          tempOnboardDate: response.data.onboardDate, //
          tempDepartment: response.data.department_Desc,
          tempCompanyCode: response.data.companyCode, //
          tempFormPosition: response.data.position_Desc, // 
          tempEmployeeStatus: response.data.employeeStatus,
          tempLocation: response.data.location, //
          tempGLAccount: response.data.gL_Account, //
          tempGroupEmployee: response.data.groupEmployee, //
          tempPayrollType: response.data.payrollType, //
          tempJobType: response.data.jobType, //
          tempJobGrade: response.data.jobGrade, //
          tempJobLevel: response.data.jobLevel,//
          tempEmploymentType: response.data.employmentType, //
          tempGroupWork: response.data.groupWork, //
          tempBankAccount: response.data.bankAccount, //
          tempAccountNumber: response.data.accountNumber, //
          tempSalary: response.data.salary, //
          tempPayslip: response.data.payslip, //
          tempDepreciation: response.data.depreciation //
        }
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async getPersonalFormForUpdate() {
      const id = { Employment_ID: localStorage.getItem('selectEmployment') };
      try {
        const response = await apiService.getEmploymenPersonalData(id);
        this.groupPeoplePlus = response.data
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },

    updateStatusEmployee(sta, id) {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่ว่าต้องการอัพเดทข้อมูล ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmUpdateStatusEmployee(sta, id);
        }
      });
    },
    async confirmUpdateStatusEmployee(sta, id) {
      const data = {
        EmployeeAsset_ID: id,
        approveBy:
          this.infoLogin.ADsamAccount !== ""
            ? this.infoLogin.ADsamAccount
            : localStorage.getItem("currentUser"),
        Status: sta,
      };
      try {
        const response = await apiService.updateAssetFormStatus(data);
        console.log("Response:", response.data);
        Swal.fire({
          title: "สำเร็จ!",
          text: "อัพเดทสถานะของผู้สมัครแล้ว",
          icon: "success",
          confirmButtonText: "ตกลง",
          allowOutsideClick: false,
        });
        this.fetchEmployeeAssetList();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
};
</script>

<style>
.inner-card-remark {
  border: 1px solid #c4c4c4;
  border-radius: 3px;
}

.filter-search {
  padding-right: 10px;
  padding-left: 10px;
  border-right: 1.5px solid #abacad;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 7.5px;
  border-radius: 12.5px;
  font-weight: 500;
  width: fit-content;
}

.status-badge.o {
  background-color: #d1f5d1;
  color: #1fac24;
}

.status-badge.t {
  background-color: #fad3ce;
  color: #f5372a;
}

.status-badge.i {
  background-color: #d8d8d8;
  color: #a5a5a5;
}

.prefix-effective {
  text-align: right;
  padding-right: 4px;
  color: red;
}

.custom-title {
  color: #ffffff;
  font-weight: bold;
  font-size: 1.1rem;
  background-color: #007fc4;
}

.custom-hr {
  border-top: 0.15rem solid #007fc4;
  margin: 1.2rem 0;
  opacity: 0.8;
}

.extra-small-btn {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  min-height: 30px !important;
}

.theme--light.v-table thead th {
  background-image: -webkit-gradient(linear,
      right top,
      left top,
      from(rgba(51, 148, 225, 0.18)),
      to(transparent));
  background-image: linear-gradient(270deg,
      rgba(51, 148, 225, 0.18),
      transparent);
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