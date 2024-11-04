<template>
  <div class="container-fluid">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2 class="subject-title">{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} semester  | S.Y. :{{ subject.schoolYear }}</p>
        <p class="class-code">Class Code: <span>{{ subject.gen_code }}</span></p>
      </div>
    </div>

    <!-- Unified Navigation Bar -->
    <nav class="nav nav-pills">
      <router-link to="/teacheraddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-5">Go Back to Classes</i></span>
      </router-link>
      <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
    </nav>
    <!-- Invite Button -->
    <div class="d-flex justify-content-end mb-4">
      <!-- <input type="text"  v-model="searchQuery"  placeholder="Search by ID Number" style="margin-right: 10px; margin-left: "  class="form-control "/> -->
      <button class="btn-gradient" @click="openAddStudentModal">Add Students to Class</button>
    </div>

    <!-- Enrolled Students Table -->
    <!-- <h4 class="text-center">Enrolled Students</h4><br> -->
    <div class="container-fluid">
      
      <div class="row mb-4">
        <div class="col-md-12 ">
          <div class="table-wrapper">
            <table class="table table-bordered table-custom">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>LRN</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Middle Name</th>
                  <th>Sex</th>
                  <th>Strand</th>
                  <th>Section</th>
                </tr>
              </thead>
              <tbody>
            <tr v-for="(student, index) in paginatedStudents" :key="student.id">
              <td style="text-align: center">{{ (currentPage - 1) * studentsPerPage + index + 1 }}</td>
              <td style="text-align: center">{{ student.user?.idnumber }}</td>
              <td>{{ student.user?.lname }}</td>
              <td>{{ student.user?.fname }}</td>
              <td>{{ student.user?.mname }}</td>
              <td style="text-align: center">{{ student.user?.sex }}</td>
              <td style="text-align: center">{{ student.strands?.addstrand }} {{ student.strands?.grade_level }}</td>
              <td style="text-align: center">{{ student.section?.section }} </td>
            </tr>
          </tbody>
            </table>
          </div>
        </div>
        <!-- Pagination Controls -->
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Modal for Adding Students -->
    <div v-if="isAddStudentModalVisible" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog modal-lg custom-modal-dialog" role="document">
        <div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title">Add Students to Class</h5>
    <button type="button" class="close-modal-btn" @click="closeAddStudentModal">&times;</button>
  </div>

  <!-- Search Input -->
  <div class="modal-body">
    <input
      type="text"
      class="form-control mb-3"
      placeholder="Search by student name..."
      v-model="searchQuery"
    />

    <div class="table-wrapper">
      <table class="table table-bordered table-hover table-custom">
        <thead class="table-info">
          <tr>
            <th scope="col" style="width: 5%;">Select</th>
            <th scope="col" style="width: 15%;">ID Number</th>
            <th scope="col" style="width: 55%;">Name</th>
            <th scope="col" style="width: 15%;">Strand</th>
            <th scope="col" style="width: 15%;">Section</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in filteredStudents"
            :key="student.id"
            :class="{ 'selected-row': selectedStudents.includes(student.user_id) }"
          >
            <td style="text-align: center;">
              <input
                type="checkbox"
                class="custom-checkbox"
                v-model="selectedStudents"
                :value="student.user_id"
              />
            </td>
            <td style="font-size: 18px;">{{ student.user?.idnumber }}</td>
            <td style="font-size: 18px;">
              {{ student.user?.lname }}, {{ student.user?.fname }} {{ student.user?.mname }}
            </td>
            <td>{{ student.strands?.addstrand }} {{ student.strands?.grade_level }}</td>
            <td>{{ student.section?.section }} </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="modal-footer">
    <button type="button" class="btn btn-primary" @click="addSelectedStudents">Add Selected Students</button>
    <button type="button" class="btn btn-secondary" @click="closeAddStudentModal">Cancel</button>
  </div>
</div>

      </div>
    </div>

    <!-- Modal Backdrop -->
    <div v-if="isAddStudentModalVisible" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '@/config';

