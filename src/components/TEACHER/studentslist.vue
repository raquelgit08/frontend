<template>
  <div class="container-fluid">
    <!-- Subject Information Display -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2 class="subject-title">{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} | {{ subject.schoolYear }}</p>
        <p class="class-code">Class Code: <span>{{ subject.gen_code }}</span></p>
      </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="nav nav-pills">
      <router-link to="/teacheraddsubject" class="nav-link">Go Back to Classes</router-link>
      <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link">Exams</router-link>
      <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link">Feedback</router-link>
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link">Performance Tracking</router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link">Students</router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link">Pending</router-link>
    </nav>

    <!-- Invite Button -->
    <div class="d-flex justify-content-end mb-4">
      <button class="btn btn-primary" @click="openAddStudentModal">Add Students to Class</button>
    </div>

    <!-- Enrolled Students Table -->
    <div class="container-fluid">
      <h4 class="text-center">Enrolled Students</h4><br>
      <div class="row mb-4">
        <div class="col-md-10 offset-md-1">
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
                  <th>Email</th>
                  <th>Strand</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, index) in students" :key="student.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ student.user?.idnumber }}</td>
                  <td>{{ student.user?.lname }}</td>
                  <td>{{ student.user?.fname }}</td>
                  <td>{{ student.user?.mname }}</td>
                  <td>{{ student.user?.sex }}</td>
                  <td>{{ student.user?.email }}</td>
                  <td>{{ student.strands?.addstrand }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Adding Students -->
    <div v-if="isAddStudentModalVisible" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content modal-custom">
          <div class="modal-header">
            <h5 class="modal-title">Add Students to Class</h5>
            <button type="button" class="close-modal-btn" @click="closeAddStudentModal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="table-wrapper">
              <table class="table table-bordered table-hover">
                <thead class="table-info">
                  <tr>
                    <th scope="col">Select</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Strand</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student) in availableStudents" :key="student.id" :class="{'selected-row': selectedStudents.includes(student.user_id)}">
                    <td>
                      <input type="checkbox" class="custom-checkbox" v-model="selectedStudents" :value="student.user_id" />
                    </td>
                    <td>{{ student.user?.lname }}</td>
                    <td>{{ student.user?.fname }}</td>
                    <td>{{ student.user?.email }}</td>
                    <td>{{ student.strands?.addstrand }}</td>
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
      availableStudents: [],
      selectedStudents: [],
      isAddStudentModalVisible: false,
    };
  },
  methods: {
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
        const response = await axios.get(`${config.apiBaseURL}/viewAllStudents`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { class_id: classId }
        });
        this.students = response.data.students;
      } catch (error) {
        alert('Error fetching students: ' + error.message);
      }
    },
    async fetchAvailableStudents() {
      try {
        const response = await axios.get(`${config.apiBaseURL}/viewAllStudents2`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
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
        alert('Students added successfully');
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
.subject-info-container {
  background-color: #EEEDED;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  height: 130px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.subject-title {
  font-size: 1.75rem;
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
  border-radius: 10px;
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

.table-wrapper {
  padding: 0 15px;
  max-width: 100%;
  overflow-x: auto;
}

.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  font-size: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #200909;
  overflow: hidden;
}

.table-custom th {
  background-color: #0d8eead7;
  color: #ffffff;
  font-weight: 700;
  font-size: 20px;
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
