<template>
  <div>
    <div class="container-fluid">
        <div class="d-flex align-items-center justify-content-between">
        <h4><i class="bi bi-person-fill"></i> List of Students Accounts</h4>
        <router-link to="/aregisterstudent" title="Add Record" class="btn-gradient d-flex align-items-center">
          <i class="bi bi-clipboard2-plus-fill register me-2"></i> Add Record
        </router-link>
      </div><br>
      <div class="row mb-4 justify-content-end align-items-center">
        <div class="col-md-7">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input type="text" v-model="search"  class="form-control custom-select"  placeholder="Search" />
          </div>
        </div>
        <div class="col-md-2 d-flex align-items-center">
          <select v-model="selectedGender"  class="form-control custom-select"  id="gender">
            <option v-for="type in gender" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-center">
          <select v-model="selectedStrand"  class="form-control custom-select"  id="userStrand">
          <option value="">All Strands</option>
          <option v-for="strand in strands" :key="strand.id" :value="strand.id">
            {{ strand.label }}
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
            <th scope="col" class="text-center">Students Profile</th>
            <th scope="col" class="text-center">Sex</th>
            <th scope="col" class="text-center">Date </th>
            <th scope="col" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(students, index) in paginatedItems" :key="students.idnumber">
            <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td><b>{{ students.user.idnumber }}</b></td>
            <td class="text-center">
              <b>{{ students.user.lname }}, {{ students.user.fname }} {{ students.user.mname }}</b> <br>
              <i>{{ students.user.email }}</i><br>
              {{ students.strands.addstrand }} {{ students.strands.grade_level }} - {{ students.section.section }}
            </td>
            <td class="text-center">{{ students.user.sex }}</td>
            <td class="text-center">
              <b>Registered :</b>{{ formatDate(students.created_at) }}<br>
              <b>Modified :</b>{{ formatDate(students.updated_at) }}
            </td>
            <td class="text-center">
              <div class="icon-container">
                <span class="icon-box reset-box">
                  <i class="bi bi-key-fill custom-icon" @click="openResetModal(students)"></i>

                </span>
                <span class="icon-box edit-box">
                  <i class="bi bi-pencil-square custom-icon" @click="openModal(students)"></i>
                </span>
               
              </div>
            </td>
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
              <div class="row mb-3">
              <div class="col-md-6">
                <label for="idnumber" class="form-label">ID NUMBER:</label>
                <input type="idnumber" id="idnumber" v-model="currentUser.user.idnumber" class="form-control" >
              </div>
              <div class="col-md-6">
                <label for="email" class="form-label">Email Address:</label>
                <input type="email" id="email" v-model="currentUser.user.email" class="form-control" >
              </div>
            </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="lname" class="form-label">Last Name:</label>
                  <input type="text" id="lname" v-model="currentUser.user.lname" class="form-control" >
                </div>
                <div class="col-md-4">
                  <label for="fname" class="form-label">First Name:</label>
                  <input type="text" id="fname" v-model="currentUser.user.fname" class="form-control" >
                </div>
                <div class="col-md-4">
                  <label for="mname" class="form-label">Middle Name:</label>
                <input type="text" id="mname" v-model="currentUser.user.mname" class="form-control" >
                </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label d-block">Gender:</label>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="gender" id="male" value="male" v-model="currentUser.user.sex">
                  <label class="form-check-label" for="male">Male</label>
                </div>
                <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="gender" id="female" value="female" v-model="currentUser.user.sex">
                  <label class="form-check-label" for="female">Female</label>
                </div>
              </div>
              <div class="col-md-4">
                <label for="strand" class="form-label">Strand:</label>
                <select v-model="formData.strand_id" id="strand" class="form-select" required>
                  <option value="">Select Strand</option>
                  <option v-for="strand in strands" :key="strand.id" :value="strand.id">
                    {{ strand.label }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="section" class="form-label">Section:</label>
                <select v-model="formData.section_id" id="section" class="form-select" required>
                  <option value="">Select Section</option>
                  <option v-for="section in filteredSections" :key="section.id" :value="section.id">
                    {{ section.label }}
                  </option>
                </select>
              </div>
              <!-- <div class="col-md-5">
          <label for="Mobile_no" class="form-label">Mobile Number:</label>
          <input v-model="currentUser.Mobile_no" type="tel" id="Mobile_no" class="form-control" required>
        </div> -->
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
import Swal from 'sweetalert2';
export default {
  name: 'ManageUserStudents',
  data() {
    return {

      search: '',
      selectedStrand: '',
  
      selectedUserId: null, // ID of the user to update
      selectedGender: 'Filter By Gender',
      gender: ['Filter By Gender', 'male', 'female'],
      showModal: false,
      showResetModal: false,
      form: {
        newPassword: '',
        confirmPassword: ''
      },
      itemsPerPage: 10,
      currentPage: 1,
      serverItems: [],
      currentUser: {}, 
      // Holds the user data being edited
      formData: {
        idnumber: '',
        lname: '',
        fname: '',
        mname: '',
        sex: '',
        // usertype: 'student',
        email: '',
        password: '',
        section_id: '',
        strand_id: '',
        Mobile_no: '',
      },
      
      sections: [],
      strands: [],
      filteredSections: [],
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
        const genderMatches = this.selectedGender === 'Filter By Gender' || item.user.sex.toLowerCase() === this.selectedGender.toLowerCase();
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
  mounted() {
    this.fetchStudents();
    this.fetchStrands();
    this.fetchSections();
  
  },
  watch: {
    'formData.strand_id': 'filterSections' // Watch for changes to strand_id
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
      const userId = this.currentUser.user.id;
      const formData = {
        lname: this.currentUser.user.lname,
        fname: this.currentUser.user.fname,
        mname: this.currentUser.user.mname,
        sex: this.currentUser.user.sex,
        email: this.currentUser.user.email,
        strand_id: this.formData.strand_id,
        section_id: this.formData.section_id,
        // Mobile_no: this.currentUser.user.Mobile_no,
      };

      if (this.formData.password) {
        formData.password = this.formData.password;
      }

      axios.put(`http://localhost:8000/api/updateStudentDetails/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Student details updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
      }).then(() => {
        // Refresh the data here
        this.fetchStudents(); // Assuming you have a fetchData method to refresh the data
        this.showModal = false;
      });
    })
      .catch(error => {
        console.error('Error saving changes:', error.response ? error.response.data : error.message);
      });
    },
    async fetchStudents() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewAllStudents2', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.serverItems = response.data.students;
        this.strands = response.data.strands; // Assuming strands are also fetched here
        this.sections = response.data.sections; 
      } catch (error) {
        alert('Error fetching students: ' + error.message);
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    async fetchStrands() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewstrand', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && Array.isArray(response.data.data)) {
          this.strands = response.data.data.map(strand => ({
            id: strand.id,
            value: `${strand.addstrand} ${strand.grade_level}`,
            label: `${strand.addstrand} ${strand.grade_level}`
          }));
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching strands:', error);
      }
    },
    async fetchSections() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewsection', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.sections && Array.isArray(response.data.sections)) {
          this.sections = response.data.sections.map(section => ({
            id: section.id,
            strand_id: section.strand.id,
            value: section.section,
            label: `${section.section}`
          }));
          this.filterSections(); // Initialize filtered sections
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    },
    filterSections() {
      if (this.formData.strand_id) {
        this.filteredSections = this.sections.filter(section => section.strand_id === this.formData.strand_id);
      } else {
        this.filteredSections = this.sections;
      }
    },
    generatePassword() {
      const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
      const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const digits = "0123456789";
      const specialChars = "!@#$%^&*()";

      let password = "";

      // Ensure at least one character from each category
      password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
      password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
      password += digits[Math.floor(Math.random() * digits.length)];
      password += specialChars[Math.floor(Math.random() * specialChars.length)];

      // Fill the rest of the password with random characters
      const charset = lowercaseChars + uppercaseChars + digits + specialChars;
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }

      // Shuffle the password to ensure randomness
      password = password.split('').sort(function() {
        return 0.5 - Math.random();
      }).join('');

      this.form.newPassword = password;
      this.form.confirmPassword = password; // Set confirm password to the generated password
    },
    async resetPassword() {
      const userId = this.currentUser.user.id;
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
        let response = await axios.put(`http://localhost:8000/api/user/${userId}/update-password`, {
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        Swal.fire({
          title: 'Success!',
          text: response.data.message , // Use the response message as the text
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchStudents(); // Assuming you have a fetchData method to refresh the data
            this.showResetModal = false;
          }
        });
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : 'An error occurred while updating the password.';
      }
    }
  },
  
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
