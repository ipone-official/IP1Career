<template>
  <div>

    <div class="container">

      <div class="job-listings-container">
        <div class="filter-section">
            <div class="card-header">
              <div class="card-font-head">
                <v-icon color="white" >mdi-tune</v-icon>
                {{ departmentTitle }}
              </div>
            </div>
            <ul class="list-group">
              <li class="filter-item list-group-item" v-for="department in departments" :key="department.departmentID" >
                <label class="department-label">
                <input type="checkbox" :value="department.departmentID" v-model="selectID" style="transform: scale(1.3);">
                  {{ getDepartmentDesc(department) }}
                </label>
              </li>
            </ul>
        </div>

        <div class="results-section">
          <div class="card-header">
            <div class="card-font-head">
              <v-icon color="white">mdi-account</v-icon>
              {{ vacanciesTitle }}
            </div>
          </div>
          <!-- <table class="table">
            <tbody>
              <tr v-for="(position, index) in filterPosition" :key="position.positionID" @click="goToJobDesc(position.positionID, position.position_Name)">
                <td class="job-item">{{ position.position_Name }}<span>&#10140;</span></td>
              </tr>
            </tbody>
          </table> -->

          <div v-for="(position, index) in filterPosition" :key="position.positionID" @click="goToJobDesc(position.positionID, position.position_Name)">
            <div class="newjob-item">{{ position.position_Name }}<span>&#10140;</span></div>
          </div>
        </div>
      </div>
      
    </div>

  </div>
</template>

<script>
import axios from "axios";  
import { isEmpty } from "lodash";
import keyFilter from "@/plugins/keyFilter";
import Swal from "sweetalert2";
import Loading from "../components/core/Loading";
import { sync } from "vuex-pathify";
import apiService from '@/services/apiService';
import { watch } from "vue";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      departments: [],
      filterPosition: [],
      positions: [],
      selectID: [],
      rawData: [],
      depRawData: [],
      titles: {
        department: {
          en: 'Department',
          th: 'แผนก'
        },
        vacancies: {
          en: 'Job Vacancies',
          th: 'ตำแหน่งงานที่รับสมัคร'
        }
      }
    };
  },

  computed: {
    ...sync("*"),
    departmentTitle() {
      return this.language === 'en' ? this.titles.department.en : this.titles.department.th;
    },
    vacanciesTitle() {
      return this.language === 'en' ? this.titles.vacancies.en : this.titles.vacancies.th;
    }
  },

  watch: {
    selectID(){
      console.log(this.selectID.length);
      if (this.selectID.length == 0) {
        this.filterPosition = this.positions;
      } else {
        this.filterPosition = this.positions.filter((position) => 
          this.selectID.includes(position.departmentID)
        );
      }
    }
  },

  created() {
    this.fetchDepartments();
    this.fetchPositions();
  },
  
  methods: {
    async fetchDepartments() {
      try {
        const response = await apiService.getDepartment();
        this.depRawData = response.data;
        this.departments = this.depRawData.filter(department => department.status === 'ACTIVE');
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPositions() {
      try {
        const response = await apiService.getPosition();
        this.rawData = response.data;
        this.positions = this.rawData.filter(position => position.status === 'ACTIVE');
        this.filterPosition = this.positions;
      } catch (error) {
        console.error(error);
      }
    },
    goToJobDesc(id, name) {
      console.log("id", id)
      this.PositionDesc = [id]
      this.PositionName = name
      this.Applydesc = true
      this.Apply100w = false
      this.Applyform = false
      console.log("PositionDesc", this.PositionDesc)
      console.log("PositionName", this.PositionName)
      // this.$router.push({ name: 'JobDesc'});  
    },
    switchLanguage() {
      return this.language;
    },
    getDepartmentDesc(department) {
      return this.language === 'en' ? department.department_DescEN : department.department_DescTH;
    },
  }
};
</script>

<style scoped>

.container{
  max-width: 100%;
  padding: 20px;
  /* box-shadow: 7px 8px 20px -4px rgba(0, 0, 0, 0.1); */
  background: #ffffff 0%;
  overflow: scroll;
  scrollbar-width: none;
  max-height: 750px;
  min-height: 750px;
}

.department-label input[type="checkbox"] {
  margin-right: 5px;
}

.department-label {
  /* padding: 10px 0px 10px 5px; */
  color: rgb(0, 0, 0);
  font-size: 0.9em;
}

.job-listings-container {
  display: flex;
  justify-content: space-between;
  /* background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-height: 750px;
  min-height: 750px; */
}

.filter-section {
  width: 40%;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.results-section {
  width: 60%;
  padding: 20px;
}

.newjob-item {
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.12em;
  font-weight: 400;
  background-color: #fff;
  border: 1.75px solid #ddd;
  padding: 17.5px 20px 17.5px 15px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.newjob-item:hover {
  background-image: linear-gradient(to right, rgba(51, 148, 225, .18), transparent); 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

/* .list-group {
  border-radius: 5px;
  background-color: #fff;
}

.filter-item {
  padding: 15px 10px 15px 12.5px;
  border-bottom: 2px solid #eee;
}

.filter-item:last-child {
  border-bottom: none;
} */
 
.filter-item {
  background-color: #fff;
  border: 1.75px solid #dddddd !important;
  border-radius: 5px;
  padding: 15px;
  font-size: 1em;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.filter-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.card-header {
  padding: 10px 20px 10px 10px;
  /* background: linear-gradient(to bottom, #007fc4 50%, #0977b3 50%); */
  background-color: #007fc4;
  color:white;
  border-radius: 4px !important;
  box-shadow: 0 2px 4px rgb(168, 166, 166); /* ใช้ rgb สำหรับเงา */
}

.card-font-head {
  font-size: 1.2em; 
  font-weight: bold; 
  /* padding: 5px 20px 5px 0px; */
}

li:nth-child(even) {
  background-color: #e9e7e7;
  }

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

@media (max-width: 1100px) {
  .job-listings-container {
    display: block;
    justify-content: space-between;
  }

  .filter-section {
    width: 100%;
    padding: 20px;
    border-bottom: 1px solid #ddd;
    border-right: none;
  }

  .results-section {
    width: 100%;
    padding: 20px;
  }
}

@media (max-width: 1400px) {
  .txt {
    font-size: 15px;
  }
  .job-item {
    font-size: 1.05em;
  }
  .newjob-item {
    font-size: 1.05em;
  }
  .filter-item {
    font-size: 0.95em;
  }
  .card-font-head {
    font-size: 1.1em;
  }
}
</style>
