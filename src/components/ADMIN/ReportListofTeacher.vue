<template>
  <div>
    <div class="container-fluid">
      <div class="header-container">
        <img src="@/assets/enhs logo.jpg" alt="Left Logo" class="enhslogo">
        <h3 class="text-center">Report Generation for List of Teachers</h3>
        <img src="@/assets/Deped-Logo.png" alt="Right Logo" class="depedlogo">
      </div>
      <div class="row mb-4 justify-content-end align-items-center">
        <div class="col-md-2 d-flex align-items-center">
          <select v-model="selectedGender"  class="form-control custom-select"  id="gender">
            <option v-for="type in gender" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
    
      <div class="col-md-3 d-flex align-items-center">
        <select v-model="position_id" id="position" class="form-select custom-select" style="margin-right: 30px;"  required>
          <option value="">Filter by Position</option>
          <option v-for="position in positions" :key="position.id" :value="position.id">
            {{ position.teacher_postion }}
          </option>
        </select>
      </div>
      
    </div>


      <!-- Teachers Table -->
      <div class="table-wrapper">
        <table class="table table-bordered table-hover table-custom">
          <thead class="table-info">
            <tr>
              <th scope="col" class="text-center">No.</th>
              <th scope="col" class="text-center">Employee Number</th>
              <th scope="col" class="text-center">Name</th>
              <th scope="col" class="text-center">Sex</th>
              <th scope="col" class="text-center">Position</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(teacher, index) in paginatedItems" :key="teacher.user.idnumber">
              <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ teacher.user.idnumber }}</td>
              <td class="text-center">{{ teacher.user.lname }}, {{ teacher.user.fname }} {{ teacher.user.mname }}</td>
              <td class="text-center">{{ teacher.user.sex }}</td>
              <td class="text-center">{{ teacher.position.teacher_postion }} </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="row mb-4">
        <div class="col-md-2 d-flex align-items-center">
          <i class="fa fa-mars mr-2 lalaki" aria-label="Boy"></i>
          <h6 >Male : {{ maleCountPerPage }}</h6>
        </div>

        <div class="col-md-3 d-flex align-items-center">
          <i class="fa fa-venus mr-2 babae" aria-label="Girl"></i>
          <h6>Female : {{ femaleCountPerPage }}</h6>
        </div>

        <div class="col-md-7">
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
              </li>
              <li class="page-item" :class="{ active: page === currentPage }" v-for="page in totalPages" :key="page">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Generate Report Button -->
      <div class="row mb-4">
        <div class="col-md-12 text-end">
          <button @click="generateReport" class="btn btn-gradient">Generate Report</button>
        </div>
      </div>

      <!-- Modal for Editing User -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import config from '@/config';
