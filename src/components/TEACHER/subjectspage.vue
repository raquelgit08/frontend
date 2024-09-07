<template>
  <div class="main-container">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2>{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} | {{ subject.schoolYear }}</p>
      </div>
    </div>

    <!-- Navigation Bar Positioned Next to Subject Info -->
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
      <router-link :to="`/ItemAnalysis/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-bar-chart-line fs-4"></i> Item Analysis
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

  <!-- Subject Page Content -->
  <div class="subject-page container mt-5">
    <h5 class="text-center">Dashboard</h5>

    <!-- Error Handling -->
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
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
  async fetchSubject() {
    try {
      const classId = this.$route.params.class_id; // Get class_id from URL params
      const token = localStorage.getItem('token'); // Get the token from localStorage

      if (!token) {
        this.error = 'Authorization token is missing. Please log in again.';
        return;
      }

      // Fetch the class details using the Laravel API
      const response = await axios.get(`http://localhost:8000/api/class/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('API Response:', response.data); // Log the response to check the structure

      // Handle the API response and map data to Vue component's state
      if (response.data.class) {
        this.subject.subjectName = response.data.class.subject.subjectname || 'Unknown Subject';
        this.subject.semester = response.data.class.semester || 'Unknown Semester';
        this.subject.schoolYear = response.data.class.year.addyear || 'Unknown School Year';
      } else {
        this.error = 'Class details not found or incomplete.';
        console.error('Class data structure issue:', response.data);
      }
    } catch (error) {
      this.error = error.response ? error.response.data.message : 'Failed to fetch subject data. Please try again later.';
      console.error('Fetch error:', error);
    }
  }
  
};
</script>


<style scoped>
/* Main Container */
.main-container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 20px;
}

/* Subject Info Container */
.subject-info-container {
  flex: 1;
  max-width: 300px;
  margin-right: 20px;
  display: flex;
  align-items: center;
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
  flex: 2;
  display: flex;
  justify-content: space-around;
  align-items: center;
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
