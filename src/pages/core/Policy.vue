<template>
        <v-card>
            <v-card-title style="background: linear-gradient(to right, #007ec3, #0065a4); color: white;">
                <v-icon color="white">mdi-text-box</v-icon>&nbsp;
                ประกาศความเป็นส่วนตัวของผู้สมัครงาน
            </v-card-title>
            <v-card-text>
                <v-layout style="padding-bottom: 15px;">
                    <v-flex d-flex align-end>
                        {{ currentPage }} / {{ pageCount }}
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-btn @click="prevPage" class="page-count" small color="#ffc10a"
                        :disabled="currentPage === 1">ก่อนหน้า</v-btn>
                    <v-btn @click="nextPage" class="page-count" small color="#0580c6" dark
                        :disabled="currentPage === pageCount">ถัดไป</v-btn>
                </v-layout>

                <pdf :src="pdfUrl" :page="currentPage" @num-pages="pageCount = $event"
                    @page-loaded="currentPage = $event" class="pdf-container"></pdf>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="policyDialog = false" :disabled="currentPage != 11">ยอมรับ</v-btn>
            </v-card-actions>
        </v-card>
</template>
<script>
import pdf from "vue-pdf";
import { ref } from "vue";
import { sync } from "vuex-pathify";

export default {
    name: 'Policy',

    components: {
        pdf,
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
            interval: {},
            persen: 0,
            dialog: false
        }
    },

    computed: {
        ...sync("*"),
    },
}
</script>
<style>
.pdf-container {
    height: 725px;
    width: 90%;
    margin: 0 auto;
    overflow: auto;
    scrollbar-width: none;
}

.font-page-count {
    padding-left: 20px;
    font-size: 14px;
}

.page-count {
    color: white;
}
</style>