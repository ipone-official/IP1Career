<template>
    <div>
    <h2 class="header">
    บริษัท ไอ.พี.วัน จำกัด
    แบบคำขอทรัพย์สินสำหรับพนักงานใหม่
    </h2>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">Name of step 1</v-stepper-step>
  
        <v-divider></v-divider>
  
        <v-stepper-step :complete="e1 > 2" step="2">Name of step 2</v-stepper-step>
  
        <v-divider></v-divider>
  
        <v-stepper-step step="3">Name of step 3</v-stepper-step>
      </v-stepper-header>
  
      <v-stepper-items>
        <v-stepper-content step="1">
        <h5 class="form-header">ข้อมูลพนักงานใหม่</h5>
            <v-layout>
            <v-flex lg4 class="ma-3">
                <v-text-field label="ชื่อ *" required></v-text-field>
            </v-flex>
            <v-flex lg4 class="ma-3" style="margin: 0px 20px 0px 20px">
                <v-text-field label="First Name *" required></v-text-field>
            </v-flex>
            <v-flex lg4 class="ma-3">
                <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="date"
                        label="Picker in menu"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="menu = false">OK</v-btn>
                    </v-date-picker>
                </v-menu>
            </v-flex>
            </v-layout>
            
            <v-layout>
                <v-flex lg4 class="ma-3">
                    <v-text-field label="นามสกุล *" required></v-text-field>
                </v-flex>
                <v-flex lg4 class="ma-3">
                    <v-text-field label="Last Name *" required></v-text-field>
                </v-flex>
                <v-flex lg4 class="ma-3">
                    <v-text-field label="รหัสพนักงาน *" required></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-flex lg4 class="ma-3">
                    <v-select :items="vse" label="ฝ่าย"></v-select>
                </v-flex>
                <v-flex lg4 class="ma-3">
                    <v-text-field label="ตำแหน่งงาน *" required></v-text-field>
                </v-flex>
                <v-flex lg4 class="ma-3">
                    <v-text-field label="เบอร์โทรติดต่อ *" required></v-text-field>
                </v-flex>
            </v-layout>
        
        <h5 class="form-header2">ทดแทนพนักงานลาออก</h5>
            <v-layout>
                <v-flex lg4 class="ma-3">
                    <v-text-field label="ชื่อ *" required></v-text-field>
                </v-flex>
                <v-flex lg4 class="ma-3" style="margin: 0px 20px 0px 20px">
                    <v-text-field label="First Name *" required></v-text-field>
                </v-flex>
                <v-flex lg4 class="ma-3">
                    <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                    >
                        <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="date2"
                            label="Picker in menu"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                        ></v-text-field>
                        </template>
                        <v-date-picker v-model="date2" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="menu2 = false">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-flex>
            </v-layout>
            
            <v-layout>
                <v-flex lg4 class="ma-3">
                    <v-text-field label="นามสกุล *" required></v-text-field>
                </v-flex>
                <v-flex lg4 class="ma-3">
                    <v-text-field label="Last Name *" required></v-text-field>
                </v-flex>
                <v-flex lg4 class="ma-3">
                    <v-text-field label="รหัสพนักงาน *" required></v-text-field>
                </v-flex>
            </v-layout>

        <h5 class="form-header3">รายการทรัพย์สิน / ฝ่ายทรัพยากรบุคคล</h5>
            <v-layout>
                <v-checkbox v-model="checkboxA" :error="submitClicked" @change="handleRadioChange">
                    <template v-slot:label>
                        <div style="font-size: 15px;">
                            ชุดบัตรพนักงาน
                        </div>
                    </template>
                </v-checkbox>
                <v-checkbox v-model="checkboxF" :error="submitClicked"  @change="handleRadioChange2">
                    <template v-slot:label>
                        <div style="font-size: 15px;">
                            เครื่องแบบพนักงาน (Uniform)
                        </div>
                    </template>
                </v-checkbox>
                <v-text-field label="เลขบัตร(สำหรับเครื่องถ่ายเอกสาร)" required></v-text-field>
            </v-layout>

          <v-btn color="primary" @click="e1 = 2">Continue</v-btn>
          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>
  
        <v-stepper-content step="2">
          <v-card
            class="mb-5"
            color="grey lighten-1"
            height="200px"
          ></v-card>
  
          <v-btn color="primary" @click="e1 = 3">Continue</v-btn>
          <v-btn flat @click="e1 = e1 - 1">Cancel</v-btn>
        </v-stepper-content>
  
        <v-stepper-content step="3">
          <v-card
            class="mb-5"
            color="grey lighten-1"
            height="200px"
          ></v-card>
  
          <v-btn color="primary" @click="e1 = 1">Continue</v-btn>
          <v-btn flat @click="e1 = e1 - 1">Cancel</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    </div>
  </template>

<script>
export default {
    components: {
    },
    
    data() {
      return {
        e1: 0,
        vse: ['1', '2'],
        date: '',
        menu: false,
        date2: '',
        menu2: false,
      };
    },
}
</script>

<style>
.container{
  background-color: white;  
}

.form-header {
    color: green;
    font-weight: bold;
}

.form-header2 {
    color: red;
    font-weight: bold;
}

.form-header3 {
    color: rgb(0, 0, 0);
    font-weight: bold;
}
</style>