export default {
  name:'StudentsListSubject',
  data() {
    return {
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: '',
        gen_code: ''
      },
      students: [],
      currentPage: 1,
      studentsPerPage: 10,
      availableStudents: [],
      selectedStudents: [],
      searchQuery: "", // Stores the user's search input
      isAddStudentModalVisible: false,
    };
  },
  computed: {
    paginatedStudents() {
      const start = (this.currentPage - 1) * this.studentsPerPage;
      const end = start + this.studentsPerPage;
      return this.students.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.students.length / this.studentsPerPage);
    },
    filteredStudents() {
      // Filter students by search query
      const query = this.searchQuery.toLowerCase();
      return this.availableStudents.filter((student) => {
        const fullName = `${student.user?.lname}, ${student.user?.fname} ${student.user?.mname}`;
        return fullName.toLowerCase().includes(query);
      });
    }
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    async fetchSubject() {
      try {
        const classId = this.$route.params.class_id;
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire('Error', 'Authorization token is missing. Please log in again.', 'error');
          return;
        }
        const response = await axios.get(`${config.apiBaseURL}/class/${classId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.data.class || !response.data.class.subject.subjectname) {
          Swal.fire('Error', 'Class not found or you are not authorized to view this class.', 'error');
          return;
        }
        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
        this.subject.gen_code = response.data.class.gen_code;
      } catch (error) {
        Swal.fire('Error', error.response ? error.response.data.message : 'Failed to fetch subject data. Please try again later.', 'error');
      }
    },
    async fetchStudents() {
      try {
        const classId = this.$route.params.class_id;
        console.log('Fetching students for class:', classId);

        const response = await axios.get(`${config.apiBaseURL}/viewAllStudents`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { class_id: classId }
        });
        console.log('Response data:', response.data);
        this.students = response.data.students;
      } catch (error) {
        alert('Error fetching students: ' + error.message);
      }
    },
    async fetchAvailableStudents() {
      try {
        console.log('Fetching all available students');
        const response = await axios.get(`${config.apiBaseURL}/viewAllStudents2`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Response data:', response.data);
        this.availableStudents = response.data.students;
      } catch (error) {
        alert('Error fetching available students: ' + error.message);
      }
    },
    async addSelectedStudents() {
      try {
        const classId = this.$route.params.class_id;
        await axios.post(`${config.apiBaseURL}/addwocode`, {
          user_ids: this.selectedStudents,
          class_id: classId
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        Swal.fire({
          title: 'Success!',
          text: 'Students added successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.closeAddStudentModal();
        this.fetchStudents();
      } catch (error) {
        alert('Error adding students: ' + error.message);
      }
    },
    openAddStudentModal() {
      this.isAddStudentModalVisible = true;
      this.fetchAvailableStudents();
    },
    closeAddStudentModal() {
      this.isAddStudentModalVisible = false;
      this.selectedStudents = [];
    }
  },
  mounted() {
    this.fetchStudents();
    this.fetchSubject();
  }
};
</script>

<style scoped>
.btn-gradient {
  background: linear-gradient(45deg, #c4c5c5, #9fa0a0);
  color: #120808;
  transition: background 0.3s ease;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px ;
  padding: 5px;
  width: 250px;
  
  border-color: white;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
}


.btn-gradient:hover {
  background: linear-gradient(45deg, #b2b3b4, #eff0f0);
  
}
.custom-modal-dialog {
    width: 600px; /* Set your desired max width */
    width: 80%; /* Set your desired default width */
    height: 30px;
}
.subject-info-container {
  background-color: #EEEDED;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  height: 130px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.subject-title {
  font-size: 25px;
  margin-bottom: 10px;
  font-weight: 800;
  color: #333;
}

.class-code span {
  color: #007bff;
  font-weight: 800;
}

.nav {
  flex-wrap: wrap;
  gap: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.nav-link {
  color: #000000;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover :active {
  background-color: #007bff;
  color: white !important;
}

.router-link-active {
  color: #007bff !important;
  border-bottom: 2px solid #007bff;
}


.table-wrapper {
  padding: 0 15px;
  max-width: 100%;
  overflow-x: auto;
}

.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  font-size: 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border: 1px solid #200909;
  overflow: hidden;
}

.table-custom th {
  background-color: #c1c1c1d7;
  color: #000000;
  font-weight: 700;
  font-size: 20px;
  text-align: center;
  vertical-align: middle;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.modal-custom {
  border-radius: 12px;
  padding: 20px;
  max-width: 600px;
}

.modal-lg {
  max-width: 700px;
}

.close-modal-btn {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
}

.custom-checkbox {
  transform: scale(1.2);
  margin-right: 10px;
}

.selected-row {
  background-color: #e8f0fe;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: row;
  }
  .nav-link {
    padding: 8px 15px;
  }

  .modal-lg {
    max-width: 90%;
  }
}
</style>
