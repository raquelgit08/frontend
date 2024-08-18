<template>
  <div>
    <div class="container-fluid">
      <h4 class="text-center">Student Users </h4><br>
      <div class="row mb-4 justify-content-end align-items-center">
        <div class="col-md-4 d-flex align-items-center">
          <label for="userStrand" class="form-label me-2">SELECT STRAND:</label>
          <select v-model="selectedStrand" class="form-select" id="userStrand">
            <option value="">All Strands</option>
            <option v-for="strand in strands" :key="strand.value" :value="strand.value">
              {{ strand.label }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input type="text" v-model="search" class="form-control" placeholder="Search" />
            <router-link to="/aregisterstudent" title="Add Record">
              <i class="bi bi-clipboard2-plus-fill register"></i>
            </router-link>
          </div>
        </div>
      </div>

      <table class="table table-bordered table-hover">
        <thead class="table-info">
          <tr>
          <th scope="col" class="text-center">No.</th>
          <th scope="col" class="text-center">LRN</th>
          <th scope="col" class="text-center">Name</th>
          <th scope="col" class="text-center">Sex</th>
          <th scope="col" class="text-center">Email</th>
          <th scope="col" class="text-center">Strand</th>
          <th scope="col" class="text-center">Grade Level</th>
          <th scope="col" class="text-center">Date Registered</th>
          <th scope="col" class="text-center">Date Modified</th>
          <th scope="col" class="text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedItems" :key="item.idnumber">
            <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="text-center">{{ item.idnumber }}</td>
            <td class="text-center">{{ item.lname}},{{ item.fname}} {{ item.mname}}</td>
            <td class="text-center">{{ item.sex }}</td>
            <td class="text-center">{{ item.email }}</td>
            <td class="text-center">{{ item.strand }}</td>
            <td class="text-center">{{ item.gradelevel }}</td>
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

      <!-- Basic Pagination Controls -->
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
                <label for="id" class="form-label">LRN Number:</label>
                <input type="text" id="id" v-model="currentUser.idnumber" class="form-control" >
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
                <label for="strand" class="form-label">Strand:</label>
                <select v-model="currentUser.strand" id="strand" class="form-select">
                  <option v-for="(strand, index) in strands" :key="index" :value="strand.value">{{ strand.label }}</option>
                </select>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="lname" class="form-label">Last Name:</label>
                <input type="text" id="lname" v-model="currentUser.lname" class="form-control" >
              </div>
              <div class="col-md-4">
                <label for="fname" class="form-label">First Name:</label>
                <input type="text" id="fname" v-model="currentUser.fname" class="form-control" >
              </div>
              <div class="col-md-4">
                <label for="mname" class="form-label">Middle Name:</label>
                <input type="text" id="mname" v-model="currentUser.mname" class="form-control" >
              </div>
            </div>
            

            <div class="row mb-3">
              <div class="col-md-6">
                <label for="email" class="form-label">Email Address:</label>
                <input type="email" id="email" v-model="currentUser.email" class="form-control" >
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
  name: 'ManageUserStudents',
  data() {
    return {
      search: '',
      showModal: false,
      selectedStrand: '',
      strands: [
      { value: '', label: 'All Strands' }, // Option to show all strands
      { value: 'HUMMS', label: 'HUMMS' },
      { value: 'STEM', label: 'STEM' },
      { value: 'TVL-ICT', label: 'TVL-ICT' },
      { value: 'ABM', label: 'ABM' }
    ],
      showPassword: false,
      itemsPerPage: 10,
      currentPage: 1,
    
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
        (!this.selectedStrand || item.strand === this.selectedStrand) &&
        (idnumberStr.includes(searchLower) ||
        (item.username && item.username.toLowerCase().includes(searchLower)) ||
        (item.lname && item.lname.toLowerCase().includes(searchLower)) ||
        (item.fname && item.fname.toLowerCase().includes(searchLower)) ||
        (item.mname && item.mname.toLowerCase().includes(searchLower)))
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
    }
  },
  methods: {
    formatDate(date) {
    return moment(date).format('YYYY/M/D [time] h:mm a');
  },
    openModal(user) {
      this.currentUser = { ...user };
      this.showModal = true;
    },
    async saveChanges() {
    // Example Axios PUT request
      axios.put(`http://localhost:8000/api/users/${this.currentUser.id}`, this.currentUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        alert (response.data.message);
      })
      .catch(error => {
        alert.error('Error saving changes:', error.response ? error.response.data : error.message);
      });

    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/api/index2', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.serverItems = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    
    removeUser() {
      axios.delete('http://localhost:8000/api/users/${user.id}')
        .then(() => {
          this.fetchData();
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    },
    
  },
  mounted() {
    this.fetchData();
  }
};
</script>


<style scoped>
.container-fluid {
  margin-top: 10px;
 
}
tbody{
  font-size: 15px;

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
  color: rgb(255, 255, 255);
  font-size: 18px;
}

.icon-container {
  display: flex;
  gap: 10px; /* Space between the boxes */
}
.register{
  font-size: 30px; padding-left: 20px;
  color: #495057;

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
.reset-box {
  background-color: #efd305; 
  color: white; /* White icon color */
}
.edit-box {
  background-color: #0f64dc; 
  color: white; /* White icon color */
}

.delete-box {
  background-color: #e50c0c; /* Red background */
  color: white; /* White icon color */
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
