<template>
  <v-container>
    <div>
      <!-- Hidden file input -->

    
      <input
        type="file"
        ref="fileInput"
        id="fileInput"
        style="display: none"
        @change="handleFileUpload"
      />
    <v-tooltip top color="teal">
      <template v-slot:activator="{ on, attrs }">
        <v-btn 
          fab
        small
        color="#007fc4"
        dark
        @click="openFileInput"
        class="ma-2 small-export-button"
          v-bind="attrs" 
          v-on="on"
        >
          <v-icon size="20">mdi-file-excel</v-icon>
        </v-btn>
      </template>
      <span>Choose File Excel</span>
    </v-tooltip>
    
      <span v-if="fileName">{{ fileName }}</span>
      <button v-if="fileName" style="color: red" @click="clearFile">&#10006;</button>

 
    </div>
    <v-toolbar
      xs12
      sm8
      v-if="headers.length > 0 || headers2.length > 0"
      color="#f8c849"
      dark
      tabs
    >
      <template v-slot:extension>
        <v-tabs
          v-if="headers.length > 0 || headers2.length > 0"
          v-model="activeItem"
          color="#f8c849"
          dark
          slider-color="#007fc4"
          centered
        >
          <v-tab v-for="item in items" :key="item" ripple>
            {{ item }}
          </v-tab>
        </v-tabs>
           <v-tooltip top color="teal">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-if="DataImport.length > 0 || DataImport2.length > 0"
          fab
        small
        color="#007fc4"
        dark
        @click="UploadDataToSql"
        class="ma-2 small-export-button"
          v-bind="attrs" 
          v-on="on"
        >
          <v-icon size="20">mdi-upload</v-icon>
        </v-btn>
      </template>
      <span>Upload Data</span>
    </v-tooltip>
      </template>
      <v-text-field
        v-model="search"
        class="mx-3"
        flat
        label="Search"
        prepend-inner-icon="search"
        solo-inverted
        clearable
      ></v-text-field>
    </v-toolbar>
    <div v-if="activeItem == 0" style="margin-top: 0.5rem">
      <div v-if="headers.length > 0">
        <v-data-table
          :headers="headers"
          :items="DataImport"
          :search="search"
          :pagination.sync="pagination"
        >
          <template v-slot:items="props">
            <tr
              :style="`
    
            background: ${getColor(props.item.duplicate)};`"
            >
              <td>{{ props.item.Date }}</td>

              <td class="text-xs-left">{{ props.item.BillingNo }}</td>

              <td class="text-xs-left">{{ props.item.ShipTo }}</td>

              <td class="text-xs-left">{{ props.item.ShipName }}</td>

              <td class="text-xs-left">{{ props.item.Province }}</td>

              <td class="text-xs-left">{{ props.item.LineNo }}</td>

              <td class="text-xs-left">{{ props.item.ReasonCode }}</td>

              <td class="text-xs-left">{{ props.item.ReasonValue }}</td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>
    <div v-else>
      <div v-if="headers2.length > 0" style="margin-top: 0.5rem">
        <v-data-table
          :headers="headers2"
          :items="DataImport2"
          :search="search"
          :pagination.sync="pagination"
        >
          <template v-slot:items="props">
            <tr>
              <td>{{ props.item.DONO }}</td>

              <td class="text-xs-left">{{ props.item.BONO }}</td>

              <td class="text-xs-left">{{ props.item.BODate }}</td>

              <td class="text-xs-left">{{ props.item.ShipTo }}</td>

              <td class="text-xs-left">{{ props.item.ShipName }}</td>

              <td class="text-xs-left">{{ props.item.LineNo }}</td>

              <td class="text-xs-left">{{ props.item.MaterialNo }}</td>

              <td class="text-xs-left">{{ props.item.Description }}</td>

              <td class="text-xs-left">{{ props.item.DOFullBox }}</td>

              <td class="text-xs-left">{{ props.item.Size }}</td>

              <td class="text-xs-left">{{ props.item.ChargePerCase }}</td>

              <td class="text-xs-left">{{ props.item.TotalTPCharge }}</td>

              <td class="text-xs-left">{{ props.item.VendorChargePerCase }}</td>

              <td class="text-xs-left">{{ props.item.VendorRevenue }}</td>

              <td class="text-xs-left">{{ props.item.ReasonCode }}</td>

              <td class="text-xs-left">{{ props.item.ReasonValue }}</td>

              <td class="text-xs-left">{{ props.item.VendorReturnChargePerCase }}</td>

              <td class="text-xs-left">{{ props.item.VendorRevenueReturn }}</td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>
  </v-container>
</template>

<script>
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default {
  components: {},
  data() {
    return {
      activeItem: null,
      items: [],
      headers: [],
      DataImport: [],
      headers2: [],
      DataImport2: [],
      search: "",
      fileName: "",
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  methods: {
    getColor(val) {
      return val ? "#F9ECEC" : "";
    },
    openFileInput() {
      this.$refs.fileInput.click(); // Trigger click on file input
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const sheetName2 = workbook.SheetNames[1];
          const sheet2 = workbook.Sheets[sheetName2];
          const jsonData2 = XLSX.utils.sheet_to_json(sheet2, { header: 1 });
          this.items = [sheetName, sheetName2];
          if (jsonData.length > 0) {
            const headerRows = jsonData.slice(0, 1); // Adjust if more header rows
            const combinedHeaders = this.combineHeaders(headerRows);
            this.headers = combinedHeaders.map((header) => ({
              text: header,
              value: header,
              sortable: false,
            }));
            // this.headers.push({text: 'Action', value: 'Action', sortable: false})
            this.DataImport = this.arrayToObjects(jsonData);
            const init = [
              {
                No: 1,
              },
            ];
            this.DataImport.forEach((item, index) => {
              const found = init.find((initItem) => initItem.No === item.No);
              this.DataImport[index].duplicate = found ? true : false;
            });
          }
          if (jsonData2.length > 0) {
            const headerRows = jsonData2.slice(0, 1); // Adjust if more header rows
            const combinedHeaders = this.combineHeaders(headerRows);
            this.headers2 = combinedHeaders.map((header) => ({
              text: header,
              value: header,
              sortable: false,
            }));
            // this.headers.push({text: 'Action', value: 'Action', sortable: false})
            this.DataImport2 = this.arrayToObjects(jsonData2);
            console.log(this.DataImport2, "this.DataImport2");
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        this.fileName = "";
      }
    },
    combineHeaders(headerRows) {
      const combinedHeaders = [];
      for (let i = 0; i < headerRows[0].length; i++) {
        let combinedHeader = "";
        headerRows.forEach((row) => {
          combinedHeader += (row[i] || "") + " ";
        });
        combinedHeaders.push(combinedHeader.trim());
      }
      return combinedHeaders;
    },
    arrayToObjects(array) {
      const headers = array[0];
      const data = array.slice(1);
      return data.map((row) => {
        const obj = {};
        row.forEach((cell, index) => {
          obj[headers[index]] = cell;
        });
        return obj;
      });
    },
    clearFile() {
      this.$refs.fileInput.value = null;
      this.headers = [];
      this.DataImport = [];
      this.fileName = "";
      this.headers2 = [];
      this.DataImport2 = [];
      this.item = [];
      this.activeItem = null;
    },
    UploadDataToSql() {

    }
 
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
  background-color: #007fc4 !important;
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
