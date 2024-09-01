<template>
  <div>
    <!-- Subject Information Display -->
    <div v-if="subject.subjectName" class="subject-info">
      <h2>{{ subject.subjectName }}</h2>
      <h4>Semester: {{ subject.semester }}</h4>
      <h4>School Year: {{ subject.schoolYear }}</h4>
    </div>

    <!-- Navigation Bar -->
    <div class="container-fluid">
      <nav class="nav nav-pills nav-fill">
        <router-link to="/teacheraddsubject" class="nav-link">
          <span><i class="bi bi-arrow-left fs-4"></i></span>
        </router-link>
        <router-link :to="`/subject/${$route.params.class_id}`" class="nav-link" aria-current="page">Dashboard</router-link>
        <router-link to="/AddExam" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
        <router-link to="/Feedback" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
        <router-link to="/ItemAnalysis" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link>
        <router-link to="/PerformanceTracking" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
        <router-link to="/studentslist" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> List of Students</router-link>
        <router-link to="/studentslist" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
      </nav>
    </div>

    <!-- Feedback Page Content -->
    <div class="feedback-page">
      <div class="container-fluid">
        <h5>Feedbacks</h5>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FeedbacksofStudent',
  data() {
    return {
      selectedItem: '',
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      error: ''
    };
  },
  created() {
    this.fetchSubject(); // Fetch subject details when the component is created
  },
  methods: {
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

        // Check if the response data structure is correct
        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        // Update subject details from the API response
        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
      } catch (error) {
        console.error('Error fetching subject:', error); // Log error to the console for debugging
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
    handleLogoutClick() {
      // Logout logic here
    },
    handleItemClick(path) {
      this.selectedItem = path;
    }
  }
};
</script>

<style scoped>
/* Subject Info Styling */
.subject-info {
  display: flex;
  justify-content: space-around; /* Space out the items evenly */
  align-items: center;
  margin: 20px 0;
  padding: 10px 0;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.subject-info h2, .subject-info h4 {
  margin: 0;
  padding: 0 15px; /* Add padding to separate the items */
}

.feedback-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container-fluid {
  flex: 1;
}

.left-column {
  background-color: white;
  padding: 10px;
  border-right: 1px solid #ddd;
  height: 100vh;
  width: 250px;
}

.right-column {
  padding: 20px;
  background-color: white;
  flex: 1;
}

.list-group-container {
  height: 100%;
}

.list-group {
  color: #333;
  text-decoration: none;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 10px 0;
  padding: 10px;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.list-group.active,
.list-group:hover,
.logOut:hover {
  background-color: #50C878;
  color: white;
}

.icon-label {
  display: flex;
  align-items: center;
  width: 100%;
}

.icon-label i {
  margin-right: 10px;
}

.icon-label .label {
  flex: 1;
}

.feedback-page h1 {
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
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
</style>
