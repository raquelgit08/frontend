<template>
  <div>
    <div class="container-fluid ">
      <h4 class="text-center">Manage Users TEACHERS</h4><br>
      <div class="row mb-4 justify-content-end align-items-center">
        
        <!-- Dropdown for Position Filtering -->
        <div class="col-md-4 d-flex align-items-center">
          <label for="userPosition" class="form-label me-2">SELECT POSITION:</label>
          <select v-model="selectedPosition" class="form-select" id="userPosition">
            <option value="">All Positions</option>
            <option v-for="position in positions" :key="position" :value="position">{{ position }}</option>
          </select>
        </div>
        <!-- Search Input -->
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input type="text" v-model="search" class="form-control" placeholder="Search" />
            <router-link to="/aregisterteacher" title="Add Record">
              <i class="bi bi-clipboard2-plus-fill register"></i>
            </router-link>
          </div>
          
        </div>
      </div>

      <!-- Table -->
      <table class="table table-bordered table-hover">
        <thead class="table-primary">
          <tr>
            <th scope="col" class="text-center">No.</th>
            <th scope="col" class="text-center">LRN</th>
            <th scope="col" class="text-center">Name</th>
            <th scope="col" class="text-center">Sex</th>
            <th scope="col" class="text-center">Email</th>
            <th scope="col" class="text-center">Position</th>
            <th scope="col" class="text-center">Date Registered</th>
            <th scope="col" class="text-center">Date Modified</th>
            <th scope="col" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in sortedFilteredItems" :key="item.lrn">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">{{ item.idnumber }}</td>
            <td class="text-center">{{ item.lname }}, {{ item.fname }} {{ item.mname }}
              <div>
                <span v-if="isActive" class="status-active">Active</span>
                <span v-else class="status-inactive">Inactive</span>
                <button @click="toggleStatus">Change</button>
              </div>

            </td>
            <td class="text-center">{{ item.sex }}</td>
            <td class="text-center">{{ item.email }}</td>
            <td class="text-center">{{ item.teacher_Position }}</td>
            <td class="text-center">{{ formatDate(item.created_at) }}</td>
            <td class="text-center">{{ formatDate(item.updated_at) }}</td>
            <td class="text-center">
              <div class="icon-container">
                <span class="icon-box reset-box">
                  <i class="bi bi-key-fill custom-icon" @click="openModal(item)"></i>
                </span>
                <span class="icon-box edit-box">
                  <i class="bi bi-pencil-square custom-icon" @click="openModal(item)"></i>
                </span>
                <span class="icon-box delete-box">
                  <i class="bi bi-person-x-fill custom-icon" @click="removeUser(item)"></i>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit User</h5>
            <button type="button" class="btn-close" @click="showModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="id" class="form-label">ID / LRN Number:</label>
                  <input type="text" id="id" v-model="currentUser.idnumber" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label d-block">Gender:</label>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="gender" id="male" value="male" v-model="currentUser.sex">
                    <label class="form-check-label" for="male">Male</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="gender" id="female" value="female" v-model="currentUser.sex">
                    <label class="form-check-label" for="female">Female</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="position" class="form-label">Position:</label>
                  <input type="text" id="position" v-model="currentUser.teacher_Position" class="form-control" required>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="lname" class="form-label">Last Name:</label>
                  <input type="text" id="lname" v-model="currentUser.lname" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label for="fname" class="form-label">First Name:</label>
                  <input type="text" id="fname" v-model="currentUser.fname" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label for="mname" class="form-label">Middle Name:</label>
                  <input type="text" id="mname" v-model="currentUser.mname" class="form-control" required>
                </div>
              </div>
              
              
            
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="email" class="form-label">Email Address:</label>
                  <input type="email" id="email" v-model="currentUser.email" class="form-control" required>
                </div>
                <div class="col-md-6 position-relative">
                  <label for="password" class="form-label">Password:</label>
                  <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="currentUser.password" class="form-control" required>
                    <button type="button" class="btn btn-outline-secondary" @click="togglePasswordVisibility">
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showModal = false">Close</button>
            <button type="button" class="btn btn-primary" @click="saveChanges">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import moment from 'moment';

export default {
  name: 'ManageUserTeachers',
  data() {
    return {
      search: '',
      showModal: false,
      sortDirection: 'asc', // default sort direction
      selectedPosition: '',
      positions: ['Teacher 1', 'Teacher 2', 'Teacher III'],
      serverItems: [],
      currentUser: {},  // Holds the user data being edited
      showPassword: false,  // Track password visibility state
      isActive: true
    };
  },
  computed: {
    filteredItems() {
      return this.serverItems.filter(item => {
        const idnumberStr = item.idnumber ? item.idnumber.toString().toLowerCase() : '';
        const searchLower = this.search.toLowerCase();
        return (
          (this.selectedPosition === '' || item.teacher_Position === this.selectedPosition) &&
          (idnumberStr.includes(searchLower) ||
          (item.username && item.username.toLowerCase().includes(searchLower)) ||
          (item.lname && item.lname.toLowerCase().includes(searchLower)) ||
          (item.fname && item.fname.toLowerCase().includes(searchLower)) ||
          (item.email && item.email.toLowerCase().includes(searchLower)))
        );
      });
    },
    sortedFilteredItems() {
      const sortedItems = [...this.filteredItems].sort((a, b) => {
        const comparison = a.lname.localeCompare(b.lname); // Sorting by last name
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
      return sortedItems;
    }
  },

  methods: {
    async fetchData() {
    try {
      const response = await axios.get('http://localhost:8000/api/index', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      this.serverItems = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
    openModal(user) {
      this.currentUser = { ...user };
      this.showModal = true;
    },
    saveChanges() {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    axios.put(`http://localhost:8000/api/user/${this.currentUser.id}`, this.currentUser, {
      headers: {
        Authorization: `Bearer ${token}` // Add the token to the request headers
      }
    })
      .then(() => {
        this.fetchData();
        this.showModal = false;
      })
      .catch(error => {
        console.error('Error saving changes:', error);
      });
  },
    removeUser(user) {
      axios.delete(`http://localhost:8000/api/users/${user.id}`)
        .then(() => {
          this.fetchData();
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
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
    toggleStatus() {
      this.isActive = !this.isActive; // Toggles the value of isActive
    }
  },
  mounted() {
    this.fetchData();
  },
}
</script>

<style scoped>
.container-fluid {
  margin-top: 10px;
  padding: 20px;
}
.status-active {
  color: green;
  font-weight: bold;
}

.status-inactive {
  color: red;
  font-weight: bold;
}
.register{
  font-size: 30px; padding-left: 20px;
  color: #495057;

}
h4 {
  background-color: #87CEFA; /* Sky blue background */
  color: rgb(6, 0, 0);
  padding: 10px;
  border-radius: 8px 8px 0 0;
  font-family: 'Georgia', serif;
  margin-bottom: 20px;
}

.custom-icon {
  cursor: pointer;
  color: black;
  font-size: 25px;
}

.custom-icon:hover {
  color: rgb(18, 108, 211);
  font-size: 30px;
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
