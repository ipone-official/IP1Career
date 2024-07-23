<template>
  <v-navigation-drawer
    v-model="toggle"
    class="page-sidebar"
    fixed app>
    <v-toolbar class="page-sidebar">
        <img src="static/logo.png" width="100vh"></img>
       <p style="font-size: 17px; margin-bottom: 0px; font-weight: bold;">{{ titleNavigation }}</p> 

    </v-toolbar>
    <v-list > 
      <!-- <v-list-tile @click="changeRoute('Career', 4)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-billboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 4}, 'item-title' ]" >{{ $t('Career') }}</v-list-tile-title>
      </v-list-tile> -->
      <!-- <v-list-tile @click="changeRoute('JobDesc', 5)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-billboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 5}, 'item-title' ]" >{{ $t('JobDesc') }}</v-list-tile-title>
      </v-list-tile> -->
      <!-- <v-list-tile @click="changeRoute('RegForm', 6)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-billboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 6}, 'item-title' ]" >{{ $t('RegForm') }}</v-list-tile-title>
      </v-list-tile> -->
      <v-list-tile @click="changeRoute('ManageData', 1)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-text-box-edit</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 1}, 'item-title' ]" >{{ $t('ManageData') }}</v-list-tile-title>
      </v-list-tile>
      <!-- <v-list-tile @click="changeRoute('DisplayPage', 8)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-billboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 8}, 'item-title' ]" >{{ $t('DisplayPage') }}</v-list-tile-title>
      </v-list-tile> -->
      <v-list-tile @click="changeRoute('Applicant', 2)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-account-tie</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 2}, 'item-title' ]" >{{ $t('Applicant') }}</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="changeRoute('Candidate', 3)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-account-star</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 3}, 'item-title' ]" >{{ $t('Candidate') }}</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="changeRoute('UserManual', 4)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-book-open-variant</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 4}, 'item-title' ]" >{{ $t('User Manual') }}</v-list-tile-title>
      </v-list-tile>
      <!-- <v-list-tile @click="changeRoute('NewEmpForm', 4)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-billboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 4}, 'item-title' ]" >{{ $t('NewEmpForm') }}</v-list-tile-title>
      </v-list-tile> -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { sync } from "vuex-pathify";
export default {
  data() {
    return {
      selectedIndex: 1
    }
  },
  watch :{
        'selectedIndexStr': function() {
           this.selectedIndex =  Number(localStorage.getItem('selectedIndex'))
        },
        toggle(val){
            this.drawer = val
        }
  },
  computed: {
        ...sync("*"),
    },
  methods: {
    changeRoute(routeName, selectedIndex) {
      const vm = this;

      vm.selectedIndex = selectedIndex;
      localStorage.setItem('selectedIndex', selectedIndex)
      return vm.$router.push({ name: routeName });
    },
       openInNewTab(url) {
      window.open(url, '_blank', 'noreferrer');
    },
  }
}
</script>

<style>
  .toolbar {
    font-weight: bold;
    font-size: 18px;
  }

  .toolbar .text {
    padding-left: 15px;
    color: white;
    text-decoration:none;
  }

  .item-title {
    font-size: 17px;
    font-weight: 500;
  }
  .item-sub-title {
    font-size: 15px;
    font-weight: 500;
  }

  .active {
    font-weight: bold;
  }
  .page-logo, .page-sidebar, .nav-footer, .bg-brand-gradient {
    background-image: -webkit-gradient(linear, right top, left top, from(rgba(51, 148, 225, 0.18)), to(transparent));
    background-image: linear-gradient(270deg, rgba(51, 148, 225, 0.18), transparent);
    background-color: #584475;
    background-color: #222d32;
    background-color: #007fc4;
    background-color: #000000;
    background-color: #ffffff;
}
.theme--light.v-icon {
    color: #007fc4
}
</style>
