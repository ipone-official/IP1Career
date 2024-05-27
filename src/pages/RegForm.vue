<template>
  <div id="app" class="container">
      <h1 >Candidate Form</h1>

        <v-form v-model="valid" ref="form">
          <v-text-field v-model="PositionName" label="Position" disabled></v-text-field>

            <v-layout>
              <v-flex sm2 style="padding-right: 10px;">
                  <v-select v-model="title" :items="titles" label="Title"></v-select>
              </v-flex>
              <v-flex sm5 style="padding-right: 10px;">
                <v-text-field v-model="firstname" label="First Name"></v-text-field>
              </v-flex>
              <v-flex sm5 style="padding-left: 10px;">
                <v-text-field v-model="lastname" label="Last Name"></v-text-field>
              </v-flex>
            </v-layout>
            
            <v-text-field v-model="email" label="E-mail"></v-text-field>
            <v-text-field v-model="phone" label="Phone"></v-text-field>

            <label for="resume" style="display: block; margin-bottom: 5px; font-size: 17px; padding-top: 5px;">Resume</label>
            <input type="file" id="resume" ref="resume" style="padding-bottom: 10px;">

            <v-select v-model="social" :items="listSocial" label="How did you hear about us?"></v-select>
      
            <a @click="dialog = true" class="policy-link">อ่าน Terms and Policy</a>
            <v-dialog v-model="dialog" width="auto">
              <v-card>
                <v-card-title>
                  <v-icon left>mdi-update</v-icon>{{ myJson.title }}
                </v-card-title>
                <v-card-text>{{ myJson.name }}</v-card-text>
                <v-card-text>{{ myJson.name2 }}</v-card-text>
                <v-card-actions>
                  <v-btn text @click="dialog = false">Ok</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
    
            <v-btn color="success" @click="submitForm">Submit</v-btn>
            <v-btn color="error" @click="reset">Clear</v-btn>
            <v-btn color="blue-grey lighten-2" @click="goBack()">Go Back</v-btn>
        </v-form>
        <v-snackbar v-model="snackbar" multi-line top left color="info" class="snackbar">
          {{ remind }}
          <v-btn dark flat @click="snackbar = false" class="btn-snackbar">Close</v-btn>
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
  import { forEach } from "lodash";
  import { result } from "lodash";
  import { mdiConsoleLine } from "@mdi/js";
  import json from '../i18n/data.json';

  export default {
    data() {
      return {
        snackbar: false,
        dialog: false,
        title: '',
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        resume: '',
        social: '',
        listSocial: ['Facebook','Instagram','Tiktok','JobsDB','JobThai','อื่นๆ'],
        titles: ['นาย','นาง','นางสาว'],
        consent: '',
        myJson: json,
        remind: '',
      };
    },

    computed: {
      ...sync("*"),
    },
    
    created() {
      this.storage = this.PositionName;
    },

    methods: {
      checkf(){
        if (this.title.length < 1) {
          // this.remind.push('T Error');
          this.remind = 'T Error';
          this.snackbar = true;
          return
        }
        else if (this.firstname.length < 1) {
          // this.remind.push('F Error');
          this.remind = 'F Error';
          this.snackbar = true;
        }
        else if (this.lastname.length < 1) {
          // this.remind.push('L Error');
          this.remind = 'L Error';
          this.snackbar = true;
        }
        else if (this.email.length < 1) {
          // this.remind.push('E Error');
          this.remind = 'E Error';
          this.snackbar = true;
        }
        else if (this.phone.length != 10) {
          // this.remind.push('P Error');
          this.remind = 'P Error';
          this.snackbar = true;
        }
        else if (this.social.length < 1) {
          // this.remind.push('S Error');
          this.remind = 'S Error';
          this.snackbar = true;
        }
        else {
          this.snackbar = false;
        }
      },

      getFile() {
        this.resume = this.$refs.resume.files[0];
      },

      async submitForm() {
        this.checkf();
        this.getFile();
        const consent =  'Y';
        const formData = new FormData();
        formData.append('First_Name', this.firstname);
        formData.append('Last_Name', this.lastname);
        formData.append('Title', this.title);
        formData.append('Email', this.email);
        formData.append('Phone', this.phone);
        formData.append('Resume', this.resume);
        formData.append('Position_Name', this.PositionName);
        formData.append('Social', this.social);
        formData.append('Consent', consent);

        console.log('resume', this.resume);
        console.log('position', this.PositionName);
        console.log('Data', formData);
        try {
          const response = await apiService.postCandidate(formData);
          console.log('Response:', response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      },
      reset () {
        this.title = ""
        this.firstname = ""
        this.lastname = ""
        this.email = ""
        this.phone = ""
        this.social = ""
      },
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      goBack() {
      this.$router.push({ name: 'Career'});
      },
    },
  };
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  max-width: 80%;
  margin: 40px auto;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: linear-gradient(to top, #f5f7fa 0%, #c3cfe2 100%);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #0a0a0a;
}

.v-btn {
  display: inline-block;
  padding: 0px 20px;
  margin-right: 5px;
  margin-top: 20px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
}

.v-form {
  font-size: 17px;
}

.policy-link {
  font-size: 20px;
}

.v-text-field {
  font-size: 19px;
  color: #0a0a0a;
}

.snackbar {
  font-size: 20px;
  color: whitesmoke;
}

.btn-snackbar{
  font-weight: bold;
  align-items: center;
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
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