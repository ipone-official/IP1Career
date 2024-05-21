<template>
    <div id="app" class="container">
        <h1>Candidate Form</h1>
        <v-app id="inspire">
        <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="PositionName" label="Position" disabled></v-text-field>

        <v-layout>
            <v-flex sm2 style="padding-right: 10px;">
                <v-select v-model="title" :items="titles" label="Title" required ></v-select>
            </v-flex>
            <v-flex sm5 style="padding-right: 10px;">
                <v-text-field v-model="firstname" label="First Name" required></v-text-field>
            </v-flex>
            <v-flex sm5 style="padding-left: 10px;">
                <v-text-field v-model="lastname" label="Last Name" required></v-text-field>
            </v-flex>
        </v-layout>

        <v-text-field v-model="email" label="E-mail" required></v-text-field>
        <v-text-field v-model="phone" label="Phone" required></v-text-field>

        <label for="resume" style="display: block; margin-bottom: 5px; font-size: 17px; padding-top: 5px;">Resume</label>
        <input type="file" id="resume" name="resume" style="padding-bottom: 10px;">
        <v-select v-model="select" :items="items" label="How did you hear about us?" required></v-select>

        <v-checkbox v-model="checkbox" :rules="[v => !!v || 'You must agree to continue!']" label="Do you agree?" required></v-checkbox>
    
        <v-btn :disabled="!valid" color="success">Submit</v-btn>
        <v-btn color="error" @click="reset">Clear</v-btn>
        </v-form>
        </v-app>
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

  export default {
    data() {
      return {
        valid: true,
        title: '',
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        select: null,
        items: [
        'Facebook',
        'Instagram',
        'Tiktok',
        'JobsDB',
        'JobThai',
        'อื่นๆ'
        ],
        titles: [
        'นาย',
        'นาง',
        'นาวสาว',
        ],
        checkbox: false,
      };
    },

    computed: {
      ...sync("*"),
    },
    
    methods: {
        submit() {
            if (this.$refs.form.validate()) {
            alert('Form submitted!');
            console.log(this.candidate);
            }
        },
        reset () {
            this.$refs.form.reset()
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.fileName = file.name;
                // Reset input value to allow re-uploading the same file
                this.$refs.fileInput.value = null;
            }
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}


.row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.col {
  flex: 1;
  padding: 0 10px;
}

.col-tit {
  padding: 0 10px;
}

.col label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.col-tit label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.col input,
.col select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.col-tit input,
.col-tit select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.col input:focus,
.col select:focus {
  border-color: #777;
  background-color: #fff;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #06aad3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
}

.btn:hover {
  background-color: #218838;
}

.btn-clear {
  background-color: #dc3545;
}

.btn-clear:hover {
  background-color: #c82333;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 20px; /* Space for the arrow */
}

.select-wrapper::after {
  content: "\2304";
  position: absolute;
  top: 12.5%;
  right: 10px;
  color: #777;
  background-color: #c82333;
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