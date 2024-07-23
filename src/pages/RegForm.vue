<template>
  <div class="container">
    <div class="font-head">
      <v-icon style="font-size: 32.5px;">mdi-text-box</v-icon>
      ใบสมัครงาน
    </div>

      <v-form ref="form" v-model="valid">
        <v-layout class="custom-size" aligh-center wrap>
          <v-flex sm2 md2 lg2 xl2 class="space-label">
            <v-icon>mdi-briefcase-account</v-icon>
            <span style="padding-left: 0.2em; font-size: 14px;">ตำแหน่ง</span>
          </v-flex>

          <v-flex md6 lg6 xl6>
            <v-text-field type="text" v-model="PositionName" readonly single-line solo background-color="#BADDFA"></v-text-field>
          </v-flex>
        </v-layout>
        

        <v-layout class="custom-size">
          <v-flex xs12 sm2 md2 lg2 xl2 class="space-label">
            <v-icon>mdi-account</v-icon>
            <span style="padding-left: 0.2em; font-size: 14px;">ชื่อ</span>
          </v-flex>

          <v-flex xs12 sm2 md3 lg2 xl2 class="custom-text-field1">
            <v-select v-model="title" :items="vse" single-line solo label="คำนำหน้า" @change="updateTitleEN" background-color="#BADDFA" class="custom-text-field" ></v-select>
          </v-flex>

          <v-flex xs12 sm4 md4 lg4 xl4 >
            <v-text-field v-model="firstname" maxlength="40" @keydown.native="keyFilter($event, 'Th')" single-line solo label="ชื่อ (ไทย)" background-color="#BADDFA" class="custom-text-field" light></v-text-field>
          </v-flex>

          <v-flex xs12 sm4 md4 lg4 xl4 class="custom-text-field2">
                <v-text-field v-model="lastname" maxlength="40" @keydown.native="keyFilter($event, 'Th')" single-line solo label="นามสกุล (ไทย)" background-color="#BADDFA" class="custom-text-field"></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout class="custom-size">
          <v-flex xs12 sm2 md2 lg2 xl2>
            <!-- <v-icon>mdi-account</v-icon>
            <span style="padding-left: 0.2em; font-size: 14px;">ชื่อ</span> -->
          </v-flex>

          <v-flex xs12 sm2 md3 lg2 xl2 class="custom-text-field1">
            <v-select v-model="titleEN" :items="vse3" single-line solo label="Prefix" readonly background-color="#BADDFA" class="custom-text-field" ></v-select>
          </v-flex>

          <v-flex xs12 sm4 md4 lg4 xl4 >
            <v-text-field v-model="firstnameEN" maxlength="40" @keydown.native="keyFilter($event, 'En')" single-line solo label="First Name" background-color="#BADDFA" class="custom-text-field" light></v-text-field>
          </v-flex>

          <v-flex xs12 sm4 md4 lg4 xl4 class="custom-text-field2">
                <v-text-field v-model="lastnameEN" maxlength="40" @keydown.native="keyFilter($event, 'En')" single-line solo label="Last Name" background-color="#BADDFA" class="custom-text-field"></v-text-field>
          </v-flex>
        </v-layout>
      
        <v-layout class="custom-size">
          <v-flex xs12 sm2 md2 lg2 xl2 class="space-label">
            <v-icon>mdi-email</v-icon>
            <span style="padding-left: 0.2em;  font-size: 14px;">อีเมล</span>
          </v-flex>
          <v-flex sm6 md6 lg6 xl6 >
            <div class="form-group">
              <v-text-field v-model="email" type="email" @keydown.native="keyFilterEmail($event, 'emailV')" single-line label="อีเมล" solo background-color="#BADDFA" class="custom-text-field" ></v-text-field>
            </div>  
          </v-flex>
        </v-layout>

        <v-layout class="custom-size" wrap>
          <v-flex xs12 sm2 md2 lg2 xl2 class="space-label">
            <v-icon>mdi-phone</v-icon>
            <span style="padding-left: 0.2em;  font-size: 14px;">โทรศัพท์</span>
          </v-flex>
          <v-flex sm6 md6 lg6 xl6 >
                <div class="form-group">
                  <v-text-field v-model="phone"  type="text" maxlength="10" @keydown.native="keyFilter($event, 'number')" single-line solo label="หมายเลขที่สามารถติดต่อได้" 
                  background-color="#BADDFA" 
                  class="custom-text-field" 
                  >
                  </v-text-field>
                </div>
          </v-flex>
        </v-layout>

          
        <v-layout class="custom-size">
          <v-flex xs12 sm2 md2 lg2 xl2 class="space-label">
            <v-icon medium style="align-items: flex-start;">mdi-file-document-outline</v-icon>
            <span for="resume" style="padding-left: 0.2em;  font-size: 14px;">เรซูเม่</span>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6 >
            <v-text-field v-model="fileName" ref="resume" @change="validateFile" readonly single-line solo background-color="#BADDFA" class="custom-text-field dis" ></v-text-field>
          </v-flex>
          <v-flex class="custom-file-res">
            <input type="file" id="resume" ref="resume" @change="validateFile" accept=".pdf, .png, .jpg, .jpeg">
            <label for="resume" class="custom-file-upload">&#129137; เลือกไฟล์</label>
          </v-flex>
        </v-layout>

      
        <v-layout class="custom-size" wrap>
          <v-flex xs12 sm2 md2 lg2 xl2 class="space-label">
            <v-icon>mdi-bullhorn</v-icon>
            <span style="padding-left: 0.2em;  font-size: 14px;">คุณได้รับข่าวสารการสมัครจากช่องทางไหน ?</span>
          </v-flex>
          <v-flex >
            <div class="form-group">
              <v-select v-model="social" :items="vse2" single-line solo background-color="#BADDFA" class="custom-text-field" ></v-select>
            </div>
          </v-flex>
        </v-layout>

          <!-- กลุ่ม radio buttons -->
        <!-- <v-layout style="display: flex; align-items: center;">
          <v-radio-group 
            v-model="checkbox" 
            :error="submitClicked && !selectedOption"
            @change="handleRadioChange"
            style="flex: none; align-items: center;"
            row>
            <v-radio label="ยอมรับ" value="accept"></v-radio>
            <v-radio label="ไม่ยอมรับ" value="reject"></v-radio>
          </v-radio-group>
          <a @click="dialog = true" class="policy-link">Terms and Policy</a>
        </v-layout> -->
        <div style="padding-top: 15px;">
          <v-checkbox v-model="checkboxA" :error="submitClicked" @change="handleRadioChange">
            <template v-slot:label>
              <div style="font-size: 15px;">
                ท่านได้อ่านวัตถุประสงค์การใช้ข้อมูลส่วนบุคคลเพื่อการสมัครงานของบริษัท ฯ และเข้าใจเป็นอันดีแล้วก่อนให้คำยินยอม
              </div>
            </template>
          </v-checkbox>
          <v-checkbox v-model="checkboxF" :error="submitClicked"  @change="handleRadioChange2">
            <template v-slot:label>
              <div style="font-size: 15px;">
                ท่านได้อ่านคำประกาศการใช้ข้อมูลส่วนบุคคลของบริษัท ฯ และเข้าใจเป็นอันดีแล้วก่อนกดยอมรับ
                <a @click="dialog2 = true" class="policy-link">นโยบายของบริษัท ฯ</a>
              </div>
            </template>
          </v-checkbox>
        </div>

        <v-dialog v-model="dialog" width="80%" persistent>
          <v-card>
            <v-card-title style="font-weight: bold; align-items: center;">
              <v-icon>mdi-text-box</v-icon>&nbsp; {{ objective.title }}
            </v-card-title>
            <v-card-text>&nbsp; &nbsp; &nbsp; &nbsp;{{ objective.name2 }}</v-card-text>
            <v-card-text>{{ objective.name3 }}</v-card-text>
            <v-card-text style="font-weight: bold;">{{ objective.name4 }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="dialog = false" >ตกลง</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog2" width="80%" persistent>
          <v-card>
            <v-card-title style="font-weight: bold; align-items: center;">
              <v-icon>mdi-text-box</v-icon>&nbsp; {{ policy.title }}
            </v-card-title>
            <v-card-text style="font-weight: bold;">{{ policy.headTerm1 }}</v-card-text>
            <v-card-text>{{ policy.term1 }}</v-card-text>
            <v-card-text style="font-weight: bold;">{{ policy.headTerm2 }}</v-card-text>
            <v-card-text>{{ policy.term2 }}</v-card-text>
            <v-card-text>
              <ul>
                <li>{{ policy.subTerm21 }}</li>
                <li>{{ policy.subTerm22 }}</li>
                <li>{{ policy.subTerm23 }}</li>
              </ul>
            </v-card-text>
            <v-card-text style="font-weight: bold;">{{ policy.headTerm3 }}</v-card-text>
            <v-card-text>{{ policy.term3 }}</v-card-text>
            <v-card-text style="font-weight: bold;">{{ policy.headTerm4 }}</v-card-text>
            <v-card-text>{{ policy.term4 }}</v-card-text>
            <v-card-text style="font-weight: bold;">{{ policy.headTerm5 }}</v-card-text>
            <v-card-text>{{ policy.term5 }}</v-card-text>
            <v-card-text style="font-weight: bold;">{{ policy.headTerm6 }}</v-card-text>
            <v-card-text>{{ policy.term6 }}</v-card-text>
            <v-card-text>{{ policy.footer }}</v-card-text>
            <v-card-text v-html="policy.contact"></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="dialog2 = false" >ตกลง</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    
          <v-btn color="primary" @click="checkf">ยืนยัน</v-btn>
          <v-btn color="yellow darken-2" @click="reset">ล้างข้อมูล</v-btn>
          <v-btn outline color="primary" @click="goBack()">ย้อนกลับ</v-btn>
      </v-form>
        
      <v-snackbar color="#007fc4" v-model="snackbar" multi-line class="snackbar">
        {{ remind }}
        <v-btn flat @click="snackbar = false" class="btn-snackbar">ปิด</v-btn>
      </v-snackbar>

      <!-- <v-dialog v-model="loading" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            กำลังโหลด...
            <v-progress-linear indeterminate color="white" class="mt-3"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog> -->

      <div v-if="loadingDialog">
        <Loading :value="loadingDialog" />
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
  import { forEach } from "lodash";
  import { result } from "lodash";
  import { mdiConsoleLine } from "@mdi/js";
  import objectiveJson from '../i18n/data.json';
  import policyJson from '../i18n/policy.json';

  export default {
    components: {
      Loading,
    },

    data() {
      return {
        snackbar: false,
        dialog: false,
        dialog2: false,
        checkboxA: false,
        checkboxF: false,
        keyFilter,
        title: '',
        firstname: '',
        lastname: '',
        titleEN: '',
        firstnameEN: '',
        lastnameEN: '',
        phone: '',
        email: '',
        resume: '',
        social: 'Facebook',
        consent: '',
        objective: objectiveJson,
        policy: policyJson,
        remind: '',
        valid: true,
        submitClicked: false,
        vse: ['นาย', 'นาง', 'นางสาว'],
        vse2: ['Facebook', 'Instagram', 'Tiktok', 'Jobsdb', 'JobThai', 'อื่นๆ'],
        vse3: ['Mr.', 'Mrs.', 'Miss'],
        fileName: '',
        fileType: '',
        loadingDialog: false,
        pageLangauge: 'th'
      };
    },

    computed: {
      ...sync("*"),
      contactLines() {
        return this.policy.contact.split('\n');
      }
    },
    
    created() {
      this.storage = this.PositionName;
    },

    methods: {
      updateTitleEN(){
        if(this.title == 'นาย'){
          this.titleEN = 'Mr.'
        }
        if(this.title == 'นางสาว'){
          this.titleEN = 'Miss'
        }
        if(this.title == 'นาง'){
          this.titleEN = 'Mrs.'
        }
      },

      chDialog(){
        if(this.checkboxA == true){
          this.dialog = true;
        } else{
          this.dialog = false;
        }
      },

      checkf(){
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (this.title.length < 1) {
          this.remind = 'กรุณาเลือกคำนำหน้า';
          this.snackbar = true;
          return
        }
        else if (this.firstname.length < 1) {
          this.remind = 'กรุณากรอกชื่อ';
          this.snackbar = true;
          return
        }
        else if (this.lastname.length < 1) {
          this.remind = 'กรุณากรอกนามสกุล';
          this.snackbar = true;
          return
        }
        else if (this.firstnameEN.length < 1) {
          this.remind = 'กรุณากรอกชื่อภาษาอังกฤษ';
          this.snackbar = true;
          return
        }
        else if (this.lastnameEN.length < 1) {
          this.remind = 'กรุณากรอกนามสกุลภาษาอังกฤษ';
          this.snackbar = true;
          return
        }
        else if (this.email.length < 1) {
          this.remind = 'กรุณากรอกอีเมล';
          this.snackbar = true;
          return
        }
        else if (!this.email.match(regex)) {
          this.remind = 'กรุณากรอกอีเมลที่ถูกต้อง';
          this.snackbar = true;
          return
        }
        else if (this.phone.length != 10) {
          this.remind = 'กรุณาใส่เบอร์โทรศัพท์ 10 หลัก';
          this.snackbar = true;
          return
        }
        else if (this.social.length < 1) {
          this.remind = 'กรุณาเลือกช่องทางการได้รับข่าวสารการสมัคร';
          this.snackbar = true;
          return
        }
        else if (this.checkboxF == true && this.checkboxA == false) {
          this.remind = 'กรุณายอมรับวัตถุประสงค์การใช้ข้อมูลส่วนบุคคลของบริษัท ฯ';
          this.snackbar = true;
          return
        }
        else if (this.checkboxF == false && this.checkboxA == true) {
          this.remind = 'กรุณายอมรับคำประกาศการใช้ข้อมูลส่วนบุคคลของบริษัท ฯ';
          this.snackbar = true;
          return
        }
        else if (this.checkboxA == false && this.checkboxF == false) {
          this.remind = 'กรุณายอมรับวัตถุประสงค์และคำประกาศของบริษัท';
          this.submitClicked = true;
          this.snackbar = true;
          return
        }
        this.submitForm();
      },

      keyFilterEmail(event, type) {
        if (type === 'emailV' && !event.key.match(/^[a-zA-Z0-9@.,-\_]+$/) && event.key !== 'Backspace' && event.key !== 'Tab' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
          event.preventDefault(); // ป้องกันการป้อนข้อมูลที่ไม่ต้องการ
        }
      },

      getFile() {
        this.resume = this.$refs.resume.files[0];
      },

      validateFile(event) {
        const file = event.target.files[0];
        if (file == undefined){
          this.fileName = '';
        }
        else {
          this.fileName = file.name;
          this.fileType = file.type;
        }
        const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
          if (!validTypes.includes(this.fileType)) {
            this.remind = 'สามารถใส่ได้แค่ไฟล์ PDF, PNG, JPG และ JPEG';
            this.snackbar = true;
            event.target.value = ''; // Reset the value
            this.fileName = '';
        }
      },

      handleRadioChange() {
        if (this.checkboxA) {
          this.submitClicked = false;  // รีเซ็ตสถานะ submitClicked เมื่อมีการเลือก radio button
          this.chDialog();
        }
      },

      handleRadioChange2() {
        if (this.checkboxF) {
          this.submitClicked = false;  // รีเซ็ตสถานะ submitClicked เมื่อมีการเลือก radio button
        }
      },

      async submitForm() {
        this.getFile();
        const consent =  'Y';
        const version = this.policy.version;
        const fStatus = 'REGISTERED';
        const formData = new FormData();
        formData.append('First_Name', this.firstname);
        formData.append('Last_Name', this.lastname);
        formData.append('Title', this.title);
        formData.append('First_Name_EN', this.firstnameEN);
        formData.append('Last_Name_EN', this.lastnameEN);
        formData.append('Title_EN', this.titleEN);
        formData.append('Email', this.email);
        formData.append('Phone', this.phone);
        formData.append('Resume', this.resume);
        formData.append('Position_Name', this.PositionName);
        formData.append('Social', this.social);
        formData.append('Consent', consent);
        formData.append('Status', fStatus);
        formData.append('Consent_Version', version);

        this.loadingDialog = true; // แสดง Loader
        try {
          const response = await apiService.postApplicant(formData);
          console.log('Response:', response.data);

          this.loadingDialog = false; // ซ่อน Loader

            Swal.fire({
              title: 'สำเร็จ!',
              text: 'ขอบคุณที่สนใจและสมัครงานกับเรา!',
              icon: 'success',
              confirmButtonText: 'ตกลง',
              allowOutsideClick: false,
            });

          this.Applyform = false;
          this.Applydesc = false;
          this.Apply100w = true;
        } catch (error) {
          console.error('Error:', error);

          Swal.fire({
            title: 'ไม่สำเร็จ!',
            text: 'การสมัครไม่สำเร็จ!',
            icon: 'error',
            confirmButtonText: 'ตกลง',
            allowOutsideClick: false,
          });
        }
      },

      reset () {
        this.title = ""
        this.firstname = ""
        this.lastname = ""
        this.titleEN = ""
        this.firstnameEN = ""
        this.lastnameEN = ""
        this.email = ""
        this.phone = ""
        this.$refs.resume.value = "";
        this.fileName = ""
        this.social = "Facebook"
        this.checkboxA = ""
        this.checkboxF = ""
      },

      triggerFileInput() {
        this.$refs.fileInput.click();
      },

      goBack() {
      // this.$router.push({ name: 'Career'});
      this.Applyform = false;
      this.Applydesc = true;
      },
    },
  };
</script>

<style scoped>
  
.theme--light.v-icon {
  color: #007fc4;
}

* {
  box-sizing: border-box;
}

.container {
  max-width: 100%;
  padding: 30px 25px 20px 25px;
  background: #f4f4f4;
  max-height: 750px;
  min-height: 750px;
  overflow: auto;
  scrollbar-width: none;
}

.v-btn {
  margin-right: 5px;
  margin-top: 15px;
  border-radius: 4px;
}

.policy-link {
  font-size: 16px;
}

.snackbar {
  font-size: 18px;
  color: rgb(255, 255, 255);
}

.btn-snackbar{
  font-weight: bold;
  font-size: 17px;
  align-items: center;
  color: rgb(255, 255, 255);
}

input[type="file"] {
  display: none;
}

.custom-file-upload {
  border-radius: 4px; /* ขอบโค้ง */
  border: none; /* ลบเส้นขอบ */
  white-space: nowrap;
  padding: 7.5px 20px 0px 20px;
  /* margin-left: 10px; */
  cursor: pointer;
  background-color: #1976D2; /* สีฟ้าของ Vuetify */
  color: white; /* ข้อความสีขาว */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* เพิ่มเงาเบาๆ */
  height: 40px;
}

.custom-filename-upload{
  border: 1px solid rgb(229, 239, 253);
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 15px;
  background-image: linear-gradient(to right, rgba(51, 148, 225, .18), transparent); 
  width: 100%;
}

.font-head{
  font-size: 1.75em;
  font-weight: bold;
  padding-bottom: 30px;
  text-align: center;
  color: rgb(0, 0, 0);
}

.custom-text-field1{
  padding-right: 20px;
}

.custom-text-field2{
  padding-left: 20px;
}

.custom-file-res{
  padding-left: 10px;
}

.v-input--selection-controls{
  margin-top: 0px;
}

.v-card__text{
  padding: 10px 16px 10px 16px !important;
}

.space-label{
  padding-top: 5px;
}

@media (max-width: 599px) {
  .custom-size {
    display: block;
  }
  .custom-text-field1{
    padding-right: 0px;
  }
  .custom-text-field2{
    padding-left: 0px;
  }
  .custom-file-res{
    padding-left: 0px;
    padding-bottom: 20px;
  }
  .space-label{
    padding-top: 0px;
    padding-bottom: 10px;
  }
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
  }
  .policy-link {
    font-size: 15px;
  }
}

@media (max-width: 1400px) {
  .font-head {
    font-size: 1.4em;
  }
}

</style>