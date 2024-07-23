<template>
  <div class="container">
    <v-layout class="layout">
      {{ currentPage }} / {{ pageCount }}
      <v-spacer></v-spacer>
      <v-btn @click="prevPage" color="#ffc10a"  :disabled="currentPage === 1">Previous</v-btn>
      <v-btn @click="nextPage" color="#0580c6"  :disabled="currentPage === pageCount">Next</v-btn>
    </v-layout>

    <pdf
      :src="pdfUrl"
      :page="currentPage"
      @num-pages="pageCount = $event"
      @page-loaded="currentPage = $event"
  
    ></pdf>
  </div>
</template>
        
<script>
import pdf from 'vue-pdf';
import { ref } from 'vue';

export default {
  components: {
    pdf,
  },

  setup() {
    const pdfUrl = ref('https://webapps.ip-one.com/IP1Career/pdf/User%20Manual%20-%20I.P.Career%20Portal.pdf');
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
      pdfWidth: '',
      pdfHeight: ''
    };
  },

  mounted() {
    this.updatePdfSize();
    window.addEventListener('resize', this.updatePdfSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updatePdfSize);
  },

  methods: {
    updatePdfSize() {
      if (window.innerWidth < 600) {
        this.pdfWidth = '100%';
        this.pdfHeight = '100vh';
      } else if (window.innerWidth < 1024) {
        this.pdfWidth = '100%';
        this.pdfHeight = '90vh';
      } else {
        this.pdfWidth = '100%';
        this.pdfHeight = '80vh';
      }
    }
  }
};
</script>
        
<style scoped>
.container {
  overflow: scroll;
  height: auto;
  scrollbar-width: none;
}
.layout {
  align-items: flex-end;
  padding-bottom: 15px;
}
</style>
        