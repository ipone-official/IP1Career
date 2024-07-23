<template>
  <div class="container">

    <div class="job-listings-container">
      <!-- <div class="filter-section">
          <div class="filter-item list-group-item" v-for="department in departments" :key="department.departmentID" >
            <label class="department-label">
            <input type="checkbox" :value="department.departmentID" v-model="selectID" style="transform: scale(1.3);">
              {{ department.department_DescTH }}
            </label>
          </div>
      </div> -->

      <div class="results-section">
        <div class="newjob-item" v-for="(position, index) in seachDepartment" :key="position.positionID" 
        @click="goToJobDesc(position.positionID, position.position_Name, position.department_DescTH, position.priority, position.descriptionID, position.qualificationID)">
          <div class="job-details">
            <div class="first-section">
              <div v-if="position.priority == 'URGENT'" class="urgent">ด่วน !</div>
              <div class="job-firstline">{{ position.position_Name }}</div>
            </div>
            <div class="job-secondline">{{ position.department_DescTH }}</div>
          </div>
          <span class="arrow-icon">&#10095;</span>
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
      rawData: [],
      depRawData: [],
    };
  },

  computed: {
    ...sync("*"),
    seachDepartment() {
      if (!this.searchVal) {
        return this.filterPosition;
      }
      return this.filterPosition.filter(department => 
        department.position_Name.toLowerCase().includes(this.searchVal.toLowerCase())
      );
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
        this.departments = this.depRawData
                            .filter(department => department.status === 'ACTIVE');
        
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPositions() {
      try {
        const response = await apiService.getPosition();
        this.rawData = response.data;

        const priorityOrder = {
          'URGENT': 1,
          'NORMAL': 2
        };
        this.positions = this.rawData.filter(position => position.status === 'ACTIVE')
                                      .sort((a, b) => { return priorityOrder[a.priority] - priorityOrder[b.priority]});
        
        this.filterPosition = this.positions;
      } catch (error) {
        console.error(error);
      }
    },
    goToJobDesc(id, name, dep, pri, jd, jq) {
      this.PositionDesc = [id]
      this.PositionName = name
      this.PositionDepart = dep
      this.PositionPriority = pri
      this.PositionJD = jd
      this.PositionJQ = jq
      this.Applydesc = true
      this.Apply100w = false
      this.Applyform = false
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
  padding: 5px 0px 0px 0px;
  background: #f4f4f4;
  overflow: scroll;
  scrollbar-width: none;
  max-height: 725px;
  min-height: 725px;
  margin-top: 20px;
}

.department-label input[type="checkbox"] {
  margin-right: 5px;
}

.department-label {
  color: rgb(0, 0, 0);
  font-size: 0.9em;
}

.job-listings-container {
  display: flex;
  justify-content: space-between;
}

.results-section {
  width: 100%;
  padding: 0px 0px 10px 0px;
}

.newjob-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  /* border: 2px solid #d4d4d4; */
  border: 1px solid #000000;
  padding: 17.5px 20px 17.5px 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.newjob-item:hover {
  /* background-image: linear-gradient(to right, rgba(51, 148, 225, .18), transparent);  */
  background: #e0f2ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.job-details {
  display: flex;
  flex-direction: column;
}

.job-firstline {
  justify-content: space-between; 
  display: flex;
  font-size: 1.3em;
}

.job-secondline {
  font-size: 1em;
  color: #aaaaaa;
}

.urgent {
  background-color: red;
  margin-right: 10px;
  padding: 3px 6px 3px 6px;
  color: white;
  font-weight: 300;
  white-space: nowrap;
}

.arrow-icon {
  flex-shrink: 0;
  font-size: 27.5px;
  font-weight: bold;
  margin-left: 10px;
}

.first-section {
  display: flex;
  align-items: center;
  padding-bottom: 5px;
}

/* @media (max-width: 960px) {
  .results-section {
    width: 100%;
    padding: 10px 60px 0px 0px;
  }
} */

@media (max-width: 1400px) {
  .txt {
    font-size: 15px;
  }
  .job-firstline {
    font-size: 1.25em;
  }
  .filter-item {
    font-size: em;
  }
  .card-font-head {
    font-size: 1.1em;
  }
}

@media (max-width: 650px) {
  .job-firstline {
    font-size: 1.2em;
  }
}
</style>
