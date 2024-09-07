<template>
  <div class="main-container">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2>{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} | {{ subject.schoolYear }}</p>
      </div>
    </div>

    <!-- Unified Navigation Bar -->
    <nav class="nav nav-pills">
      <router-link to="/teacheraddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4"></i></span>
      </router-link>
      <router-link :to="`/subject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
      <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
      <router-link :to="`/ItemAnalysis/${$route.params.class_id}`" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link>
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
    </nav>
  </div>

  <div class="container-fluid">
    <h4 class="text-center">Manage Students</h4><br>
    <div class="row mb-4">
      <div class="col-md-8 offset-md-2">
        <table class="table table-bordered table-hover">
          <thead class="table-info">
            <tr>
              <th scope="col" class="text-center">Email</th>
              <th scope="col" class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student) in students" :key="student.id">
              <td class="text-center">{{ student.email }}</td>
              <td class="text-center">
                <button class="btn btn-danger" @click="kickStudent(student.id)">Kick</button>
                <button class="btn btn-primary" @click="inviteStudent(student.id)">Invite</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ManageStudentEmails',
  data() {
    return {
      students: [],
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      error: ''
    };
  },
  methods: {
    async fetchStudents() {
      try {
        const classId = this.$route.params.class_id; // Get class_id from route params
        const response = await axios.get(`http://localhost:8000/api/viewAllStudents`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          params: {
            class_id: classId
          }
        });
        this.students = response.data.students;
      } catch (error) {
        alert('Error fetching students: ' + error.message);
      }
    },
    async fetchSubject() {
      try {
        const classId = this.$route.params.class_id; // Get class_id from route params
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = 'Authorization token is missing. Please log in again.';
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/class/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        // Update subject details from the API response
        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
      } catch (error) {
        console.error('Error fetching subject:', error);
        if (error.response) {
          if (error.response.status === 404) {
            this.error = 'Class not found or you are not authorized to view this class.';
          } else if (error.response.status === 403) {
            this.error = 'You are not authorized to view this class.';
          } else {
            this.error = error.response.data.message || 'Failed to fetch subject data. Please try again later.';
          }
        } else {
          this.error = 'Failed to fetch subject data. Please try again later.';
        }
      }
    },
    async kickStudent(studentId) {
      if (confirm('Are you sure you want to remove this student from the class?')) {
        try {
          const classId = this.$route.params.class_id; // Get class_id from route params
          await axios.delete(`http://localhost:8000/api/students/${studentId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
              class_id: classId
            }
          });
          alert('Student removed successfully');
          this.fetchStudents();
        } catch (error) {
          alert('Error removing student: ' + error.message);
        }
      }
    },
    async inviteStudent(studentId) {
      try {
        const response = await axios.post(`http://localhost:8000/api/inviteStudent`, {
          student_id: studentId
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        alert(response.data.message || 'Invitation sent successfully');
      } catch (error) {
        alert('Error inviting student: ' + error.message);
      }
    }
  },
  mounted() {
    this.fetchStudents();
    this.fetchSubject();
  }
};
</script>

<style scoped>
/* Main Container */
.main-container {
  display: flex;
  align-items: stretch; /* Ensure both containers stretch to the same height */
  justify-content: space-between; /* Space out the subject info and nav bar */
  padding: 20px;
}

/* Subject Info Container */
.subject-info-container {
  flex: 1; /* Flex value of 1 to take equal height as the nav */
  max-width: 300px;
  margin-right: 20px;
  display: flex;
  align-items: center; /* Center the content vertically */
}

/* Subject Info Styling */
.subject-info {
  width: 100%;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.subject-info h2 {
  font-size: 1.5rem;
  color: #343a40;
  font-weight: 700;
  margin-bottom: 8px;
}

.subject-info p {
  font-size: 1rem;
  color: #6c757d;
}

/* Navigation Bar */
.nav {
  flex: 2; /* Flex value of 2 to balance the nav width */
  display: flex;
  justify-content: space-around;
  align-items: center; /* Ensure nav items are centered vertically */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
}

.nav-link {
  color: #343a40 !important;
  text-decoration: none;
  font-weight: 500;
}

.nav-link:hover {
  color: #007bff !important;
}

.router-link-active {
  color: #007bff !important;
  border-bottom: 2px solid #007bff;
}

/* Table and Title Styling */
.container-fluid h4 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 20px;
}

.table {
  margin-top: 20px;
}

.table th,
.table td {
  vertical-align: middle;
}

.table th {
  background-color: #f8f9fa;
}

.btn {
  margin: 0 5px;
}
</style>
