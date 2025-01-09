<template>
  <div>
    <template v-if="!$route.meta.allowAnonymous">
      <v-app id="inspire">
        <NewLoading v-if="!infoLogin.isLogin" :isLoading="isLoading" />
        <template v-else>
          <toolbar @toggleNavigationBar="drawer = !drawer" />
          <navigation :toggle="drawer" v-if="!this.notGetADs" />
          <v-content>
            <breadcrumbs />
            <router-view />
          </v-content>
          <page-footer />
        </template>
      </v-app>
    </template>

    <template v-else>
      <v-app id="inspire">
        <template >
          <div class="app-container">
            <v-content>
              <breadcrumbs />
              <router-view />
            </v-content>
          </div>
        </template>
      </v-app>
    </template>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";
import {
  getUser,
  isTokenNearExpiration,
  RenewToken,
  ValidateJwtToken,
} from "@/services/apiServicePortaol";
import Swal from "sweetalert2";
import NewLoading from "@/components/NewLoading.vue";

export default {
  name: "App",
  components: {
    NewLoading,
  },
  data() {
    return {
      getUserFromStorage: "",
      getEmpID: "",
      isLoading: false,
    };
  },
  computed: {
    ...sync("*"),
  },
  watch: {
    drawer(val) {
      this.toggle = val;
    },
  },
  created() {
    if (
      !this.$route.query.EmployeeID &&
      this.$route.path !== "/" &&
      !this.$route.query.EmployementID
    ) {
      // console.log(this.$route.query.accessTokenCareer, "this.$route.query.accessTokenCareer")
      // console.log(this.$route.query.refreshTokenCareer, "this.$route.query.refreshTokenCareer")

      // this.getUserFromStorage =
      this.$route.query.accessTokenCareer != undefined
        ? localStorage.setItem("accessTokenCareer", this.$route.query.accessTokenCareer)
        : localStorage.getItem("accessTokenCareer");
      this.$route.query.refreshTokenCareer != undefined
        ? localStorage.setItem("refreshTokenCareer", this.$route.query.refreshTokenCareer)
        : "";
      this.ValidateJwtToken();
    } else {
      this.notGetADs = true;
      this.infoLogin.isLogin = true;
    }
  },
  methods: {
    async ValidateJwtToken() {
      this.isLoading = true;
      try {
        const response = await ValidateJwtToken();
        const nameClaim = response.claims.find((claim) => claim.type === "name");

        if (nameClaim) {
          if (isTokenNearExpiration()) {
            // หาก Token ใกล้หมดอายุ ให้ Renew Token
            await RenewToken(localStorage.getItem("refreshTokenCareer"));
          }
          await this.getUser(nameClaim.value);
        } else {
          Swal.fire({
            html: `Name claim not found`,
            icon: "warning",
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonText: "OK",
          }).then(async (result) => {
            if (result.isConfirmed) {
              localStorage.removeItem("accessTokenCareer");
            }
          });
        }
      } catch (error) {
        // หากเกิดข้อผิดพลาด ให้แสดงผลข้อความ
        Swal.fire({
          html: `Token is invalid or expired.`,
          icon: "warning",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("accessTokenCareer");
          }
        });
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async getUser(username) {
      this.isLoading = true;
      try {
        const response = await getUser(username);
        this.infoLogin.isLogin = true;
        this.infoLogin.ADname = response.name;
        this.infoLogin.ADfirstName = response.firstName;
        this.infoLogin.ADlastName = response.lastName;
        this.infoLogin.ADemail = response.email;
        this.infoLogin.ADempId = response.empId;
        this.infoLogin.ADgroup = response.group;
        this.infoLogin.ADsamAccount = response.samAccount;
        this.infoLogin.ADmobile = response.mobile;
        this.infoLogin.ADtelephone = response.telephone;
        this.infoLogin.pathUrl = response.pathUrl;
      } catch (error) {
        // หากเกิดข้อผิดพลาด ให้แสดงผลข้อความ
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
  },
};
</script>

<style>
@import url("./assets/styles/main.css");
/* .v-btn:hover:before {
    color: transparent !important;
} */
</style>
