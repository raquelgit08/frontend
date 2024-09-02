<template>
  <div> 
    <div class="container-fluid">
      <div class="d-flex align-items-center justify-content-between">
        <h4><i class="bi bi-person-bounding-box"></i> List of Teachers Accounts</h4>
        <router-link to="/aregisterteacher" title="Add Record" class="btn-gradient d-flex align-items-center">
          <i class="bi bi-clipboard2-plus-fill register me-2"></i> Add Record
        </router-link>
      </div><br>
      <div class="row mb-4 justify-content-end align-items-center">
        <div class="col-md-8">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input type="text" v-model="search" class="form-control custom-select" placeholder="Search" />
          </div>
        </div>
        <div class="col-md-2 d-flex align-items-center">
          <!-- <label for="userType" class="form-label me-2">SELECT GENDER:</label> -->
          <select v-model="selectedGender" class="form-select custom-select" id="gender">
       
            <option v-for="type in gender" :key="type" :value="type">{{ type }} </option>
          </select>
        </div>
        <div class="col-md-2 d-flex align-items-center">
          <select v-model="position_id" id="position" class="form-select custom-select" required>
            <option value="">Filter by Position</option>
            <option v-for="position in positions" :key="position.id" :value="position.id">
              {{ position.teacher_postion }}
            </option>
          </select>
        </div>

        
      </div>

      <div class="table-wrapper">
        <table class="table table-hover table-custom">
          <thead class="table-info">
            <tr>
              <th scope="col" class="text-center">No.</th>
              <th scope="col" class="text-center">LRN</th>
              <th scope="col" class="text-center">Teachers Profile</th>
              <th scope="col" class="text-center">Sex</th>
              <th scope="col" class="text-center">Date</th>
              <th scope="col" class="text-center">Status</th>
              <th scope="col" class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(teachers, index) in paginatedItems" :key="teachers.idnumber">
              <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ teachers.user.idnumber }}</td>
              <td class="text-center">
                <b>{{ teachers.user.lname }}, {{ teachers.user.fname }} {{ teachers.user.mname }} </b><br>
                <i>{{ teachers.user.email }}</i><br>
                {{ teachers.position.teacher_postion }} 
              </td>
              <td class="text-center">{{ teachers.user.sex }}</td>
              <td class="text-center">
                <b>Registered :</b>{{ formatDate(teachers.created_at) }}<br>
                <b>Modified :</b>{{ formatDate(teachers.updated_at) }}
              </td>
              <td class="text-center">
                <div class="btn-group" role="group" aria-label="Active and Inactive">
                  <input  type="radio"  class="btn-check" name="options" id="activeRadio"  autocomplete="off" v-model="selectedOption"  value="active"/>
                  <label class="btn" :class="{'btn-success': selectedOption === 'active', 'btn-secondary': selectedOption !== 'active'}" for="activeRadio" >Active</label>

                  <input type="radio" class="btn-check" name="options" id="inactiveRadio" autocomplete="off" v-model="selectedOption" value="inactive"/>
                  <label class="btn" :class="{'btn-danger': selectedOption === 'inactive', 'btn-secondary': selectedOption !== 'inactive'}"  for="inactiveRadio"> Inactive</label>
                </div>
              </td>
              <td class="text-center">
                <div class="icon-container">
                  <span class="icon-box reset-box">
                    <i class="bi bi-key-fill custom-icon" @click="openModal(item)"></i>
                  </span>
                  <span class="icon-box edit-box">
                    <i class="bi bi-pencil-square custom-icon" @click="openModal(item)"></i>
                  </span>
                  
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
      showPassword: false,
      selectedGender: 'Filter By Gender', // Default to 'all'
      gender: ['Filter By Gender', 'male', 'female'],
      itemsPerPage: 10,
      currentPage: 1,
      serverItems: [],
       selectedOption: '',
      students: [],
      position_id: '', // Ensure this is defined
      positions: [],   // Initialize positions as an empty array
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
        const positionMatches = !this.position_id || item.position.id === this.position_id;
        const genderMatches = this.selectedGender === 'Filter By Gender' || item.user.sex.toLowerCase() === this.selectedGender.toLowerCase();

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
   
    async fetchTeachers() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewAllTeachers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.serverItems = response.data.teachers;
      } catch (error) {
        alert('Error fetching teachers:', error.message);
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    async fetchPositions() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewposition', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.positions = response.data.data; // Ensure this is correct based on your API response
      } catch (error) {
        console.error('Error fetching positions:', error.response ? error.response.data : error.message);
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

.custom-icon {
  cursor: pointer;
  color: rgb(255, 255, 255);
  font-size: 22px;
  
}

.icon-container {
  display: flex;
  gap: 10px; /* Space between the boxes */
}
.register{
  font-size: 20px;
  color: #ffffff;


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
  width: 40px;
}
.edit-box {
  background-color: #0f64dc; 
  color: white; /* White icon color */
  width: 40px;
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
.btn {
  transition: background-color 0.3s ease, color 0.3s ease;
  height: 30px;
}
/* Button Styles */
.btn-gradient {
  background: linear-gradient(45deg, #007bff, #00bfff);
  color: #120808;
  font-size: 17px;
  transition: background 0.3s ease;
  border-radius: 5px ;
  margin: 20px;
  padding: 5px;
  width: 170px;
  text-align: center;
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #0056b3, #0080ff);
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
