<template>
  <div>
    <div class="container-fluid">
      <div class="header-container">
        <img src="@/assets/enhs logo.jpg" alt="Left Logo" class="enhslogo">
        <h3 class="text-center">Report Generation for List of Students</h3>
        <img src="@/assets/Deped-Logo.png" alt="Right Logo" class="depedlogo">
      </div>
      <div class="row mb-4 justify-content-end align-items-center">
        <div class="col-md-2 d-flex align-items-center">
          <select v-model="selectedGender"  class="form-control custom-select"  id="gender">
            <option v-for="type in gender" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-center">
          <select v-model="formData.strand_id" class="form-control custom-select" id="userStrand">
          <option value="">All Strands</option>
          <option v-for="strand in strands" :key="strand.id" :value="strand.id">
            {{ strand.label }}
          </option>
        </select>
      </div>
      <div class="col-md-3 d-flex align-items-center">
        <select v-model="formData.section_id" id="section" class="form-select custom-select" style="margin-right: 30px;" required>
          <option value="">Select Section</option>
              <option v-for="section in filteredSections" :key="section.id" :value="section.id">
                {{ section.label }}
              </option>
        </select>
      </div>
      
      
    </div>


      <div class="table-wrapper">
        <table class="table table-bordered table-hover table-custom">
          <thead class="table-info">
            <tr>
              <th scope="col" class="text-center">No.</th>
              <th scope="col" class="text-center">LRN</th>
              <th scope="col" class="text-center">Name</th>
              <th scope="col" class="text-center">Sex</th>
              <th scope="col" class="text-center">Strand</th>
              <th scope="col" class="text-center">Section</th>
              <th scope="col" class="text-center">4Ps member</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in paginatedItems" :key="student.idnumber">
              <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ student.user.idnumber }}</td>
              <td class="text-center">{{ student.user.lname }}, {{ student.user.fname }} {{ student.user.mname }}</td>
              <td class="text-center">{{ student.user.sex }}</td>
              <td class="text-center">{{ student.strands.addstrand }} {{ student.strands.grade_level }}</td>
              <td class="text-center">{{ student.section.section }}</td>
              <td class="text-center">{{ student.fourp == 1 ? 'Yes' : 'No' }}</td>
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

      <!-- Add a button to generate the report -->
      <div class="row ">
        <div class="col-md-12 text-end">
          <button @click="generateReport" class="btn btn-gradient">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import axios from 'axios';
import config from '@/config';

export default {
  name: 'ManageUserStudents',
  data() {
    return {
      search: '',
      formData: {
        section_id: '',
        strand_id: '',
      },
      selectedStrand: '',
      sections: [],
      strands: [],
      filteredSections: [],
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
        const strandMatches = !this.formData.strand_id || item.strands.id === this.formData.strand_id;
        const sectionMatches = !this.formData.section_id || item.section.id === this.formData.section_id;
        const genderMatches = this.selectedGender === 'all' || item.user.sex.toLowerCase() === this.selectedGender.toLowerCase();
        return (
          strandMatches &&
          sectionMatches &&
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
     'formData.strand_id': 'filterSections',
    'formData.section_id': 'filterSections'
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await axios.get(`${config.apiBaseURL}/viewAllStudents2`, {
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
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiBaseURL}/viewstrand`, {
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
        const response = await axios.get(`${config.apiBaseURL}/viewsection`, {
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
    async generateReport() {
      try {
        const response = await axios.post(`${config.apiBaseURL}/generatePDF`, {
          gender: this.selectedGender,
          strand: this.formData.strand_id,
          section: this.formData.section_id
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
    background-color: #c1c1c1d7;
  box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.3);
  color: #120808;
  transition: background 0.3s ease;
  border-radius: 5px ;
  margin-bottom: 60px;
  margin-right: 25px;
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
  