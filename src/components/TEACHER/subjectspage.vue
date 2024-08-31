<template>
  <div>
    <!-- Subject Name Display -->
    <div v-if="subject.subjectName" class="subject-name">
      <h2>{{ subject.subjectName }}</h2>
    </div>
    
    <!-- Navigation Bar -->
    <div class="container-fluid">
      <nav class="nav nav-pills nav-fill">
        <router-link to="/teacheraddsubject" class="nav-link">
          <span><i class="bi bi-arrow-left fs-4"></i></span>
        </router-link>
        <router-link to="/subject" class="nav-link" aria-current="page">Dashboard</router-link>
        <router-link to="/AddExam" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
        <router-link to="/Feedback" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
        <router-link to="/ItemAnalysis" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link>
        <router-link to="/PerformanceTracking" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
        <router-link to="/studentslist" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> List of Students</router-link>
        <router-link to="/studentslist" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
      </nav>
    </div>

    <!-- Subject Page Content -->
    <div class="subject-page">
      <div class="container-fluid">
        <h5>Dashboard</h5>
      </div>

      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SubjectPages',
  data() {
    return {
      subject: {
        subjectName: ''
      },
      error: '' // To store error messages
    };
  },
  created() {
    this.fetchSubject();
  },
  methods: {
    async fetchSubject() {
      try {
        const classId = this.$route.params.class_id;
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

        // Check if the response data structure is correct
        if (!response.data.class || !response.data.class.subjectName) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        this.subject = response.data.class; // Adjust according to actual response
      } catch (error) {
        console.error('Error fetching subject:', error); // Logs error to the console for debugging
        // Handling specific error cases
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
    }
  }
};
</script>

<style scoped>
.container-fluid {
  margin: auto;
}

.nav {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: black !important;
  text-decoration: none;
  padding: 10px 15px;
}

.nav-link:hover {
  color: #333;
}

.router-link-active {
  border-bottom: 3px solid #007bff; /* Blue bottom border for active link */
  color: #007bff !important; /* Change text color for active link */
}

.nav-link i {
  margin-right: 5px;
}

.subject-name {
  margin: 20px 0;
  text-align: center;
}

.alert {
  margin-top: 20px;
}
</style>
