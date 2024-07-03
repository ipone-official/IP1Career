<template>
    <div>
        <template v-if="!$route.meta.allowAnonymous">
              <v-app id="inspire">
                <div class="app-container">
                  <toolbar @toggleNavigationBar="drawer = !drawer"/>
                  <navigation :toggle="drawer"/>
                  <v-content>
                    <breadcrumbs />
                    <router-view/>
                    <!-- <page-footer /> -->
                  </v-content>
                </div>
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
                    <router-view/>
                    <!-- <page-footer /> -->
                  </v-content>
                </div>
              </v-app>
          </template>
      </div>
</template>

<script>
import { sync } from "vuex-pathify";
import axios from 'axios';

export default {
    name: 'App',
    data() {
        return {
        }
    },
    computed: {
        ...sync("*"),
    },
    watch :{
        drawer(val){
            this.toggle = val
        }
    },
    mounted: function() {
        // console.log('mounted login')
        // if (!localStorage.getItem('storedData')) {
        //      localStorage.removeItem('storedData')
        //     this.$router.push({ name: 'Login' });
        // } else {
        //     this.$store.commit('resetState');
        //     this.getUser(localStorage.getItem('storedData'))
        // }
        // if (!localStorage.getItem('selectedIndex')) {
        //      localStorage.removeItem('selectedIndex')
        // } else {
        //     this.selectedIndexStr =  Number(localStorage.getItem('selectedIndex'))
        // }
    },
    methods: {
        async getUser(username) {
            try {
                const getUserAd = {
                    username: username
                }
                const response = await axios.post('https://portal.ip-one.com/adsControl/Ads/v1/ADsGetUser', getUserAd);
                console.log(response, 'getUser')
                if (!response.data.locked) {
                    this.infoLogin.name = response.data.name
                    this.infoLogin.firstName = response.data.firstName
                    this.infoLogin.lastName = response.data.lastName
                    this.infoLogin.email = response.data.email
                    this.infoLogin.empId = response.data.empId
                    this.infoLogin.locked = response.data.locked
                    this.infoLogin.group = response.data.group
                    this.infoLogin.samAccount = response.data.samAccount
                }
            } catch (error) {
                console.error(error);
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
