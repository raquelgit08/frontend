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
      <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-file-earmark-plus fs-4"></i> Exams
      </router-link>
      <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-chat-dots fs-4"></i> Feedback
      </router-link>
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-activity fs-4"></i> Performance Tracking
      </router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-person-lines-fill fs-4"></i> Students
      </router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-hourglass-split fs-4"></i> Pending
      </router-link>
    </nav>
  </div>

  <div class="container-fluid">
    <h4 class="text-center">Manage Students</h4><br>

    <!-- Invitation Form -->
    <div class="row mb-4">
      <div class="col-md-8 offset-md-2">
        <input v-model="inviteEmail" type="email" class="form-control" placeholder="Enter student's email" />
        <input v-model="inviteName" type="text" class="form-control mt-2" placeholder="Enter student's name" />
        <button class="btn btn-primary mt-2 w-100" @click="inviteStudentEmail">Invite Student</button>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-10 offset-md-1">
        <table class="table table-bordered table-hover">
          <thead class="table-info">
            <tr>
              <th scope="col" class="text-center">No.</th>
              <th scope="col" class="text-center">LRN</th>
              <th scope="col" class="text-center">Last Name</th>
              <th scope="col" class="text-center">First Name</th>
              <th scope="col" class="text-center">Middle Name</th>
              <th scope="col" class="text-center">Sex</th>
              <th scope="col" class="text-center">Email</th>
              <th scope="col" class="text-center">Strand</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in students" :key="student.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ student.user?.idnumber }}</td>
              <td class="text-center">{{ student.user?.lname }}</td>
              <td class="text-center">{{ student.user?.fname }}</td>
              <td class="text-center">{{ student.user?.mname }}</td>
              <td class="text-center">{{ student.user?.sex }}</td>
              <td class="text-center">{{ student.user?.email }}</td>
              <td class="text-center">{{ student.strands?.addstrand }}</td>
             
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
      inviteEmail: '',
      inviteName: '',
      error: ''
    };
  },
  methods: {
    async fetchStudents() {
      try {
        const classId = this.$route.params.class_id;
        const response = await axios.get(`http://localhost:8000/api/viewAllStudents`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          params: { class_id: classId }
        });
        this.students = response.data.students;
      } catch (error) {
        alert('Error fetching students: ' + error.message);
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

        const response = await axios.get(`http://localhost:8000/api/class/${classId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
      } catch (error) {
        console.error('Error fetching subject:', error);
        this.error = error.response ? error.response.data.message : 'Failed to fetch subject data.';
      }
    },
    async inviteStudent(studentId) {
      try {
        const response = await axios.post(`http://localhost:8000/api/inviteStudent`, {
          student_id: studentId
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert(response.data.message || 'Invitation sent successfully');
      } catch (error) {
        alert('Error inviting student: ' + error.message);
      }
    },
    async inviteStudentEmail() {
      try {
        const response = await axios.post(`http://localhost:8000/api/inviteStudentByEmail`, {
          email: this.inviteEmail,
          name: this.inviteName
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
.container-fluid {
  background-color: #ffffff;
  border-radius: 10px;
}

/* Main Container */
.main-container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* Subject Info Container */
.subject-info-container {
  flex: 1;
  max-width: 280px;
  margin-right: 15px;
  display: flex;
  align-items: center;
}

/* Subject Info Styling */
.subject-info {
  width: 100%;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.subject-info h2 {
  font-size: 1.6rem;
  color: #343a40;
  font-weight: 700;
}

.subject-info p {
  font-size: 1rem;
  color: #6c757d;
}

/* Navigation Bar */
.nav {
  flex: 2;
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
}

.nav-link {
  color: #343a40 !important;
  font-weight: 500;
  padding: 8px 16px;
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
  font-size: 1.8rem;
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
  width: 100%;
}
</style>
