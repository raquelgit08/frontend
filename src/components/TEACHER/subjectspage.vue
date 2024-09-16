<template>
  <div class="main-container">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2>{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} Semester | {{ subject.schoolYear }}</p>
      </div>
    </div>

    <!-- Navigation Bar Positioned Next to Subject Info -->
    <nav class="nav nav-pills">
      <router-link to="/teacheraddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4"></i></span>
      </router-link>
      <router-link :to="`/subject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
      <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <!-- <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link> -->
      <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
      <!-- <router-link :to="`/ItemAnalysis/${$route.params.class_id}`" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link> -->
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
   </nav>
  </div>

  <!-- Subject Page Content -->
  <div class="subject-page container mt-5">
    <h5 class="text-center">Dashboard</h5>
    <div class="chart-container">
     <h6 class="mb-2">STUDENTS GENDER DISTRIBUTION</h6>
     <canvas id="studentchart" width="400" height="200"></canvas>
    </div>
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'SubjectPages',
  data() {
    return {
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      chart: null,
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
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data.class) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        // Set subject information
        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;

        // Now fetch and render the chart data
        this.fetchChartData(classId);
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchChartData(classId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/listStudentsInClassGendertotal/${classId}`);
        const chartData = response.data;

        this.renderChart(chartData);
      } catch (error) {
        this.handleError(error);
      }
    },

    renderChart(data) {
      if (this.chart) {
        this.chart.destroy(); // Destroy the chart instance if it already exists
      }

      const ctx = document.getElementById('studentchart').getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Male', 'Female'],
          datasets: [{
            label: 'Number of Students',
            data: [data.male, data.female],
            backgroundColor: ['#007bff', '#dc3545'],
            borderColor: ['#007bff', '#dc3545'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },

    handleError(error) {
      if (error.response) {
        if (error.response.status === 404) {
          this.error = 'Class not found or you are not authorized to view this class.';
        } else if (error.response.status === 403) {
          this.error = 'You are not authorized to view this class.';
        } else {
          this.error = error.response.data.message || 'Failed to fetch data. Please try again later.';
        }
      } else {
        this.error = 'Failed to fetch data. Please try again later.';
      }
      console.error('Error:', error);
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
}

/* Subject Info Container */
.subject-info-container {
  flex: 1;
  max-width: 300px;
  margin-right: 10px;
  margin-left: 10px;
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
  background-color: #ffffff;
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

/* Chart Styling */
.chart-container {
  margin: 0 auto;
  max-width: 600px;
}

.alert {
  border-radius: 15px;
  max-width: 600px;
  margin: 0 auto;
}
</style>