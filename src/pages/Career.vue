<template>
  <div>
    <v-toolbar flat color="white">
      <v-flex xs12 sm8>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-flex>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn color="#007fc4" dark class="mb-2" @click="dialog = true">Add</v-btn>
          <v-btn color="#007fc4" dark class="mb-2">Import Excel</v-btn>
          <v-btn color="#007fc4" dark class="mb-2">Export Excel</v-btn>
          <v-file-input label="File input"></v-file-input>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ "Add Transaction" }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    prefix="*"
                    style="color: red"
                    @keydown.native="keyFilter($event, 'number')"
                    maxlength="50"
                    label="Delivery Document"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    prefix="*"
                    style="color: red"
                    maxlength="50"
                    @keydown.native="keyFilter($event, 'number')"
                    label="Billing Document"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    prefix="*"
                    style="color: red"
                    maxlength="50"
                    label="ShipTo"
                    @keydown.native="keyFilter($event, 'number')"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    prefix="*"
                    style="color: red"
                    @keydown.native="keyFilter($event, 'Th')"
                    label="Customer Name"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    prefix="*"
                    style="color: red"
                    @keydown.native="keyFilter($event, 'number')"
                    maxlength="50"
                    label="SaleCode"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    prefix="*"
                    style="color: red"
                    @keydown.native="keyFilter($event, 'number')"
                    maxlength="50"
                    label="PODDate"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="dialog = false">Cancel</v-btn>
            <v-btn
              color="blue darken-1"
              class="white--text"
              :loading="loading"
              @click="dialog = false"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="BillingData"
      :search="search"
      :pagination.sync="pagination"
    >
      <template v-slot:items="props">
        <td>{{ props.item.DeliveryDocument }}</td>
        <td class="text-xs-left">{{ props.item.BillingDocument }}</td>
        <td class="text-xs-left">{{ props.item.ShipTo }}</td>
        <td class="text-xs-left">{{ props.item.CustomerName }}</td>
        <td class="text-xs-left">{{ props.item.SaleCode }}</td>
        <td class="text-xs-left">{{ props.item.POD_Date }}</td>
      </template>
      <template v-slot:no-data> </template>
    </v-data-table>
    <div v-if="loadingDialog">
      <Loading :value="loadingDialog" />
    </div>
    <v-snackbar color="orange" v-model="showResult" :timeout="3500">
      {{ msgResult }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import { isEmpty } from "lodash";
import keyFilter from "@/plugins/keyFilter";
import Swal from "sweetalert2";
import Loading from "../components/core/Loading";
import { sync } from "vuex-pathify";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      pagination: {
        rowsPerPage: 10,
      },
      loading: false,
      keyFilter,
      loadingDialog: false,
      showResult: false,
      msgResult: "",
      BillingData: [],
      search: "",
      dialog: false,
    };
  },

  computed: {
    ...sync("*"),
  },

  async created() {
    this.$store.commit("resetState");
    this.headers = [
      {
        text: "DeliveryDocument",
        align: "left",
        sortable: false,
        value: "DeliveryDocument",
      },
      {
        text: "BillingDocument",
        align: "left",
        sortable: false,
        value: "BillingDocument",
      },
      { text: "ShipTo", align: "left", sortable: false, value: "ShipTo" },
      { text: "CustomerName", align: "left", sortable: false, value: "CustomerName" },
      { text: "SaleCode", align: "left", sortable: false, value: "SaleCode" },
      { text: "POD_Date", align: "left", sortable: false, value: "POD_Date" },
    ];
    this.getTransactions();
  },

  methods: {
    async getTransactions() {
      try {
        const response = await axios.get(
          "https://externalportal.ip-one.com/api/Logistics/v1/SoDoBilling"
        );
        response.data.detail.forEach((element, index) =>
          this.BillingData.push({
            index: index + 1,
            DeliveryDocument: element.deliveryDocument.trim(),
            BillingDocument: element.billingDocument.trim(),
            ShipTo: element.shipTo.trim(),
            CustomerName: element.customerName.trim(),
            SaleCode: element.saleCode.trim(),
            POD_Date: element.podDate,
          })
        );

        // this.listLocation.sort((a, b) => a.index - b.index);
      } catch (error) {
        console.error(error);
      }
    },
  },
  handleFileImport() {
    this.isSelecting = true;

    // After obtaining the focus when closing the FilePicker, return the button state to normal
    window.addEventListener(
      "focus",
      () => {
        this.isSelecting = false;
      },
      { once: true }
    );

    // Trigger click on the FileInput
    this.$refs.uploader.click();
  },
     exportToExcel() {
      // Convert dataObjects to worksheet
      const ws = XLSX.utils.json_to_sheet(this.DataImport);
      // Create a new workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      // Generate Excel file and trigger download
      XLSX.writeFile(wb, "exported_data.xlsx");
    },
};
</script>

<style>
.theme--light.v-table thead th {
  background-image: -webkit-gradient(
    linear,
    right top,
    left top,
    from(rgba(51, 148, 225, 0.18)),
    to(transparent)
  );
  background-image: linear-gradient(270deg, rgba(51, 148, 225, 0.18), transparent);
  background-color: #a7b0b9 !important;
  font-size: 15px !important;
  color: #ffffff !important;
  /* background-color: #222d32;
    background-color: #007fc4;
    background-color: #000000;
    background-color: #ffffff; */
}

.theme--light.v-datatable thead th.column.sortable.active,
.theme--light.v-datatable thead th.column.sortable.active .v-icon,
.theme--light.v-datatable thead th.column.sortable:hover {
  color: #ffffff !important;
}
</style>
