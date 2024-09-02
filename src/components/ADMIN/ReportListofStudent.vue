<template>
    <div>
      <div class="container-fluid">
        <h4 class="text-center">Report Generation for List of Students</h4><br>
        <div class="row mb-4 justify-content-end align-items-center">
          
          
          <div class="col-md-4">
            <div class="input-group">
             
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
              <th scope="col" class="text-center">Section</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in paginatedItems" :key="student.idnumber">
              <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ student.user.idnumber }}</td>
              <td class="text-center">{{ student.user.lname }}, {{ student.user.fname }} {{ student.user.mname }}</td>
              <td class="text-center">{{ student.user.sex }}</td>
              <td class="text-center">{{ student.user.email }}</td>
              <td class="text-center">{{ student.strands.addstrand }} {{ student.strands.grade_level }}</td>
              <td class="text-center">{{ student.section.section }}</td>
            </tr>
          </tbody>
        </table>
  
      
  
        <!-- Add a button to generate the report -->
        <div class="row mb-4">
          <div class="col-md-12 text-end">
            <button @click="generateReport" class="btn btn-primary">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';


export default {
  name: 'ManageUserStudents',
  data() {
    return {
      search: '',
      selectedStrand: '',
      strands: [],
      selectedGender: 'all',
      gender: ['all', 'male', 'female'],
      itemsPerPage: 10,
      currentPage: 1,
      serverItems: [],
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
    async fetchStudents() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewAllStudents2', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.serverItems = response.data.students;
      } catch (error) {
        alert('Error fetching students: ' + error.message);
      }
    },
    async fetchStrands() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewstrand', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.strands = response.data.data;
      } catch (error) {
        console.error('Error fetching strands:', error.response ? error.response.data : error.message);
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    async generateReport() {
      try {
        const response = await axios.post('http://localhost:8000/api/generatePDF', {
          gender: this.selectedGender,
          strand: this.selectedStrand,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          responseType: 'blob' // Important for handling PDF files
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'student_report.pdf'); // Specify the filename
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        alert('Error generating report: ' + (error.response ? error.response.data.message : error.message));
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
  tbody {
    font-size: 15px;
  }
 
  .custom-icon {
    cursor: pointer;
    color: rgb(255, 255, 255);
    font-size: 18px;
  }
  .register {
    font-size: 30px;
    padding-left: 20px;
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
    color: white;
  }
  .edit-box {
    background-color: #0f64dc;
    color: white;
  }
  .delete-box {
    background-color: #e50c0c;
    color: white;
  }
  .form-select {
    width: 200px;
  }
  </style>
  