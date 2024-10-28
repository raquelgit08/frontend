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
  <div class="container-fluid"><br>
    <!-- <h4 class="text-center">Students to be accepted</h4><br> -->
    <input type="text"  v-model="searchQuery"  placeholder="Search by ID Number"  class="form-control mb-3"/>
    <!-- Display students in a table format -->
    <table class="table table-striped table-custom">
      <thead>
        <tr>
          <th>#</th>
          <th>ID Number</th>
          <th>Name</th>
          
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, index) in filteredStudents" :key="student.id">
          <td>{{ index + 1 }}</td> <!-- Row numbering -->
          <td>{{ student.idnumber }}</td>
          <td>{{ student.lname }}, {{ student.fname }} {{ student.mname }}</td>
          <td>
            <button class="btn btn-success" @click="updateStudentStatus(student.id, 1)" style="margin-right: 10px;">Approve</button>
            <!-- <button class="btn btn-danger" @click="updateStudentStatus(student.id, 0)">Decline</button> -->
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Error message display -->
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';
import Swal from "sweetalert2";
export default {
  name: 'PendingStudent',
  data() {
    return {
      students: [],
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      error: '',
      searchQuery: '' 
    };
  },
  computed: {
    filteredStudents() {
      // Filter students based on the search query
      return this.students.filter(student => {
        return student.idnumber.toString().includes(this.searchQuery); // Ensure ID number is treated as a string
      });
    }
  },
  methods: {
    async fetchStudents() {
  try {
    const classId = this.$route.params.class_id; // Ensure class_id is correct
    const response = await axios.get(`${config.apiBaseURL}/classes/${classId}/students/pending`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    // Log the API response
    console.log('Fetched studentssssss response:', response.data);
    this.students = response.data;
  } catch (error) {
    this.error = 'Error fetching students: ' + (error.response ? error.response.data.error : error.message);
  }
},


    async fetchSubject() {
      try {
        const classId = this.$route.params.class_id;
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = 'Authorization token is missing. Please log in again.';
          return;
        }

        const response = await axios.get(`${config.apiBaseURL}/class/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
        this.subject.gen_code = response.data.class.gen_code;
      } catch (error) {
        this.error = error.response ? error.response.data.message : 'Failed to fetch subject data. Please try again later.';
      }
    },
    async updateStudentStatus(studentId, status) {
      try {
        const classId = this.$route.params.class_id;
        const response = await axios.post(`${config.apiBaseURL}/approveStudentJoinRequest`, {
          class_id: classId,
          user_id: studentId,
          status: status
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        // Show SweetAlert success message for approval or decline
        Swal.fire({
          icon: 'success',
          title: status === 1 ? 'Approved!' : 'Declined!',
          text: response.data.message,
        });
        this.fetchStudents(); // Refresh the student list after action
      } catch (error) {
        this.error = 'Error updating student status: ' + (error.response ? error.response.data.error : error.message);
      }
    }
  },
  mounted() {
    this.fetchStudents(); // Fetch students first when component is mounted
    this.fetchSubject();  // Fetch subject details as well
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
  margin-left: 10px;
  margin-right: 10px;
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


.nav-link:hover :active {
  background-color: #007bff;
  color: white !important;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
}



.router-link-active {
  color: #007bff !important;
  border-bottom: 2px solid #007bff;
}

/* Page Title */
.container-fluid h4 {
  color: #060000;
  padding: 10px;
  border-radius: 8px 8px 0 0;
  font-family: 'Georgia', serif;
  margin-bottom: 20px;
}

/* Table Styles */
.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border: 1px solid #200909;
  overflow: hidden;
  margin-bottom: 120px;
}

.table-custom th {
  background-color: #c1c1c1d7;
  color: #000000;
  font-weight: 700;
  font-size: 20px;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.table-custom tbody tr:hover {
  background-color: #f1f3f5;
}

.table-custom tbody tr {
  transition: background-color 0.3s ease;
}

.btn-danger {
  margin-right: 10px;
}

.container-fluid {
  margin: auto;
}
</style>
