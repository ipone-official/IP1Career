<template>
    <div>
        <v-toolbar color="#007fc4" v-if="this.$route.path != '/NewEmpForm'">
            <img src="https://webapps.ip-one.com/IP1Career/static/logo-ipone-white.png" width="40vh" height="40vh" />
        </v-toolbar>
        <v-card class="flex mb-4" flat tile :color="$root.themeColorFooter" v-if="this.$route.path != '/NewEmpForm'">
            <v-card-actions></v-card-actions>
        </v-card>

        <div class="px-0">
            <v-card class="pa-4">
                <v-layout justify-space-between v-if="this.$route.path != '/NewEmpForm'">
                    <v-chip text-color="black" color="#f8c849">
                        ข้อมูลส่วนตัว
                    </v-chip>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 md2 lg2 xl2 class="custom-space">
                        <v-autocomplete label="คำนำหน้า" prefix="*" class="prefix"
                            prepend-icon="mdi-account-box-outline" v-model="personalFormTitle" :items="PrefixNameList"
                            item-text="prefix_Desc" item-value="prefix_Code" hide-details></v-autocomplete>
                    </v-flex>
                    <v-flex xs6 md5 lg2 xl2 class="custom-space">
                        <v-text-field label="ชื่อ" prefix="*" class="prefix" v-model="personalFormName"
                            @keydown.native="keyFilter($event, 'GroupTh')" hide-details></v-text-field>
                    </v-flex>
                    <v-flex xs6 md5 lg3 xl3 class="custom-space">
                        <v-text-field label="นามสกุล" prefix="*" class="prefix" v-model="personalFormSurName"
                            @keydown.native="keyFilter($event, 'GroupTh')" hide-details></v-text-field>
                    </v-flex>
                    <v-flex xs6 md4 lg2 xl2 class="custom-space">
                        <v-text-field label="ชื่อ (EN)" prefix="*" class="prefix" v-model="personalFormNameEN"
                            @keydown.native="keyFilter($event, 'En')" hide-details></v-text-field>
                    </v-flex>
                    <v-flex xs6 md4 lg3 xl3 class="custom-space">
                        <v-text-field label="นามสกุล (EN)" prefix="*" class="prefix" v-model="personalFormSurNameEN"
                            @keydown.native="keyFilter($event, 'En')" hide-details></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs6 md2 lg1 xl2 class="custom-space">
                        <v-text-field label="ชื่อเล่น" prefix="*" class="prefix" v-model="personalFormNickname"
                            style="padding-left: 30px;" maxlength="20" hide-details></v-text-field>
                    </v-flex>
                    <v-flex xs6 md2 lg1 xl1 class="custom-space">
                        <v-text-field label="น้ำหนัก" prefix="*" class="prefix" v-model="personalFormWeight"
                            maxlength="3" hide-details @keydown.native="keyFilter($event, 'number')"></v-text-field>
                    </v-flex>
                    <v-flex xs6 md2 lg1 xl1 class="custom-space">
                        <v-text-field label="ส่วนสูง" prefix="*" class="prefix" v-model="personalFormHigh" maxlength="3"
                            hide-details @keydown.native="keyFilter($event, 'number')"></v-text-field>
                    </v-flex>
                    <v-flex xs6 md2 lg2 xl2 class="custom-space">
                        <v-text-field label="เบอร์โทรศัพท์" prefix="*" class="prefix" hide-details maxlength="12"
                            v-model="personalFormMobilePhone" @input="formatPhoneNumber"></v-text-field>
                    </v-flex>
                </v-layout>

                <v-layout row wrap
                    v-show="(this.$route.path === '/NewEmpForm' && this.infoLogin.ADgroup.includes('HR_Career')) || this.$route.path !== '/NewEmpForm'">
                    <v-flex xs12 md3 lg2 xl2 class="custom-space">
                        <v-text-field label="เลขบัตรประชาชน" prefix="*" class="prefix" hide-details maxlength="17"
                            v-model="personalFormIDNumber" @input="formatIDNumber"
                            prepend-icon="mdi-card-account-details-outline"></v-text-field>
                    </v-flex>
                    <v-flex xs6 md3 lg2 xl2 class="custom-space">
                        <v-menu ref="birthdayMenu" v-model="birthdayMenu" :close-on-content-click="false"
                            :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="formattedDate" readonly hide-details v-on="on">
                                    <template v-slot:label>
                                        <v-icon style="vertical-align: middle">mdi-calendar</v-icon> วันเกิด
                                    </template>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="birthdayDate" no-title scrollable :max="year"
                                @input="formatSelectedDate">
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="birthdayMenu = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="birthdayMenu = false">OK</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-flex>
                    <v-flex xs6 md3 lg1 xl1 class="custom-space">
                        <v-autocomplete label="เพศ" prefix="*" class="prefix" v-model="personalFormSex" :items="SexList"
                            item-text="sex_Desc" item-value="sex_Code" hide-details required></v-autocomplete>
                    </v-flex>

                    <v-flex xs6 md3 lg1 xl1 class="custom-space">
                        <v-autocomplete label="กรุ๊ปเลือด" prefix="*" class="prefix" hide-details
                            :items="BloodGroupList" v-model="personalFormBloodGroup" item-text="bloodDescription"
                            item-value="bloodCode"></v-autocomplete>
                    </v-flex>
                    <v-flex xs6 md2 lg1 xl1 class="custom-space">
                        <v-autocomplete label="เชือชาติ" prefix="*" class="prefix" hide-details :items="EthnicityList"
                            v-model="personalFormEthnicity" item-text="ethnicity_Desc"
                            item-value="ethnicity_Code"></v-autocomplete>
                    </v-flex>
                    <v-flex xs6 md2 lg1 xl1 class="custom-space">
                        <v-autocomplete label="สัญชาติ" prefix="*" class="prefix" hide-details :items="NationalityList"
                            v-model="personalFormNationality" item-text="nationality_Desc"
                            item-value="nationality_Code"></v-autocomplete>
                    </v-flex>
                    <v-flex xs6 md3 lg1 xl1 class="custom-space">
                        <v-autocomplete label="ศาสนา" prefix="*" class="prefix" hide-details :items="ReligionList"
                            v-model="personalFormReligion" item-text="religion_Desc"
                            item-value="religion_Code"></v-autocomplete>
                    </v-flex>
                    <v-flex xs6 md2 lg1 xl1 class="custom-space">
                        <v-autocomplete label="สถานะทหาร" prefix="*" class="prefix" hide-details :items="StamilitList"
                            v-model="personalFormStamilit" item-text="stamilit_Desc"
                            item-value="stamilit_Code"></v-autocomplete>
                    </v-flex>
                    <v-flex xs6 md3 lg2 xl2 class="custom-space">
                        <v-autocomplete label="สถานภาพ" prefix="*" class="prefix" hide-details
                            :items="PersonalStatusList" v-model="personalFormPsnStatus" item-text="personalStatus_Desc"
                            item-value="personalStatus_Code"></v-autocomplete>
                    </v-flex>

                </v-layout>

                <v-layout row wrap
                    v-show="(this.$route.path === '/NewEmpForm' && this.infoLogin.ADgroup.includes('HR_Career')) || this.$route.path !== '/NewEmpForm'">
                    <v-flex xs12 md12 lg4 xl4 class="custom-space">
                        <v-textarea rows="1" label="ที่อยู่" prefix="*" class="prefix" hide-details maxlength="255"
                            v-model="personalFormAddress" prepend-icon="mdi-home-outline"></v-textarea>
                    </v-flex>
                    <v-flex xs6 md4 lg2 xl2 class="custom-space">
                        <v-autocomplete label="จังหวัด" prefix="*" class="prefix" hide-details :items="ProvinceList"
                            item-text="province_TH" item-value="province_Code"
                            v-model="selectProvince"></v-autocomplete>
                    </v-flex>
                    <v-flex xs6 md4 lg2 xl2 class="custom-space">
                        <v-autocomplete :disabled="this.selectProvince == ''" label="เขต/อำเภอ" prefix="*"
                            class="prefix" hide-details :items="filteredDistrictList" item-text="district_TH"
                            item-value="district_Code" v-model="selectDistrict"></v-autocomplete>
                    </v-flex>
                    <v-flex xs6 md4 lg2 xl2 class="custom-space">
                        <v-autocomplete :disabled="(this.selectProvince == '' || this.selectDistrict == '')"
                            label="แขวง/ตำบล" prefix="*" class="prefix" hide-details :items="filteredSubDistrictList"
                            item-text="subDistrict_TH" v-model="selectSubDistrict"
                            item-value="subDistrict_Code"></v-autocomplete>
                    </v-flex>
                    <v-flex xs6 md4 lg1 xl1 class="custom-space">
                        <v-text-field label="รหัสไปรษณีย์" prefix="*" class="prefix" hide-details readonly
                            :value="filteredPostalCode"></v-text-field>
                    </v-flex>
                    <v-flex xs6 md4 lg1 xl1 class="custom-space">
                        <v-select label="ประเทศ" prefix="*" class="prefix" hide-details :items="CountryList"
                            v-model="personalFormCountry" item-text="country_Desc" item-value="country_Code"></v-select>
                    </v-flex>
                </v-layout>

                <v-layout class="mb-3" row wrap
                    v-show="(this.$route.path === '/NewEmpForm' && this.infoLogin.ADgroup.includes('HR_Career')) || this.$route.path !== '/NewEmpForm'">
                   <!--เพิ่มวันที่ 03/01/2025 -->
                    <v-flex xs12 md6 lg3 xl3 class="custom-space">
                    
                        <v-autocomplete label="ระดับการศึกษา" prefix="*" class="prefix" hide-details
                            :items="EducationalList" v-model="personalFormEducational" item-text="educational_Desc"
                            item-value="educational_Code" prepend-icon="mdi-school-outline"></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 md6 lg3 xl3 class="custom-space">
                        <v-autocomplete label="วุฒิการศึกษา" prefix="*" class="prefix" hide-details
                            :items="itemEducational" v-model="mEducational" item-text="educationalQualificationTH"
                            item-value="educationalQualificationCode" prepend-icon="mdi-school-outline"></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 md6 lg3 xl3 class="custom-space">
                        <v-autocomplete label="คณะ/สาขาวิชา" prefix="*" class="prefix" hide-details
                            :items="itemFaculty" v-model="mFaculty" item-text="languageCourseTH"
                            item-value="languageCourseCode" prepend-icon="mdi-school-outline"></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 md6 lg3 xl3 class="custom-space">
                        <v-autocomplete label="สถานศึกษา" prefix="*" class="prefix" hide-details :items="AcademyList"
                            v-model="personalFormAcademy" item-text="academy_Desc"
                            item-value="academy_Code"></v-autocomplete>
                    </v-flex>
                </v-layout>

                <v-layout align-center row wrap
                    v-show="(this.$route.path === '/NewEmpForm' && this.infoLogin.ADgroup.includes('HR_Career')) || this.$route.path !== '/NewEmpForm'">
                    <v-flex md12 lg4 xl4 class="custom-space">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <v-text-field class="inner-card-file" v-model="fileNameUserImg" ref="userimg" clearable
                                @click:clear="onClear" label="รูปถ่าย" flat readonly @change="validateFileUserImg" solo
                                hide-details background-color="#f4f4f4"></v-text-field>
                            <input type="file" id="userimg" ref="userimg" @change="validateFileUserImg"
                                accept=".pdf, .png, .jpg, .jpeg" />
                            <v-btn @click="triggerFileInput" color="#007fc4" class="my-btn-choose"
                                v-if="this.filePathUserImg == ''">
                                <v-icon color="#ffffff" class="pr-1" size="20">mdi-file-upload-outline</v-icon>
                                เลือกไฟล์
                            </v-btn>
                            <v-btn @click="openResume(filePathUserImg)" color="#fabe20" class="my-btn-open"
                                v-if="this.filePathUserImg != ''">
                                <v-icon color="#464646" class="pr-1" size="20">mdi-file-upload-outline</v-icon>
                                เปิดไฟล์
                            </v-btn>
                        </div>
                    </v-flex>
                    <v-flex md12 lg4 xl4 class="custom-space">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <v-text-field class="inner-card-file" v-model="fileNameIDcard" ref="idcard" clearable
                                @click:clear="onClearIDCard" label="สำเนาบัตรประชาชน" flat @change="validateFileIDcard"
                                readonly solo hide-details background-color="#f4f4f4"></v-text-field>
                            <input type="file" id="idcard" ref="idcard" @change="validateFileIDcard"
                                accept=".pdf, .png, .jpg, .jpeg" />
                            <v-btn @click="triggerFileInputIDCard" color="#007fc4" class="my-btn-choose"
                                v-if="this.filePathIDCard == ''">
                                <v-icon color="#ffffff" class="pr-1" size="20">mdi-file-upload-outline</v-icon>
                                เลือกไฟล์
                            </v-btn>
                            <v-btn @click="openResume(filePathIDCard)" color="#fabe20" class="my-btn-open"
                                v-if="this.filePathIDCard != ''">
                                <v-icon color="#464646" class="pr-1" size="20">mdi-file-upload-outline</v-icon>
                                เปิดไฟล์
                            </v-btn>
                        </div>
                    </v-flex>
                    <v-flex md12 lg4 xl4 class="custom-space">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <v-text-field class="inner-card-file" v-model="fileNameHouseReg" ref="housereg" clearable
                                @click:clear="onClearHouseReg" label="สำเนาทะเบียนบ้าน" flat
                                @change="validateFileHouseReg" readonly solo hide-details
                                background-color="#f4f4f4"></v-text-field>
                            <input type="file" id="housereg" ref="housereg" @change="validateFileHouseReg"
                                accept=".pdf, .png, .jpg, .jpeg" />
                            <v-btn @click="triggerFileInputHouseReg" color="#007fc4" class="my-btn-choose"
                                v-if="this.filePathHouseReg == ''">
                                <v-icon color="#ffffff" class="pr-1" size="20">mdi-file-upload-outline</v-icon>
                                เลือกไฟล์
                            </v-btn>
                            <v-btn @click="openResume(filePathHouseReg)" color="#fabe20" class="my-btn-open"
                                v-if="this.filePathHouseReg != ''">
                                <v-icon color="#464646" class="pr-1" size="20">mdi-file-upload-outline</v-icon>
                                เปิดไฟล์
                            </v-btn>
                        </div>
                    </v-flex>
                </v-layout>

                <v-layout class="mb-2" align-center row wrap
                    v-show="(this.$route.path === '/NewEmpForm' && this.infoLogin.ADgroup.includes('HR_Career')) || this.$route.path !== '/NewEmpForm'">
                    <v-flex md12 lg4 xl4 class="custom-space">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <v-text-field class="inner-card-file" v-model="fileNameEducation" ref="education" clearable
                                @click:clear="onClearEducation" label="วุฒิการศึกษา" flat
                                @change="validateFileEducation" readonly solo hide-details
                                background-color="#f4f4f4"></v-text-field>
                            <input type="file" id="education" ref="education" @change="validateFileEducation"
                                accept=".pdf, .png, .jpg, .jpeg" />
                            <v-btn @click="triggerFileInputEducation" color="#007fc4" class="my-btn-choose"
                                v-if="this.filePathEducation == ''">
                                <v-icon color="#ffffff" class="pr-1" size="20">mdi-file-upload-outline</v-icon>
                                เลือกไฟล์
                            </v-btn>
                            <v-btn @click="openResume(filePathEducation)" color="#fabe20" class="my-btn-open"
                                v-if="this.filePathEducation != ''">
                                <v-icon color="#464646" class="pr-1" size="20">mdi-file-upload-outline</v-icon>
                                เปิดไฟล์
                            </v-btn>
                        </div>
                    </v-flex>
                    <v-flex md12 lg4 xl4 class="custom-space">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <v-text-field class="inner-card-file" v-model="fileNameBookbank" ref="bookbank" clearable
                                @click:clear="onClearBookbank" label="หน้าสมุดบัญชี" flat readonly
                                @change="validateFileBookbank" solo hide-details
                                background-color="#f4f4f4"></v-text-field>
                            <input type="file" id="bookbank" ref="bookbank" @change="validateFileBookbank"
                                accept=".pdf, .png, .jpg, .jpeg" />
                            <v-btn @click="triggerFileInputBookbank" color="#007fc4" class="my-btn-choose"
                                v-if="this.filePathBookbank == ''">
                                <v-icon color="#ffffff" class="pr-1" size="20">mdi-file-upload-outline</v-icon>
                                เลือกไฟล์
                            </v-btn>
                            <v-btn @click="openResume(filePathBookbank)" color="#fabe20" class="my-btn-open"
                                v-if="this.filePathBookbank != ''">
                                <v-icon color="#464646" class="pr-1" size="20">mdi-file-upload-outline</v-icon>
                                เปิดไฟล์
                            </v-btn>
                        </div>
                    </v-flex>
                    <v-flex md12 lg4 xl4 class="pa-0">
                        <v-btn color="#007fc4" @click="otherFileDialog = true" dark style="margin-left: 11.25px;">
                            <v-icon>mdi-account-search</v-icon>ไฟล์แนบอื่นๆ
                        </v-btn>
                    </v-flex>
                </v-layout>

                <hr
                    v-show="(this.$route.path === '/NewEmpForm' && this.infoLogin.ADgroup.includes('HR_Career')) || this.$route.path !== '/NewEmpForm'">

                <v-card-actions>
                    <V-layout justify-end>
                        <v-btn color="#f8c849" @click="saveUserData"
                            v-show="(this.$route.path === '/NewEmpForm' && this.infoLogin.ADgroup.includes('HR_Career'))">บันทึกข้อมูล</v-btn>
                        <v-btn color="#f8c849" @click="saveUserData"
                            v-show="this.formStatus != 'COMPLETE' && this.$route.path != '/NewEmpForm'">บันทึกข้อมูล</v-btn>
                        <v-btn color="#007fc4" @click="submitUserData" style="color: white;"
                            v-if="this.formStatus != 'COMPLETE' && this.$route.path != '/NewEmpForm'">ส่งข้อมูล</v-btn>
                    </V-layout>
                </v-card-actions>
            </v-card>

            <v-snackbar color="#f8c849" v-model="snackbar" multi-line class="snackbar">
                <div style="color: black">
                    {{ alertMessage }}
                </div>
                <v-btn flat @click="snackbar = false" class="btn-snackbar-e" color="black">ปิด</v-btn>
            </v-snackbar>
        </div>

        <div v-if="loadingDialog">
            <Loading :value="loadingDialog" />
        </div>

        <v-dialog width="80%" v-model="otherFileDialog" persistent>
            <v-card>
                <v-card-title class="font-weight-bold primary--text pa-3">ไฟล์อื่นๆ</v-card-title>

                <v-alert :value="true" color="#f8c849" style="border-top: 4px solid black; border-bottom: 4px solid black;">
                    <span class="black--text"><v-icon color="black" class="pr-2">mdi-file-alert</v-icon>สำหรับแนบไฟล์อื่นๆ เช่น ใบขับขี่, ใบ สด.43, สำเนาทะเบียนรถ และเอกสารที่เกี่ยวข้อง เป็นต้น</span>
                </v-alert>

                <!-- File List Section -->
                <v-layout>
                    <v-flex xs12>
                        <v-card outlined class="px-3 pt-3" flat>
                            <ol v-if="rawFileOthers == ''">
                                <li v-for="(file, index) in fileNameOthers" :key="index">
                                    <v-icon color="primary" class="mr-2">insert_drive_file</v-icon>
                                    {{ file }}
                                </li>
                            </ol>
                            <ol v-if="rawFileOthers != ''">
                                <li v-for="(item, index) in tempFileOthers" :key="index">
                                    <v-icon color="primary" class="mr-2">insert_drive_file</v-icon>
                                    {{ item.split('Others/')[1] }}
                                </li>
                            </ol>
                        </v-card>
                    </v-flex>
                </v-layout>
                <!-- Buttons Section -->
                <v-card-actions>
                    <v-layout justify-space-between>
                        <input type="file" id="others" ref="others" @change="validateFileOthers" multiple
                        accept=".pdf, .png, .jpg, .jpeg" />
                        <v-btn outline color="yellow darken-2" class="mr-3" @click="triggerFileInputOthers" v-if="rawFileOthers == ''">
                            <v-icon class="mr-1">cloud_upload</v-icon> เลือกไฟล์
                    </v-btn>
                    <v-btn @click="rawFileOthers = ''" outline color="yellow darken-2" class="mr-3" v-if="rawFileOthers != ''">
                        <v-icon class="mr-1">mdi-file-upload-outline</v-icon>
                        อัพโหลดไฟล์ใหม่
                    </v-btn>
                    <v-btn color="#007fc4" dark @click="otherFileDialog = false">
                        <v-icon class="mr-1">check_circle</v-icon> ยืนยัน
                    </v-btn>
                </v-layout>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Loading from '../../components/core/Loading.vue'
