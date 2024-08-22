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
            <th scope="col" class="text-center">Strand </th>
            <th scope="col" class="text-center">Section</th>
            <th scope="col" class="text-center">Date Registered</th>
            <th scope="col" class="text-center">Date Modified</th>
            <th scope="col" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(students, index) in paginatedItems" :key="students.idnumber">
            <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ students.user.idnumber }}</td>
            <td class="text-center">{{ students.user.lname }}, {{ students.user.fname }} {{ students.user.mname }}</td>
            <td class="text-center">{{ students.user.sex }}</td>
            <td class="text-center">{{ students.user.email }}</td>
            <td class="text-center">{{ students.strands.addstrand }} {{ students.strands.grade_level }}</td>
            <td class="text-center">{{ students.section.section }}</td>
            <td class="text-center">{{ formatDate(students.created_at) }}</td>
            <td class="text-center">{{ formatDate(students.updated_at) }}</td>
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

    <!-- Modal for Editing User -->
    <div v-if="showModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit User</h5>
            <button type="button" class="btn-close" @click="showModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <!-- Form Fields -->
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
      students: [],
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
      try {
        const response = await axios.put(`http://localhost:8000/api/users/${this.currentUser.id}`, this.currentUser, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        alert(response.data.message);
        this.showModal = false;
        this.fetchStudents();
      } catch (error) {
        alert('Error saving changes:', error.response ? error.response.data : error.message);
      }
    },
    async removeUser(user) {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          const response = await axios.delete(`http://localhost:8000/api/users/${user.idnumber}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          alert(response.data.message);
          this.fetchStudents();
        } catch (error) {
          alert('Error deleting user:', error.response ? error.response.data : error.message);
        }
      }
    },
    async fetchStudents() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewAllStudents', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.serverItems = response.data.students;
      } catch (error) {
        alert('Error fetching students:', error.message);
      }
    },
    changePage(page) {
      this.currentPage = page;
    }
  },
  mounted() {
    this.fetchStudents();
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