export default {
  name: 'ManageUserTeachers',
  data() {
    return {
      search: '',
      showModal: false,
      selectedGender: 'all',
      gender: ['all', 'male', 'female'],
      itemsPerPage: 10,
      currentPage: 1,
      serverItems: [],
      positions: [],
      position_id: '',
      currentUser: {}
    };
  },
  computed: {
    filteredItems() {
      const searchLower = this.search.toLowerCase();
      return this.serverItems.filter(item => {
        const idnumberStr = item.user.idnumber ? item.user.idnumber.toString().toLowerCase() : '';
        const lname = item.user.lname ? item.user.lname.toLowerCase() : '';
        const fname = item.user.fname ? item.user.fname.toLowerCase() : '';
        const mname = item.user.mname ? item.user.mname.toLowerCase() : '';
        const positionMatches = !this.position_id || item.position.id === this.position_id;
        const genderMatches = this.selectedGender === 'all' || item.user.sex.toLowerCase() === this.selectedGender.toLowerCase();

        return (
          positionMatches &&
          genderMatches &&
          (
            idnumberStr.includes(searchLower) ||
            lname.includes(searchLower) ||
            fname.includes(searchLower) ||
            mname.includes(searchLower)
          )
        );
      });
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
    maleCountPerPage() {
      return this.paginatedItems.filter(item => item.user.sex === 'male').length;
    },
    femaleCountPerPage() {
      return this.paginatedItems.filter(item => item.user.sex === 'female').length;
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY/M/D [time] h:mm a');
    },
    async fetchTeachers() {
      try {
        const response = await axios.get(`${config.apiBaseURL}/viewAllTeachers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.serverItems = response.data.teachers;
      } catch (error) {
        alert('Error fetching teachers: ' + (error.response ? error.response.data.message : error.message));
      }
    },
    async fetchPositions() {
      try {
        const response = await axios.get(`${config.apiBaseURL}/viewposition`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.positions = response.data.data;
      } catch (error) {
        console.error('Error fetching positions:', error.response ? error.response.data : error.message);
      }
    },
    async generateReport() {
      try {
        const response = await axios.post(`${config.apiBaseURL}/generateTeacherPDF`, {
          gender: this.selectedGender,
          position_id: this.position_id
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          responseType: 'blob' // Important for handling PDF files
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'teacher_report.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        alert('Error generating report: ' + (error.response ? error.response.data.message : error.message));
      }
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openEditModal(teacher) {
      this.currentUser = teacher;
      this.showModal = true;
    },
    async saveChanges() {
      try {
        // Perform the save operation here, e.g., send an update request to the API
        this.showModal = false;
      } catch (error) {
        console.error('Error saving changes:', error.response ? error.response.data : error.message);
      }
    }
  },
  mounted() {
    this.fetchTeachers();
    this.fetchPositions();
  }
};
</script>

<style scoped>
  .container-fluid {
    background-color: #ffffff;
    border-radius: 10px;
  }
  tbody {
    font-size: 15px;
  }
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px;
    margin-bottom: 10px;
  }

  .text-center {
    margin: 0;
    text-align: center;
    flex: 1;
  }
  .enhslogo{
    margin-left: 120px;
  }
  .depedlogo{
    margin-right: 90px;
  }
  .enhslogo , .depedlogo {
    width: 100px; /* Adjust size as needed */
    height: auto;
  }
  .form-select {
    width: 200px;
  }
  /* Table Wrapper */
  .table-wrapper {
    margin: 10px;
    padding: 0 15px;
    max-width: 100%;
    overflow-x: auto;
    
  }

  /* Table Styles */
  .table-custom {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    border: 1px solid #200909;
    overflow: hidden;
  }

  .table-custom th {
    background-color: #c1c1c1d7;
    color: #000000;
    font-weight: 700;
  }
  .table th, .table td {
    text-align: center;
    vertical-align: middle;
  }

  .table-custom tbody tr:hover {
    background-color: #f1f3f5;
  }

  .table-custom tbody tr {
    transition: background-color 0.3s ease;
  }
  .lalaki {
  color: blue;
  }
  .babae {
    color: red;
  }
  .lalaki, .babae{
    font-size: 20px;
    padding-left: 50px;
    padding-right: 12px;
  }
  .btn-gradient {
  background: linear-gradient(45deg, #c4c5c5, #9fa0a0);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  color: #120808;
  transition: background 0.3s ease;
  border-radius: 5px ;
  margin: 20px;
  padding: 5px;
  width: 300px;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #b2b3b4, #eff0f0);
}
.custom-select {
  width: 100%; /* Make select full width of its container */
  padding: 10px 12px; /* Adjust padding for better spacing */
  border-radius: 8px; /* Rounded corners */
  border: 1px solid #ced4da; /* Light border color */
  background-color: #ffffff; /* White background */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  font-size: 16px; /* Font size for better readability */
  font-family: Arial, sans-serif; /* Font family */
  color: #495057; /* Text color */
  transition: border-color 0.3s, box-shadow 0.3s; /* Smooth transition for focus */
}

.custom-select:focus {
  border-color: #007bff; /* Border color on focus */
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25); /* Shadow on focus */
  outline: none; /* Remove default outline */
}

.custom-select option {
  padding: 10px; /* Padding inside options */
}

.custom-select::placeholder {
  color: #6c757d; /* Placeholder text color */
}

  </style>
  