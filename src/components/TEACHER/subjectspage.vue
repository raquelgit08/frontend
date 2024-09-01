<template>
  <div>
    <!-- Main Container -->
    <div class="main-container">
      <!-- Subject Information Display on the Left -->
      <div class="subject-info-container">
        <div v-if="subject.subjectName" class="subject-info">
          <h2>{{ subject.subjectName }}</h2>
          <p>{{ subject.semester }} | {{ subject.schoolYear }}</p>
        </div>
      </div>

      <!-- Navigation Bar Positioned Next to Subject Info -->
      <nav class="nav nav-pills nav-fill">
        <router-link to="/teacheraddsubject" class="nav-link">
          <span><i class="bi bi-arrow-left fs-4"></i></span>
        </router-link>
        <router-link :to="`/subject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
        <router-link to="/AddExam" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i>Exams</router-link>
        <router-link to="/Feedback" class="nav-link"><i class="bi bi-chat-dots fs-4"></i>Feedback</router-link>
        <router-link to="/ItemAnalysis" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i>Item Analysis</router-link>
        <router-link to="/PerformanceTracking" class="nav-link"><i class="bi bi-activity fs-4"></i>Performance Tracking</router-link>
        <router-link to="/studentslist" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i>Students</router-link>
        <router-link to="/pendingstudentslist" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i>Pending</router-link>
      </nav>
    </div>

    <!-- Subject Page Content -->
    <div class="subject-page container mt-5">
      <h5 class="text-center">Dashboard</h5>

      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger text-center">
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
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      error: ''
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

        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
      } catch (error) {
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
/* Main Container */
.main-container {
  display: flex;
  align-items: center; /* Align items to the center vertically */
  justify-content: space-between; /* Space out the subject info and nav bar */
  padding: 20px;
}

/* Subject Info Container */
.subject-info-container {
  flex: 1;
  margin-right: 20px; /* Space between subject info and nav bar */
}

/* Subject Info Styling */
.subject-info {
  max-width: 300px; /* Adjust as needed */
  text-align: left; /* Align text to the left */
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.subject-info h2 {
  font-size: 1.5rem;
  color: #343a40;
  font-weight: 700;
  margin-bottom: 10px;
}

.subject-info p {
  font-size: 1rem;
  color: #6c757d;
}

/* Navigation Bar */
.nav {
  flex: 2; /* Adjust as needed for spacing */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
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

/* Dashboard Title */
.subject-page h5 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #343a40;
  letter-spacing: 1px;
  margin-bottom: 40px;
}

/* Alert Styling */
.alert {
  border-radius: 15px;
  max-width: 600px;
  margin: 0 auto;
}
</style>