import apiMasterData from '../../services/apiMasterData';
import { sync } from "vuex-pathify";
import apiService from '@/services/apiService';
import Swal from "sweetalert2";
import keyFilter from "@/plugins/keyFilter";

export default {
    components: {
        Loading,
    },

    data() {
        return {
            mFaculty: '',
            mEducational: '',
            itemFaculty:[],
            itemEducational: [],
            keyFilter,
            loadingDialog: false,
            birthdayDate: '2006-01-01',
            birthdayMenu: false,
            year: 0,
            BloodGroupList: [],
            EthnicityList: [],
            NationalityList: [],
            ReligionList: [],
            PersonalStatusList: [],
            StamilitList: [],
            ProvinceList: [],
            selectProvince: '',
            rawDistrictList: [],
            DistrictList: [],
            selectDistrict: '',
            rawSubDistrictList: [],
            SubDistrictList: [],
            CountryList: [],
            AcademyList: [],
            EducationalList: [],
            SexList: [],
            PrefixNameList: [],
            formattedDate: '',
            snackbar: false,
            remind: "",
            userimg: "",
            fileNameUserImg: "",
            fileTypeUserImg: "",
            idcard: "",
            fileNameIDcard: "",
            fileTypeIDcard: "",
            housereg: "",
            fileNameHouseReg: "",
            fileTypeHouseReg: "",
            education: "",
            fileNameEducation: "",
            fileTypeEducation: "",
            bookbank: "",
            fileNameBookbank: "",
            fileTypeBookbank: "",
            others: [],
            fileNameOthers: [],
            fileTypeOthers: "",
            personalFormTitle: "",
            personalFormName: "",
            personalFormSurName: "",
            personalFormNameEN: "",
            personalFormSurNameEN: "",
            personalFormNickname: "",
            personalFormWeight: "",
            personalFormHigh: "",
            personalFormMobilePhone: "",
            personalFormIDNumber: "",
            personalFormSex: "",
            personalFormBloodGroup: "",
            personalFormEthnicity: "",
            personalFormNationality: "",
            personalFormReligion: "",
            personalFormPsnStatus: "",
            personalFormStamilit: "",
            personalFormAddress: "",
            personalFormZipCode: "",
            personalFormCountry: "",
            personalFormAcademy: "",
            personalFormEducational: "",
            selectSubDistrict: "",
            filePathUserImg: "",
            filePathIDCard: "",
            filePathHouseReg: "",
            filePathEducation: "",
            filePathBookbank: "",
            alertMessage: "",
            formStatus: "",
            fileUserImageInServer: "",
            fileIDCardInServer: "",
            fileHouseRegistrationInServer: "",
            fileEducationInServer: "",
            fileBookbankInServer: "",
            otherFileDialog: "",
            rawFileOthers: "",
            tempFileOthers: []
        }
    },

    created() {
        this.year = (new Date().getFullYear() - 17).toString() + '-01-01';
        this.fetchBloodGroup();
        this.fetchEthnicity();
        this.fetchNationality();
        this.fetchReligion();
        this.fetchPersonalStatus();
        this.fetchStamilit();
        this.fetchProvince();
        this.fetchDistrict();
        this.fetchSubDistrict();
        this.fetchCountry();
        this.fetchAcademy();
        this.fetchEducational();
        this.fetchPrefixName();
        this.fetchSex();
        this.fetchEducationalQualification();
        this.fetchLanguageCourse();

        setTimeout(() => {
            this.getPersonalForm();
        }, 1000);
    },

    watch: {
        personalFormMobilePhone: {
            handler: 'formatPhoneNumber'
        },
        personalFormIDNumber: {
            handler: 'formatIDNumber'
        },
    },

    computed: {
        ...sync("*"),
        filteredDistrictList() {
            return this.rawDistrictList.filter((type) =>
                type.province_Code === this.selectProvince
            );
        },
        filteredSubDistrictList() {
            return this.rawSubDistrictList.filter((type) =>
                type.district_Code === this.selectDistrict && type.province_Code === this.selectProvince
            );
        },
        filteredPostalCode() {
            const filteredList = this.rawSubDistrictList.filter((type) =>
                type.subDistrict_Code === this.selectSubDistrict
            );
            return filteredList.length > 0 ? filteredList[0].postal_Code : "";
        },
    },

    methods: {
        async fetchEducationalQualification(){
    this.loadingDialog = true;
    try {
        const response = await apiMasterData.gEducationalQualification();
        this.loadingDialog = false; // แสดง Loader
        this.itemEducational = response.data.results;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchLanguageCourse(){
      this.loadingDialog = true;
      try {
        const response = await apiMasterData.gLanguageCourse();
        this.loadingDialog = false; // แสดง Loader
        this.itemFaculty = response.data.results;
      } catch (error) {
        console.error(error);
      }
},
        openResume(path) {
            window.open(path, '_blank'); // สั่งให้เบราว์เซอร์เปิดไฟล์ในแท็บใหม่
        },
        triggerFileInput() {
            this.$refs.userimg.click();
        },
        triggerFileInputIDCard() {
            this.$refs.idcard.click();
        },
        triggerFileInputHouseReg() {
            this.$refs.housereg.click();
        },
        triggerFileInputEducation() {
            this.$refs.education.click();
        },
        triggerFileInputBookbank() {
            this.$refs.bookbank.click();
        },
        triggerFileInputOthers() {
            this.$refs.others.click();
        },
        getFile() {
            this.userimg = this.$refs.userimg.files[0];
            this.idcard = this.$refs.idcard.files[0];
            this.housereg = this.$refs.housereg.files[0];
            this.education = this.$refs.education.files[0];
            this.bookbank = this.$refs.bookbank.files[0];
            this.others = Array.from(this.$refs.others.files);
        },

        validateFileUserImg(event) {
            const file = event.target.files[0];
            if (file == undefined) {
                this.fileNameUserImg = "";
            } else {
                this.fileNameUserImg = file.name;
                this.fileTypeUserImg = file.type;
            }
            const validTypes = ["application/pdf", "image/png", "image/jpeg"];
            if (!validTypes.includes(this.fileTypeUserImg)) {
                this.alertMessage = "สามารถใส่ได้แค่ไฟล์ PDF, PNG, JPG และ JPEG";
                this.snackbar = true;
                event.target.value = "";
                this.fileNameUserImg = "";
            }
        },
        validateFileIDcard(event) {
            const file = event.target.files[0];
            if (file == undefined) {
                this.fileNameIDcard = "";
            } else {
                this.fileNameIDcard = file.name;
                this.fileTypeIDcard = file.type;
            }
            const validTypes = ["application/pdf", "image/png", "image/jpeg"];
            if (!validTypes.includes(this.fileTypeIDcard)) {
                this.alertMessage = "สามารถใส่ได้แค่ไฟล์ PDF, PNG, JPG และ JPEG";
                this.snackbar = true;
                event.target.value = "";
                this.fileNameIDcard = "";
            }
        },
        validateFileHouseReg(event) {
            const file = event.target.files[0];
            if (file == undefined) {
                this.fileNameHouseReg = "";
            } else {
                this.fileNameHouseReg = file.name;
                this.fileTypeHouseReg = file.type;
            }
            const validTypes = ["application/pdf", "image/png", "image/jpeg"];
            if (!validTypes.includes(this.fileTypeHouseReg)) {
                this.alertMessage = "สามารถใส่ได้แค่ไฟล์ PDF, PNG, JPG และ JPEG";
                this.snackbar = true;
                event.target.value = "";
                this.fileNameHouseReg = "";
            }
        },
        validateFileEducation(event) {
            const file = event.target.files[0];
            if (file == undefined) {
                this.fileNameEducation = "";
            } else {
                this.fileNameEducation = file.name;
                this.fileTypeEducation = file.type;
            }
            const validTypes = ["application/pdf", "image/png", "image/jpeg"];
            if (!validTypes.includes(this.fileTypeEducation)) {
                this.alertMessage = "สามารถใส่ได้แค่ไฟล์ PDF, PNG, JPG และ JPEG";
                this.snackbar = true;
                event.target.value = "";
                this.fileNameEducation = "";
            }
        },
        validateFileBookbank(event) {
            const file = event.target.files[0];
            if (file == undefined) {
                this.fileNameBookbank = "";
            } else {
                this.fileNameBookbank = file.name;
                this.fileTypeBookbank = file.type;
            }
            const validTypes = ["application/pdf", "image/png", "image/jpeg"];
            if (!validTypes.includes(this.fileTypeBookbank)) {
                this.alertMessage = "สามารถใส่ได้แค่ไฟล์ PDF, PNG, JPG และ JPEG";
                this.snackbar = true;
                event.target.value = "";
                this.fileNameBookbank = "";
            }
        },
        validateFileOthers(event) {
            const files = Array.from(event.target.files);
            const validTypes = ["application/pdf", "image/png", "image/jpeg"];

            this.fileNameOthers = [];
            this.fileTypeOthers = [];

            files.forEach((file) => {
                if (validTypes.includes(file.type)) {
                    this.fileNameOthers.push(file.name);
                    this.fileTypeOthers.push(file.type);
                } else {
                    this.alertMessage = "สามารถใส่ได้แค่ไฟล์ PDF, PNG, JPG และ JPEG";
                    this.snackbar = true;
                }
            });

            if (this.alertMessage) {
                event.target.value = "";
            }
        },

        formatSelectedDate(date) {
            const [year, month, day] = date.split('-');
            this.formattedDate = `${day}/${month}/${year}`; // จัดรูปแบบวันที่เป็น dd/MM/yyyy
            this.menu = false;
        },
        formatPhoneNumber() {
            let cleaned = ('' + this.personalFormMobilePhone).replace(/\D/g, '');

            if (cleaned.length <= 3) {
                this.personalFormMobilePhone = cleaned;
            } else if (cleaned.length <= 6) {
                this.personalFormMobilePhone = cleaned.slice(0, 3) + '-' + cleaned.slice(3);
            } else {
                this.personalFormMobilePhone = cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6);
            }
        },
        formatIDNumber() {
            let cleaned = ('' + this.personalFormIDNumber).replace(/\D/g, '');

            if (cleaned.length <= 1) {
                this.personalFormIDNumber = cleaned;
            } else if (cleaned.length <= 5) {
                this.personalFormIDNumber = cleaned.slice(0, 1) + '-' + cleaned.slice(1);
            } else if (cleaned.length <= 10) {
                this.personalFormIDNumber = cleaned.slice(0, 1) + '-' + cleaned.slice(1, 5) + '-' + cleaned.slice(5, 10);
            } else if (cleaned.length <= 12) {
                this.personalFormIDNumber = cleaned.slice(0, 1) + '-' + cleaned.slice(1, 5) + '-' + cleaned.slice(5, 10) + '-' + cleaned.slice(10, 12);
            } else {
                this.personalFormIDNumber = cleaned.slice(0, 1) + '-' + cleaned.slice(1, 5) + '-' + cleaned.slice(5, 10) + '-' + cleaned.slice(10, 12) + '-' + cleaned.slice(12);
            }
        },

        async fetchBloodGroup() {
            try {
                const response = await apiMasterData.getBloodGroup();
                this.BloodGroupList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchEthnicity() {
            try {
                const response = await apiMasterData.getEthnicity();
                this.EthnicityList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchNationality() {
            try {
                const response = await apiMasterData.getNationality();
                this.NationalityList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchReligion() {
            try {
                const response = await apiMasterData.getReligion();
                this.ReligionList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchPersonalStatus() {
            try {
                const response = await apiMasterData.getPersonalStatus();
                this.PersonalStatusList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchStamilit() {
            try {
                const response = await apiMasterData.getStamilit();
                this.StamilitList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchProvince() {
            try {
                const response = await apiMasterData.getProvince();
                this.ProvinceList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchDistrict() {
            try {
                const response = await apiMasterData.getDistrict();
                this.rawDistrictList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchSubDistrict() {
            try {
                const response = await apiMasterData.getSubDistrict();
                this.rawSubDistrictList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchCountry() {
            try {
                const response = await apiMasterData.getCountry();
                this.CountryList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchAcademy() {
            try {
                const response = await apiMasterData.getAcademy();
                this.AcademyList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchEducational() {
            try {
                const response = await apiMasterData.getEducational();
                this.EducationalList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchPrefixName() {
            try {
                const response = await apiMasterData.getPrefixName();
                this.PrefixNameList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchSex() {
            try {
                const response = await apiMasterData.getSex();
                this.SexList = response.data;
            } catch (error) {
                console.error(error);
            }
        },

        onClear() {
            this.$refs.userimg.value = "";
            this.filePathUserImg = "";
        },
        onClearIDCard() {
            this.$refs.idcard.value = "";
            this.filePathIDCard = "";
        },
        onClearHouseReg() {
            this.$refs.housereg.value = "";
            this.filePathHouseReg = "";
        },
        onClearEducation() {
            this.$refs.education.value = "";
            this.filePathEducation = "";
        },
        onClearBookbank() {
            this.$refs.bookbank.value = "";
            this.filePathBookbank = "";
        },

        validateForm() {
            if (this.personalFormNickname == '') {
                this.snackbar = true;
                this.alertMessage = 'กรุณากรอกชื่อเล่น';
                return;
            } else if (this.personalFormWeight == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณากรอกน้ำหนัก";
                return;
            } else if (this.personalFormHigh == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณากรอกส่วนสูง";
                return;
            } else if (this.personalFormSex == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณากรอกเพศ";
                return;
            } else if (this.personalFormIDNumber == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณากรอกเลขบัตรประชาชน";
                return;
            } else if (this.formattedDate == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกวันเกิด";
                return;
            } else if (this.personalFormBloodGroup == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกกรุ๊ปเลือด";
                return;
            } else if (this.personalFormEthnicity == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกเชื้อชาติ";
                return;
            } else if (this.personalFormNationality == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกสัญชาติ";
                return;
            } else if (this.personalFormPsnStatus == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกสถานภาพ";
                return;
            } else if (this.personalFormStamilit == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกสถานะทหาร";
                return;
            } else if (this.personalFormAddress == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณากรอกข้อมูลที่อยู่";
                return;
            } else if (this.selectProvince == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกจังหวัด";
                return;
            } else if (this.selectDistrict == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกเขต/อำเภอ";
                return;
            } else if (this.selectSubDistrict == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกแขวง/ตำบล";
                return;
            } else if (this.filteredPostalCode == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณากรอกรหัสไปรษณีย์";
                return;
            } else if (this.personalFormCountry == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกประเทศ";
                return;
            } else if (this.personalFormAcademy == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกสถานศึกษา";
                return;
            } else if (this.personalFormEducational == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกระดับการศึกษา";
                return;
            } else if (this.mEducational == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกวุฒิการศึกษา";
                return;
            } else if (this.mFaculty == '') {
                this.snackbar = true;
                this.alertMessage = "กรุณาเลือกคณะ/สาขาวิชา";
                return;
            } else if (this.fileUserImageInServer == '' && this.fileNameUserImg == undefined) {
                this.snackbar = true;
                this.alertMessage = "คุณยังไม่ได้อัพโหลดไฟล์รูปถ่ายหน้าตรง";
                return;
            } else if (this.fileIDCardInServer == '' && this.fileNameIDcard == undefined) {
                this.snackbar = true;
                this.alertMessage = "คุณยังไม่ได้อัพโหลดไฟล์สำเนาบัตรประชาชน";
                return;
            } else if (this.fileHouseRegistrationInServer == '' && this.fileNameHouseReg == undefined) {
                this.snackbar = true;
                this.alertMessage = "คุณยังไม่ได้อัพโหลดไฟล์สำเนาทะเบียนบ้าน";
                return;
            } else if (this.fileEducationInServer == '' && this.fileNameEducation == undefined) {
                this.snackbar = true;
                this.alertMessage = "คุณยังไม่ได้อัพโหลดไฟล์วุฒิการศึกษา";
                return;
            } else if (this.fileBookbankInServer == '' && this.fileNameBookbank == undefined) {
                this.snackbar = true;
                this.alertMessage = "คุณยังไม่ได้อัพโหลดไฟล์หน้าสมุดบัญชี";
                return;
            }
            this.confirmSubmitUserData();
        },

        async saveUserData() {
            this.getFile();
            let cleanIDNumber = this.personalFormIDNumber.replace(/-/g, '');
            const formData = new FormData();
            formData.append("Employment_ID", this.$route.query.EmployementID ? this.$route.query.EmployementID : localStorage.getItem('selectEmployment'));
            formData.append("Employee_Title", this.personalFormTitle);
            formData.append("Employee_Name", this.personalFormName);
            formData.append("Employee_Surname", this.personalFormSurName);
            formData.append("Employee_NameEN", this.personalFormNameEN);
            formData.append("Employee_SurnameEN", this.personalFormSurNameEN);
            formData.append("Employee_NickName", this.personalFormNickname);
            formData.append("Employee_Weight", this.personalFormWeight);// เพิ่มวันที่ 21.11.2024
            formData.append("Employee_High", this.personalFormHigh);// เพิ่มวันที่ 21.11.2024
            formData.append("Employee_EducationalQualification", this.mEducational);// เพิ่มวันที่ 03.01.2025
            formData.append("Employee_LanguageCourse", this.mFaculty);// เพิ่มวันที่ 03.01.2025
            formData.append("Employee_Sex", this.personalFormSex);
            formData.append("Employee_IDNumber", cleanIDNumber);
            formData.append("Employee_Birthday", this.formattedDate);
            formData.append("Employee_BloodGroup", this.personalFormBloodGroup);
            formData.append("Employee_Ethnicity", this.personalFormEthnicity);
            formData.append("Employee_Nationality", this.personalFormNationality);
            formData.append("Employee_Religion", this.personalFormReligion);
            formData.append("Employee_PersonalStatus", this.personalFormPsnStatus);
            formData.append("Employee_Stamilit", this.personalFormStamilit);
            formData.append("Employee_Address", this.personalFormAddress);
            formData.append("Employee_Province", this.selectProvince);
            formData.append("Employee_District", this.selectDistrict);
            formData.append("Employee_SubDistrict", this.selectSubDistrict);
            formData.append("Employee_ZipCode", this.filteredPostalCode);
            formData.append("Employee_Country", this.personalFormCountry);
            formData.append("Employee_Academy", this.personalFormAcademy);
            formData.append("Employee_Educational", this.personalFormEducational);
            formData.append("Employee_UserImage", this.userimg ? this.userimg : null);
            formData.append("Employee_IDCard", this.idcard ? this.idcard : null);
            formData.append("Employee_HouseRegistration", this.housereg ? this.housereg : null);
            formData.append("Employee_Education", this.education ? this.education : null);
            formData.append("Employee_Bookbank", this.bookbank ? this.bookbank : null);
            if (this.others && this.others.length > 0) {
                this.others.forEach((file) => {
                    formData.append("Employee_OtherFiles", file); // ไม่ต้องใช้ index ในชื่อ
                });
            } else {
                formData.append("Employee_OtherFiles", null); // เพิ่มค่า null หากไม่มีไฟล์
            }
            formData.append("FormStatus", 'IN PROCESS')

            this.loadingDialog = true;
            try {
                const response = await apiService.postEmployeePersonalData(formData);
                console.log('Response:', response.data);

                this.loadingDialog = false;

                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'บันทึกข้อมูลสำเร็จ',
                    icon: 'success',
                    confirmButtonText: 'ตกลง',
                    allowOutsideClick: false,
                });
                this.getPersonalForm();
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async submitUserData() {
            Swal.fire({
                title: 'คุณแน่ใจหรือไม่ว่าต้องการส่งข้อมูล?',
                text: 'กรุณาตรวจสอบข้อมูลให้ถูกต้อง เนื่องจากหลังจากส่งแล้วจะไม่สามารถแก้ไขได้',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.validateForm();
                }
            });
        },
        async confirmSubmitUserData() {
            this.getFile();
            let cleanIDNumber = this.personalFormIDNumber.replace(/-/g, '');
            const formData = new FormData();
            formData.append("Employment_ID", this.$route.query.EmployementID);
            formData.append("Employee_Title", this.personalFormTitle);
            formData.append("Employee_Name", this.personalFormName);
            formData.append("Employee_Surname", this.personalFormSurName);
            formData.append("Employee_NameEN", this.personalFormNameEN);
            formData.append("Employee_SurnameEN", this.personalFormSurNameEN);
            formData.append("Employee_NickName", this.personalFormNickname);
            formData.append("Employee_Weight", this.personalFormWeight);// เพิ่มวันที่ 21.11.2024
            formData.append("Employee_High", this.personalFormHigh);// เพิ่มวันที่ 21.11.2024
            formData.append("Employee_EducationalQualification", this.mEducational);// เพิ่มวันที่ 03.01.2025
            formData.append("Employee_LanguageCourse", this.mFaculty);// เพิ่มวันที่ 03.01.2025
            formData.append("Employee_Sex", this.personalFormSex);
            formData.append("Employee_IDNumber", cleanIDNumber);
            formData.append("Employee_Birthday", this.formattedDate);
            formData.append("Employee_BloodGroup", this.personalFormBloodGroup);
            formData.append("Employee_Ethnicity", this.personalFormEthnicity);
            formData.append("Employee_Nationality", this.personalFormNationality);
            formData.append("Employee_Religion", this.personalFormReligion);
            formData.append("Employee_PersonalStatus", this.personalFormPsnStatus);
            formData.append("Employee_Stamilit", this.personalFormStamilit);
            formData.append("Employee_Address", this.personalFormAddress);
            formData.append("Employee_Province", this.selectProvince);
            formData.append("Employee_District", this.selectDistrict);
            formData.append("Employee_SubDistrict", this.selectSubDistrict);
            formData.append("Employee_ZipCode", this.filteredPostalCode);
            formData.append("Employee_Country", this.personalFormCountry);
            formData.append("Employee_Academy", this.personalFormAcademy);
            formData.append("Employee_Educational", this.personalFormEducational);
            formData.append("Employee_UserImage", this.userimg ? this.userimg : null);
            formData.append("Employee_IDCard", this.idcard ? this.idcard : null);
            formData.append("Employee_HouseRegistration", this.housereg ? this.housereg : null);
            formData.append("Employee_Education", this.education ? this.education : null);
            formData.append("Employee_Bookbank", this.bookbank ? this.bookbank : null);
            formData.append("FormStatus", 'COMPLETE')

            this.loadingDialog = true;
            try {
                const response = await apiService.postEmployeePersonalData(formData);
                console.log('Response:', response.data);
                this.loadingDialog = false;
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'ส่งข้อมูลเข้าสู่ระบบสำเร็จ',
                    icon: 'success',
                    confirmButtonText: 'ตกลง',
                    allowOutsideClick: false,
                });
                this.getPersonalForm();
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getPersonalForm() {
            const id = this.$route.query.EmployeeID !== undefined
                ? { Employment_ID: btoa(this.myAssetID[0].employment_ID) }
                : { Employment_ID: this.$route.query.EmployementID == undefined ? localStorage.getItem('selectEmployment') : this.$route.query.EmployementID };
            try {
                const response = await apiService.getEmploymenPersonalData(id);
                this.groupPeoplePlus = response.data
                this.personalFormTitle = response.data.employee_Title
                this.personalFormName = response.data.employee_Name
                this.personalFormSurName = response.data.employee_Surname
                this.personalFormNameEN = response.data.employee_NameEN
                this.firstnameADs = response.data.employee_NameEN
                this.personalFormSurNameEN = response.data.employee_SurnameEN
                this.surnameADs = response.data.employee_SurnameEN
                this.personalFormNickname = response.data.employee_NickName
                this.personalFormWeight = response.data.employee_Weight // เพิ่มวันที่ 21.11.2024
                this.personalFormHigh = response.data.employee_High // เพิ่มวันที่ 21.11.2024
                this.mEducational = response.data.employee_EducationalQualification // เพิ่มวันที่ 03.01.2025
                this.mFaculty = response.data.employee_LanguageCourse // เพิ่มวันที่ 03.01.2025
                this.personalFormMobilePhone = response.data.mobilePhone
                this.mobileADs = response.data.mobilePhone
                this.personalFormSex = response.data.employee_Sex
                this.personalFormIDNumber = response.data.employee_IDNumber
                this.formattedDate = response.data.employee_Birthday
                this.personalFormBloodGroup = response.data.employee_BloodGroup
                this.personalFormEthnicity = response.data.employee_Ethnicity
                this.personalFormNationality = response.data.employee_Nationality
                this.personalFormReligion = response.data.employee_Religion
                this.personalFormPsnStatus = response.data.employee_PersonalStatus
                this.personalFormStamilit = response.data.employee_Stamilit
                this.personalFormAddress = response.data.employee_Address
                this.selectProvince = response.data.employee_Province
                this.selectDistrict = response.data.employee_District
                this.selectSubDistrict = response.data.employee_SubDistrict
                this.personalFormZipCode = response.data.employee_ZipCode
                if (response.data.employee_Country != '') {
                    this.personalFormCountry = response.data.employee_Country
                } else {
                    this.personalFormCountry = '662'
                }
                this.personalFormAcademy = response.data.employee_Academy
                this.personalFormEducational = response.data.employee_Educational
                this.fileUserImageInServer = response.data.eMployee_UserImage
                this.filePathUserImg = response.data.eMployee_UserImage
                this.fileNameUserImg = response.data.eMployee_UserImage.split('UserImage/')[1]
                this.fileIDCardInServer = response.data.employee_IDCard
                this.filePathIDCard = response.data.employee_IDCard
                this.fileNameIDcard = response.data.employee_IDCard.split('IDCard/')[1]
                this.fileHouseRegistrationInServer = response.data.employee_HouseRegistration
                this.filePathHouseReg = response.data.employee_HouseRegistration
                this.fileNameHouseReg = response.data.employee_HouseRegistration.split('HouseRegistration/')[1]
                this.fileEducationInServer = response.data.employee_Education
                this.filePathEducation = response.data.employee_Education
                this.fileNameEducation = response.data.employee_Education.split('Education/')[1]
                this.fileBookbankInServer = response.data.employee_Bookbank
                this.filePathBookbank = response.data.employee_Bookbank
                this.fileNameBookbank = response.data.employee_Bookbank.split('Bookbank/')[1]
                this.rawFileOthers = response.data.employee_Others
                this.formStatus = response.data.formStatus
                this.consentStatus = response.data.consent

                this.tempFileOthers = this.rawFileOthers.split(", ")

                this.educationalName = this.EducationalList.filter((type) => type.educational_Code == this.personalFormEducational)[0].educational_Desc
                this.academyName = this.AcademyList.filter((type) => type.academy_Code == this.personalFormAcademy)[0].academy_Desc
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        },
    }
}
</script>

<style>
.prefix {
    text-align: right;
    padding-right: 4px;
    color: red;
}

.custom-file-upload {
    border-radius: 4px;
    border: none;
    white-space: nowrap;
    padding: 10px;
    cursor: pointer;
    background-color: #007fc4;
    color: rgb(255, 255, 255);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 15px;
}

input[type="file"] {
    display: none;
}

.inner-card-file {
    padding: 1rem;
    background-color: #f4f4f4;
    border: 1px solid #c9c3c3;
    border-radius: 4px;
}

.custom-space {
    margin: 10px 0px;
}

.my-btn-open {
    color: rgb(70, 70, 70) !important;
}

.my-btn-choose {
    color: rgb(255, 255, 255) !important;
}

.snackbar {
    font-size: 17px;
}

.btn-snackbar-e {
    font-weight: bold;
    font-size: 17px;
    align-items: center;
    color: black;
}

.custom-chip {
    background-color: #f8c849;
    border-radius: 15px;
    padding: 5px 12.5px 5px 12.5px;
    display: flex;
    align-items: center;
}

.icon-with-background {
    background-color: #007fc4;
    padding: 4px;
    border-radius: 5px;
    margin-left: 7.5px;
}

.v-list__tile {
    padding: 8px
}

@media (max-width: 600px) {
    .custom-space {
        margin: 7.5px 0px;
    }

    .v-list__tile {
        padding: 0px
    }
}

@media (max-width: 1400px) {
    .custom-file-upload {
        border-radius: 4px;
        border: none;
        white-space: nowrap;
        padding: 7.5px;
        cursor: pointer;
        background-color: #007fc4;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 15px;
    }
}
</style>