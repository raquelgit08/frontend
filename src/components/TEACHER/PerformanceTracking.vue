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
      <router-link :to="`/AddExam/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
      <router-link :to="`/ItemAnalysis/${$route.params.class_id}`" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link>
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
    </nav>
  </div>

  <!-- Page Content -->
  <div class="performance-page">
    <div class="container-fluid">
      <h5>Performance Tracking</h5>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PerformancesTracking',
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

/* Dashboard Title */
.subject-page h5 {
  font-size: 1.75rem;
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
