<template>
    <v-card class="ma-5 pa-5">
        <div class="font-head">
            <v-icon style="font-size: 32.5px; margin-right: 10px;">mdi-text-box</v-icon>
            ใบสมัครงาน
        </div>

        <v-form ref="form" v-model="valid">
            <v-layout row wrap align-center justify-center>
                <v-flex sm2 md6 lg6 xl6>
                    <div class="space-label">
                        <v-icon>mdi-briefcase-account</v-icon>
                        <span style="padding-left: 0.2em; font-size: 14px">ตำแหน่ง</span>
                    </div>
                    <v-text-field type="text" v-model="PositionEmployment" readonly solo hide-details flat
                    background-color="#f5fafd" class="inner-card-blue"></v-text-field>
                </v-flex>
            </v-layout>

            <v-layout style="margin-top: 1rem" row wrap align-center justify-center>
                <v-flex xs12 sm2 md6 lg6 xl6>
                    <div class="d-flex">
                        <div class="space-label pr-2">
                            <v-icon>mdi-account</v-icon>
                            <span style="padding-left: 0.2em; font-size: 14px">ชื่อ</span>
                            <v-autocomplete v-model="title" :items="vse" solo hide-details label="คำนำหน้า" flat
                            @change="updateTitleEN" background-color="#f5fafd" class="inner-card-blue"></v-autocomplete>
                        </div>
                        
                        <div class="space-label pr-2 mt-4">
                        <v-text-field v-model="firstname" maxlength="40" @keydown.native="keyFilter($event, 'Th')"
                        solo flat hide-details label="ชื่อ (ไทย)" background-color="#f5fafd" class="inner-card-blue"></v-text-field>
                        </div>

                        <div class="space-label mt-4">
                        <v-text-field v-model="lastname" maxlength="40" @keydown.native="keyFilter($event, 'Th')"
                        solo flat hide-details label="นามสกุล (ไทย)" background-color="#f5fafd" class="inner-card-blue"></v-text-field>
                        </div>
                    </div>
                </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-center style="margin-top: 1rem">
                <v-flex xs12 sm2 md6 lg6 xl6>
                    <div class="d-flex">
                        <div class="space-label pr-2">    
                            <v-autocomplete v-model="titleEN" :items="vse3" solo hide-details label="Prefix"
                            readonly flat background-color="#f5fafd" class="inner-card-blue"></v-autocomplete>
                        </div>
                        
                        <div class="space-label pr-2">
                        <v-text-field v-model="firstnameEN" maxlength="40" @keydown.native="keyFilter($event, 'En')"
                        solo flat hide-details label="First Name" background-color="#f5fafd" class="inner-card-blue"></v-text-field>
                        </div>

                        <div class="space-label">
                        <v-text-field v-model="lastnameEN" maxlength="40" @keydown.native="keyFilter($event, 'En')"
                        solo flat hide-details label="Last Name" background-color="#f5fafd" class="inner-card-blue"></v-text-field>
                        </div>
                    </div>
                </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-center style="margin-top: 1rem">
                <v-flex xs12 sm2 md3 lg3 xl3>
                    <div class="space-label">
                        <v-icon>mdi-email</v-icon>
                        <span style="padding-left: 0.2em; font-size: 14px">อีเมล</span>
                    </div>
                        <v-text-field v-model="email" type="email" @keydown.native="keyFilterEmail($event, 'emailV')"
                         flat hide-details label="อีเมล" solo background-color="#f5fafd" class="inner-card-blue"></v-text-field>
                </v-flex>
                <v-flex xs12 sm2 md3 lg3 xl3>
                    <div class="space-label">
                        <v-icon>mdi-phone</v-icon>
                        <span style="padding-left: 0.2em; font-size: 14px">โทรศัพท์</span>
                    </div>
                        <v-text-field v-model="phone" type="text" maxlength="10"
                            @keydown.native="keyFilter($event, 'number')" solo hide-details
                            label="หมายเลขที่สามารถติดต่อได้" background-color="#f5fafd" class="inner-card-blue" flat>
                        </v-text-field>
                </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-center style="margin-top: 1rem">
                <v-flex xs12 sm2 md6 lg6 xl6>
                    <div class="space-label">
                        <v-icon>mdi-bullhorn</v-icon>
                        <span style="padding-left: 0.2em; font-size: 14px">คุณได้รับข่าวสารการสมัครจากช่องทางไหน ?</span>
                    </div>
                        <v-select v-model="social" :items="vse2" solo background-color="#f5fafd" class="inner-card-blue" hide-details flat></v-select>
                </v-flex>
            </v-layout>

            <v-layout justify-center style="margin-top: 1rem">
                <v-flex xs12 sm2 md6 lg6 xl6>
                    <v-layout justify-end>
                        <v-btn color="#007fc4" dark @click="checkf">ยืนยัน</v-btn>
                        <v-btn color="yellow darken-2" @click="reset">ล้างข้อมูล</v-btn>
                    </v-layout>
                    </v-flex>
            </v-layout>
        </v-form>

        <v-snackbar color="#007fc4" v-model="snackbar" multi-line class="snackbar">
            {{ remind }}
            <v-btn flat @click="snackbar = false" class="btn-snackbar">ปิด</v-btn>
        </v-snackbar>

        <div v-if="loadingDialog">
            <Loading :value="loadingDialog" />
        </div>
    </v-card>
