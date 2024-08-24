<template>
  <div>
    <div class="container-fluid">
      <h4 class="text-center">Student Users </h4><br>
      <div class="row mb-4 justify-content-end align-items-center">
        <div class="col-md-4 d-flex align-items-center">
          <label for="userType" class="form-label me-2">SELECT GENDER:</label>
          <select v-model="selectedGender" class="form-select" id="gender">
            <option v-for="type in gender" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div class="col-md-4 d-flex align-items-center">
          <label for="userStrand" class="form-label me-2">SELECT STRAND:</label>
          <select v-model="selectedStrand" class="form-select" id="userStrand">
          <option value="">All Strands</option>
          <option v-for="strand in strands" :key="strand.id" :value="strand.id">
            {{ strand.addstrand }} {{ strand.grade_level }}
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
                  <i class="bi bi-key-fill custom-icon" @click="openResetModal(students)"></i>

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

      <div class="row mb-4">
        <div class="col-md-2">
          <h6 class="text-center">Male : {{ maleCountPerPage }}</h6>
        </div>
        <div class="col-md-2">
          <h6 class="text-center">Female : {{ femaleCountPerPage }}</h6>
        </div>
        <div class="col-md-8">
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
    <!-- Reset Password Modal -->
    <div v-if="showResetModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Reset Password</h5>
            <button type="button" class="btn-close" @click="showResetModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            
            <form @submit.prevent="resetPassword">
              
              <div class="row">
                <div class="mb-3 col-12 col-md-8">
                  <label for="newPassword" class="form-label">New Password</label>
                  <input type="text" class="form-control" id="newPassword" v-model="form.newPassword" required>
                </div>
                <div class="mb-3 col-12 col-md-4">
                  <button type="button" class="btn btn-secondary" @click="generatePassword">Generate New Password</button>
                </div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm New Password</label>
                <input type="text" class="form-control" id="confirmPassword" v-model="form.confirmPassword" required>
              </div>
              <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>
              <button type="submit" class="btn btn-primary">Reset Password</button>
            </form>
          </div>
        </div>
      </div>
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
      selectedStrand: '',
      strands: [],
      selectedUserId: null, // ID of the user to update
      selectedGender: 'all',
      gender: ['all', 'male', 'female'],
      showModal: false,
      showResetModal: false,
      form: {
        newPassword: '',
        confirmPassword: ''
      },
      itemsPerPage: 10,
      currentPage: 1,
      serverItems: [],
      currentUser: {}  // Holds the user data being edited
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
        const strandMatches = !this.selectedStrand || item.strands.id === this.selectedStrand;
        const genderMatches = this.selectedGender === 'all' || item.user.sex.toLowerCase() === this.selectedGender.toLowerCase();
        return (
          strandMatches &&
          genderMatches &&
          (idnumberStr.includes(searchLower) ||
           lname.includes(searchLower) ||
           fname.includes(searchLower) ||
           mname.includes(searchLower))
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
    openModal(user) {
      this.currentUser = { ...user };
      this.showModal = true;
    },
    openResetModal(user) {
      if (user && user.id) {
        this.currentUser = user;
        this.showResetModal = true;
      } else {
        console.error('User object is undefined or missing the id property.');
      }
    },

    async saveChanges() {
      try {
        await axios.put(`http://localhost:8000/api/users/${this.currentUser.id}`, this.currentUser, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        alert('Changes saved successfully');
        this.showModal = false;
        this.fetchStudents();
      } catch (error) {
        alert('Error saving changes: ' + (error.response ? error.response.data : error.message));
      }
    },
    async removeUser(user) {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await axios.delete(`http://localhost:8000/api/users/${user.idnumber}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          alert('User deleted successfully');
          this.fetchStudents();
        } catch (error) {
          alert('Error deleting user: ' + (error.response ? error.response.data : error.message));
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
        alert('Error fetching students: ' + error.message);
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    async fetchStrands() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewstrand', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.strands = response.data.data; // Ensure this is correct based on your API response
      } catch (error) {
        console.error('Error fetching strands:', error.response ? error.response.data : error.message);
      }
    },
    generatePassword() {
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      this.form.newPassword = password;
      this.form.confirmPassword = password; // Set confirm password to the generated password
    },
    async resetPassword() {
      const newPassword = this.form.newPassword;
      const confirmPassword = this.form.confirmPassword;

      if (newPassword !== confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      if (!this.currentUser.id) {
        this.errorMessage = 'Please select a user.';
        return;
      }

      try {
        const response = await axios.put(`http://localhost:8000/api/user/${this.currentUser.id}/update-password`, {
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        alert(response.data.message);
        this.showResetModal = false;
        this.fetchStudents();
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : 'An error occurred while updating the password.';
      }
    }
  },
  mounted() {
    this.fetchStudents();
    this.fetchStrands();
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
