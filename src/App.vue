<template>
    <div>
        <template v-if="!$route.meta.allowAnonymous">
            <v-app id="inspire">
                    <toolbar @toggleNavigationBar="drawer = !drawer" />
                    <navigation :toggle="drawer" v-if="!this.notGetADs"/>
                    <v-content>
                        <breadcrumbs />
                        <router-view />
                    </v-content>
                    <page-footer />
            </v-app>
        </template>

        <template v-else>

            <!-- <transition>
                  <keep-alive>
                      <router-view></router-view>
                  </keep-alive>
              </transition> -->
            <v-app id="inspire">
                <div class="app-container">
                    <!-- <toolbar @toggleNavigationBar="drawer = !drawer"/>
                  <navigation :toggle="drawer"/> -->
                    <v-content>
                        <breadcrumbs />
                        <router-view />
                        <!-- <page-footer /> -->
                    </v-content>
                </div>
            </v-app>
        </template>
    </div>
</template>

<script>
import { sync } from "vuex-pathify";
import apiService from '@/services/apiService';
import Swal from "sweetalert2";

export default {
    name: 'App',
    data() {
        return {
            getUserFromStorage: '',
            getEmpID: '',
        }
    },
    computed: {
        ...sync("*"),
    },
    watch: {
        drawer(val) {
            this.toggle = val
        }
    },
    created() {
        if(!this.$route.query.EmployeeID && this.$route.path !== '/' && !this.$route.query.EmployementID){
            this.getUserFromStorage = this.$route.query.Employee != undefined ? this.$route.query.Employee : localStorage.getItem('currentUser')
            this.getUser();
        } else {
            this.notGetADs = true;
        }
    },
    methods: {
        async getUser() {
            try {
                const getUserAd = {
                    username: this.getUserFromStorage
                }
                const response = await apiService.getAdsUser(getUserAd);
                console.log(response, 'getUser')
                if (!response.data.locked) {
                    this.infoLogin.ADname = response.data.name
                    this.infoLogin.ADfirstName = response.data.firstName
                    this.infoLogin.ADlastName = response.data.lastName
                    this.infoLogin.ADemail = response.data.email
                    this.infoLogin.ADempId = response.data.empId
                    this.infoLogin.ADgroup = response.data.group
                    this.infoLogin.ADsamAccount = response.data.samAccount
                    this.infoLogin.ADmobile = response.data.mobilePhone
                    this.infoLogin.ADtelephone = response.data.telephoneNumber
                    localStorage.setItem('currentUser', response.data.samAccount)
                    localStorage.setItem('fullNameUser', response.data.name)
                    localStorage.setItem('currentEmpID', response.data.empId)
                }
            } catch (error) {
                // Swal.fire({
                //     title: 'เกิดข้อผิดพลาด!',
                //     text: 'ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบผ่านเว็บ Portal',
                //     icon: 'error',
                //     confirmButtonText: 'ตกลง',
                //     allowOutsideClick: false
                // }).then((result) => {
                //     if (result.isConfirmed) {
                //         // เมื่อกดตกลงแล้ว redirect ไปยัง URL ที่กำหนด
                //         window.location.href = 'https://portal.ip-one.com/#/Systems'; // เปลี่ยน URL ตามต้องการ
                //     }
                // });
                console.log(error);
            }
        }
    }
}
</script>

<style>
@import url("./assets/styles/main.css");
/* .v-btn:hover:before {
    color: transparent !important;
} */
</style>