</template>

<script>
import keyFilter from "@/plugins/keyFilter";
import Swal from "sweetalert2";
import Loading from "../../components/core/Loading";
import { sync } from "vuex-pathify";
import apiService from "@/services/apiService";
import { ref } from "vue";

export default {
    components: {
        Loading,
    },

    setup() {
        const pdfUrl = ref(
            "https://webapps.ip-one.com/IP1Career/pdf/Privacy_Applicant_v1.0.pdf"
        );
        const currentPage = ref(1);
        const pageCount = ref(0);

        const nextPage = () => {
            if (currentPage.value < pageCount.value) {
                currentPage.value += 1;
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value -= 1;
            }
        };

        return {
            pdfUrl,
            currentPage,
            pageCount,
            nextPage,
            prevPage,
        };
    },

    data() {
        return {
            snackbar: false,
            keyFilter,
            title: "",
            firstname: "",
            lastname: "",
            titleEN: "",
            firstnameEN: "",
            lastnameEN: "",
            phone: "",
            email: "",
            social: "Jobsdb",
            consent: "",
            PositionEmployment: 'Others',
            remind: "",
            valid: true,
            submitClicked: false,
            vse: ["นาย", "นาง", "นางสาว", "ว่าที่ร้อยตรี"],
            vse2: ["Facebook", "Instagram", "Tiktok", "Jobsdb", "JobThai", "อื่นๆ"],
            vse3: ["Mr.", "Mrs.", "Miss", "Acting Sub Lt."],
            pageLangauge: "th",
            loadingDialog: false,
            config: {
                toolbar: false,
            },
        };
    },

    computed: {
        ...sync("*"),
    },

    methods: {
        updateTitleEN() {
            if (this.title == "นาย") {
                this.titleEN = "Mr.";
            }
            if (this.title == "นางสาว") {
                this.titleEN = "Miss";
            }
            if (this.title == "นาง") {
                this.titleEN = "Mrs.";
            }
            if (this.title == "ว่าที่ร้อยตรี") {
                this.titleEN = "Acting Sub Lt.";
            }
        },

        chDialog() {
            if (this.checkboxA == true) {
                this.dialog = true;
            } else {
                this.dialog = false;
            }
        },

        checkf() {
            const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (this.title.length < 1) {
                this.remind = "กรุณาเลือกคำนำหน้า";
                this.snackbar = true;
                return;
            } else if (this.firstname.length < 1) {
                this.remind = "กรุณากรอกชื่อ";
                this.snackbar = true;
                return;
            } else if (this.lastname.length < 1) {
                this.remind = "กรุณากรอกนามสกุล";
                this.snackbar = true;
                return;
            } else if (this.firstnameEN.length < 1) {
                this.remind = "กรุณากรอกชื่อภาษาอังกฤษ";
                this.snackbar = true;
                return;
            } else if (this.lastnameEN.length < 1) {
                this.remind = "กรุณากรอกนามสกุลภาษาอังกฤษ";
                this.snackbar = true;
                return;
            } else if (this.email.length < 1) {
                this.remind = "กรุณากรอกอีเมล";
                this.snackbar = true;
                return;
            } else if (!this.email.match(regex)) {
                this.remind = "กรุณากรอกอีเมลที่ถูกต้อง";
                this.snackbar = true;
                return;
            } else if (this.phone.length != 10) {
                this.remind = "กรุณาใส่เบอร์โทรศัพท์ 10 หลัก";
                this.snackbar = true;
                return;
            } else if (this.social.length < 1) {
                this.remind = "กรุณาเลือกช่องทางการได้รับข่าวสารการสมัคร";
                this.snackbar = true;
                return;
            }
            this.submitForm();
        },

        keyFilterEmail(event, type) {
            if (
                type === "emailV" &&
                !event.key.match(/^[a-zA-Z0-9@.,-\_]+$/) &&
                event.key !== "Backspace" &&
                event.key !== "Tab" &&
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowRight"
            ) {
                event.preventDefault(); // ป้องกันการป้อนข้อมูลที่ไม่ต้องการ
            }
        },

        async submitForm() {
            const consent = "N";
            const version = '1.1';
            const formStatus = "OFFERING";

            const jsonData = {
                First_Name: this.firstname,
                Last_Name: this.lastname,
                Title: this.title,
                First_Name_EN: this.firstnameEN,
                Last_Name_EN: this.lastnameEN,
                Title_EN: this.titleEN,
                Email: this.email,
                Phone: this.phone,
                Position_Name: this.PositionEmployment,
                Social: this.social,
                Consent: consent,
                Status: formStatus,
                Consent_Version: version,
                ApproveBy: this.infoLogin.ADempId ? this.infoLogin.ADempId : localStorage.getItem('currentEmpID')
            };

            this.loadingDialog = true; // แสดง Loader
            try {
                const response = await apiService.postEmployment(jsonData);
                console.log("Response:", response.data);

                this.loadingDialog = false; // ซ่อน Loader

                Swal.fire({
                    title: "สำเร็จ!",
                    text: "เพิ่มข้อมูลผู้สมัครลงไปใน Employment สำเร็จ!",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                    allowOutsideClick: false,
                });

                this.firstname = ''
                this.lastname = ''
                this.title = ''
                this.firstnameEN = ''
                this.lastnameEN = ''
                this.titleEN = ''
                this.email = ''
                this.phone = ''
                this.social = ''
            } catch (error) {
                console.error("Error:", error);

                Swal.fire({
                    title: "ไม่สำเร็จ!",
                    text: "การสมัครไม่สำเร็จ!",
                    icon: "error",
                    confirmButtonText: "ตกลง",
                    allowOutsideClick: false,
                });
            }
        },

        reset() {
            this.title = "";
            this.firstname = "";
            this.lastname = "";
            this.titleEN = "";
            this.firstnameEN = "";
            this.lastnameEN = "";
            this.email = "";
            this.phone = "";
            this.$refs.resume.value = "";
            this.fileName = "";
            this.social = "Facebook";
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

.v-btn {
    margin-right: 5px;
    border-radius: 4px;
}

.snackbar {
    font-size: 17px;
    color: rgb(255, 255, 255);
}

.btn-snackbar {
    font-weight: bold;
    font-size: 17px;
    align-items: center;
    color: rgb(255, 255, 255);
}

.font-head {
    font-size: 1.75em;
    font-weight: bold;
    padding-bottom: 30px;
    color: rgb(0, 0, 0);
    display: flex;
    align-items: center;
    justify-content: center;
}

.v-input--selection-controls {
    margin-top: 0px;
}

.v-card__text {
    padding: 10px 16px 10px 16px !important;
}

.space-label {
    margin-bottom: 3px;
}

.inner-card-blue {
    border: 1px solid #98cbe7;
    border-radius: 2px;
}
@media (max-width: 1400px) {
    .font-head {
        font-size: 1.4em;
    }
}
</style>