<template>
  <div>
    <div class="container-fluid">
      <h4 >List of All Users</h4>
      <div class="row mb-4 justify-content-end align-items-center">
        <div class="col-md-8">
          <div class="search-bar-container">
            <div class="input-group search-bar">
              <input type="text" v-model="search" class="form-control" placeholder="Search" />
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-flex align-items-center">
          <label for="userType" class="form-label me-2">SELECT USER TYPE:</label>
          <select v-model="selectedUserType" class="form-select" id="userType">
            <option v-for="type in userTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        
      </div>

      <div class="table-wrapper">
        <table class="table table-hover table-custom">
          <thead>
            <tr>
              <th>#</th>
              <th>Id Number</th>
              <th>Name</th>
              <th>Sex</th>
              <th>User Type</th>
              <th>Date Registered</th>
              <th>Date Modified</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in paginatedItems" :key="item.idnumber">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">{{ item.idnumber }}</td>
            <td class="text-center">
              <b>{{ item.lname }}, {{ item.fname }} {{ item.mname }}</b><br>
              <i>{{ item.email }}</i>
            </td>
            <td class="text-center">{{ item.sex }}</td>
            <td class="text-center">{{ item.usertype }}</td>
            <td class="text-center">{{ formatDate(item.created_at) }}</td>
            <td class="text-center">{{ formatDate(item.updated_at) }}</td>
          </tr>
        </tbody>

        </table>
      </div>
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

      
    </div>

      
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'ManageUser',
  data() {
    return {
      search: '',
      showModal: false,
      selectedUserType: 'all', // Default to 'all'
      showPassword: false,
      itemsPerPage: 10,
      currentPage: 1,
      sortDirection: 'asc', // Default sort direction
      userTypes: ['all', 'admin', 'teacher', 'student'], // Example user types
      serverItems: [],
      currentUser: {}  // Holds the user data being edited
    };
  },
  computed: {
    filteredItems() {
      return this.serverItems.filter(item => {
        const idnumberStr = item.idnumber ? item.idnumber.toString().toLowerCase() : '';
        const searchLower = this.search.toLowerCase();
        return (
          (this.selectedUserType === 'all' || item.usertype === this.selectedUserType) &&
          (idnumberStr.includes(searchLower) ||
          (item.username && item.username.toLowerCase().includes(searchLower)) ||
          (item.lname && item.lname.toLowerCase().includes(searchLower)) ||
          (item.fname && item.fname.toLowerCase().includes(searchLower)) ||
          (item.mname && item.mname.toLowerCase().includes(searchLower)))
        );
      });
    },
    sortedFilteredItems() {
      const sortedItems = [...this.filteredItems].sort((a, b) => {
        const comparison = a.lname.localeCompare(b.lname); // Sort by last name
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
      return sortedItems;
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedFilteredItems.slice(start, end); // Use sortedFilteredItems here
    },
    totalPages() {
      return Math.ceil(this.sortedFilteredItems.length / this.itemsPerPage); // Use sortedFilteredItems here
    },
    maleCountPerPage() {
      return this.paginatedItems.filter(item => item.sex === 'male').length;
    },
    femaleCountPerPage() {
      return this.paginatedItems.filter(item => item.sex === 'female').length;
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewallusers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.serverItems = response.data;
      } catch (error) {
        alert('Error fetching data:', error.message);
      }
    },
    openModal(user) {
      this.currentUser = { ...user };
      this.showModal = true;
    },
    
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    formatDate(date) {
      return moment(date).format('YYYY/M/D [time] h:mm a');
    },
    sortItems(direction) {
      this.sortDirection = direction;
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.container-fluid {
  background-color: #ffffff;
  border-radius: 10px;
}

tbody{
  font-size: 15px;
}

h4 {
  color: rgb(6, 0, 0);
  padding: 10px;
  padding-top: 20px;

}
.lalaki, .babae{
  font-size: 20px;
  padding-left: 50px;
  padding-right: 12px;
}
.lalaki {
  color: blue;
}
.babae {
  color: red;
}
.icon-container {
  display: flex;
  gap: 10px; /* Space between the boxes */
}

.icon-box {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 40px;
  border-radius: 5px;
  cursor: pointer;
}
/* Table Wrapper */
.table-wrapper {
  margin: 0 auto;
  padding: 0 15px;
  max-width: 100%;
  overflow-x: auto;
  
}

/* Table Styles */
.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(5, 4, 4, 0.1);
  border: 1px solid #200909;
  overflow: hidden;
}

.table-custom th {
  background-color: #0d8eead7;
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


.form-select {
  width: 200px;
}

.modal-content {
  border: 2px solid #87CEFA; /* Sky blue border */
  border-radius: 10px; /* Rounded corners */
}

.modal-header {
  background-color: #00BFFF; /* Deep sky blue header background */
  color: #130404; /* Dark text color */
  border-bottom: 1px solid #ddd; /* Light border below header */
}

.modal-title {
  font-size: 1.25rem; /* Larger font size for the title */
  font-weight: bold;
}

.btn-close {
  filter: invert(1); /* White close button icon */
}

.modal-body {
  background-color: #f0f8ff; /* Alice blue background for form */
}

.input-group-text {
  background-color: #e0ffff; /* Light cyan background for input labels */
  border: 1px solid #ced4da; /* Light border around input labels */
  color: #495057; /* Dark grey text color */
}

.form-control {
  border-radius: 5px; /* Rounded corners for input fields */
  border: 1px solid #ced4da; /* Light border around input fields */
}

.form-control:focus {
  border-color: #87CEFA; /* Sky blue border on focus */
  box-shadow: 0 0 0 0.2rem rgba(135, 206, 250, 0.25); /* Sky blue shadow on focus */
}

.modal-footer {
  border-top: 1px solid #ddd; /* Light border above footer */
}

.btn-secondary {
  background-color: #6c757d; /* Grey background for secondary button */
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268; /* Darker grey on hover */
}

.btn-primary {
  background-color: #00BFFF; /* Deep sky blue background for primary button */
  border: none;
}

.btn-primary:hover {
  background-color: #1E90FF; /* Dodger blue on hover */
}
</style>
