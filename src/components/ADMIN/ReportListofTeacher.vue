<template>
    <div>
      <div class="container-fluid">
        <h4 class="text-center">Teachers Accounts</h4><br>
        <div class="row mb-4 justify-content-end align-items-center">
        
          
         
  
       
        </div>
  
        <!-- Teachers Table -->
        <table class="table table-bordered table-hover">
          <thead class="table-info">
            <tr>
              <th scope="col" class="text-center">No.</th>
              <th scope="col" class="text-center">Employee Number</th>
              <th scope="col" class="text-center">Name</th>
              <th scope="col" class="text-center">Sex</th>
              <th scope="col" class="text-center">Email</th>
              <th scope="col" class="text-center">Position</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(teacher, index) in paginatedItems" :key="teacher.user.idnumber">
              <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ teacher.user.idnumber }}</td>
              <td class="text-center">{{ teacher.user.lname }}, {{ teacher.user.fname }} {{ teacher.user.mname }}</td>
              <td class="text-center">{{ teacher.user.sex }}</td>
              <td class="text-center">{{ teacher.user.email }}</td>
              <td class="text-center">{{ teacher.position.teacher_postion }} </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Pagination -->
       
  
        <!-- Generate Report Button -->
        <div class="row mb-4">
          <div class="col-md-12 text-end">
            <button @click="generateReport" class="btn btn-primary">Generate Report</button>
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
                  <!-- Form Fields for editing user details -->
                  <div class="mb-3">
                    <label for="editName" class="form-label">Name</label>
                    <input type="text" id="editName" v-model="currentUser.user.lname" class="form-control" placeholder="Last Name">
                  </div>
                  <div class="mb-3">
                    <label for="editEmail" class="form-label">Email</label>
                    <input type="email" id="editEmail" v-model="currentUser.user.email" class="form-control" placeholder="Email">
                  </div>
                  <!-- Add more form fields as needed -->
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
          const response = await axios.get('http://localhost:8000/api/viewAllTeachers', {
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
          const response = await axios.get('http://localhost:8000/api/viewposition', {
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
          const response = await axios.post('http://localhost:8000/api/generateTeacherPDF', {
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
  /* Add your styles here */
  </style>
  