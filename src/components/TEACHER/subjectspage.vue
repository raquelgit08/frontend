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
    this.fetchClassData();
  },
  methods: {
    async fetchClassData() {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://127.0.0.1:8000/api/showClass2', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        const classData = response.data.class;

        this.subject.subjectName = classData.subject.subjectname;
      } catch (error) {
        console.error('Error fetching class data:', error);
        this.error = 'Failed to load class data. Please try again later.';
      }
    },

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
  padding: 5px;
  /* text-align: center; */
}

.alert {
  margin-top: 20px;
}
</style>
