<template>
  <v-navigation-drawer
    v-model="toggle"
    class="page-sidebar"
    fixed app>
    <v-toolbar class="page-sidebar">
      <!-- <router-link :to="{ name: 'Dashboard' }"> -->
        <img src="static/logo.png" width="100vh"></img>
       <h3>{{ titleNavigation }}</h3> 
      <!-- </router-link>
      <router-link :to="{ name: 'Dashboard' }" class="text">
         
      </router-link> -->
    </v-toolbar>
    <v-list > 
    <v-list-group 
      prepend-icon="mdi-chart-bar-stacked">
      <v-list-tile slot="activator" >
        <v-list-tile-title class="item-title">{{ $t('Reports') }}</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="changeRoute('Reports', 1)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-billboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 1}, 'item-title' ]" >{{ $t('POD') }}</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="changeRoute('Reports', 3)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-billboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 3}, 'item-title' ]" >{{ $t('Billing') }}</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="changeRoute('Career', 4)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-billboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 4}, 'item-title' ]" >{{ $t('Career') }}</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="changeRoute('JobDesc', 5)" style="margin-left: 1rem">
        <v-list-tile-action>
          <v-icon >mdi-billboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-title :class="[{'active': selectedIndex === 5}, 'item-title' ]" >{{ $t('JobDesc') }}</v-list-tile-title>
      </v-list-tile>
    </v-list-group>

    <v-list-tile @click="changeRoute('Transactions', 2)">
            <v-list-tile-action>
              <v-icon>mdi-file-arrow-left-right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title :class="[{'active': selectedIndex === 2}, 'item-title' ]">{{ $t('Transactions') }}</v-list-tile-title>
          </v-list-tile>


    <v-list-tile @click="changeRoute('ImportExcel', 3)">
            <v-list-tile-action>
              <v-icon>mdi-file-arrow-left-right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title :class="[{'active': selectedIndex === 3}, 'item-title' ]">{{ $t('ImportExcel') }}</v-list-tile-title>
          </v-list-tile>

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
