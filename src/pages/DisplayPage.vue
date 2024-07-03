<template>
  <div>
    <div class="header">
      <p class="font-head">I.P. One Career</p>
    </div>

    <div class="moni">

      <div v-bind:style="{ width: Apply100w || Applysize ? '100%' : '40%' }">
        <career/>
      </div>

      <div class="leftmoni" v-if="Applydesc">
        <jobdesc/>
      </div>
        
      <div class="leftmoni" v-if="Applyform">
          <regform/>
      </div>
    </div>
  </div>

</template>

<script>
import career from '../pages/Career.vue';
import jobdesc from '../pages/JobDesc.vue';
import regform from '../pages/RegForm.vue';
import { sync } from "vuex-pathify";
  
  export default {
    components: {
      career,
      jobdesc,
      regform,
    },

    data() {
      return {
        input: '',
        hasError: false,
        errorMessage: '',
        width: window.innerWidth,
        height: window.innerHeight,
        Applysize: window.innerWidth <= 965,
      };
    },
  
    computed: {
      ...sync("*"),
    },
    
    watch: {
    },

    mounted() {
      window.addEventListener
      ('resize', this.setWindowSize);
    },
    beforeDestroy() {
      window.removeEventListener
      ('resize', this.setWindowSize);
    },
    methods: {
      setWindowSize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.Applysize = window.innerWidth <= 965;
      },
    }
  };
</script>

<style scoped>

  body::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  
  .moni{
    display: flex;
  }

  .leftmoni{
    width: 60% ;
    background: red;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* background: linear-gradient(to bottom, #f8c849 50%, #fabd14 50%); */
    background-color:  #f8c849 ;
    height: 57.5px;
    position: relative;
    width: 100%;
  }

  .font-head{
    font-size: 1.8em;
    font-weight: 400;
    padding-top: 20px;
    color: rgb(0, 0, 0);
  }

  @media (max-width: 965px) {
    .moni {
      display: block;
    }
    .leftmoni{
      width: 100%;
      margin-top: 50px;
    }
  }
</style>