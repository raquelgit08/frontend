<template>
  <div class="main-container">
    <!-- Subject Information Display -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2>{{ subject.subjectName }}</h2>
        <p>Description: {{ subject.classDescription }}</p>
        <p>Class Code: {{ subject.classGenCode }}</p>
      </div>
    </div>

    <!-- Navigation Bar Positioned Next to Subject Info -->
    <nav class="nav nav-pills">
      <router-link to="/Saddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4"></i></span>
      </router-link>
      <router-link :to="`/mysubject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
      <router-link :to="`/myExams/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-file-earmark-plus fs-4"></i> Exams
      </router-link>
      <router-link :to="`/myfeedbacks/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-chat-dots fs-4"></i> Feedback
      </router-link>
      <router-link :to="`/myItemAnalysis/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-bar-chart-line fs-4"></i> Item Analysis
      </router-link>
      <router-link :to="`/myPerformanceTracking/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-activity fs-4"></i> Subject Performance 
      </router-link>
     <!-- <router-link :to="`/mysubjectperformance/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-person-lines-fill fs-4"></i> Students
      </router-link> -->
    </nav>

    <!-- Published Exams List -->
    <div class="subject-page container mt-5">
      <h5 class="text-center">Published Exams</h5>

      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <!-- Published Exams Table -->
      <table class="table table-hover" v-if="exams.length">
        <thead>
          <tr>
            <th>Title</th>
            <th>Quarter</th>
            <th>Start Date & Time</th>
            <th>End Date & Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in exams" :key="exam.id">
            <td>{{ exam.title }}</td>
            <td>{{ exam.quarter }}</td>
            <td>{{ formatDateTime(exam.start) }}</td>
            <td>{{ formatDateTime(exam.end) }}</td>
            <td>
              <span v-if="isExamAvailable(exam)">Available</span>
              <span v-else>Unavailable</span>
            </td>
            <td>
              <button v-if="isExamAvailable(exam)" @click="takeExam(exam.id)" class="btn btn-primary btn-sm">
                Take Exam
              </button>
              <button v-else disabled class="btn btn-secondary btn-sm">Not Available</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-center">No exams available</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PublishedExams',
  data() {
    return {
      subject: {
        subjectName: '',
        classDescription: '',
        classGenCode: ''
      },
      exams: [],
      error: ''
    };
  },
  methods: {
    // Fetch subject info and exams from the server
    async fetchSubjectAndExams() {
      const classId = this.$route.params.class_id;
      const token = localStorage.getItem('token');

      try {
        // Fetch subject details
        const subjectResponse = await axios.get(`http://localhost:8000/api/classroom/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.subject.subjectName = subjectResponse.data.subject_name;
        this.subject.classDescription = subjectResponse.data.class_description;
        this.subject.classGenCode = subjectResponse.data.class_gen_code;

        // Fetch published exams for the class
        const examsResponse = await axios.get(`http://localhost:8000/api/class/${classId}/published-exams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.exams = examsResponse.data.exams;

      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Error fetching subject and exams';
      }
    },

    // Check if the exam is currently available
    isExamAvailable(exam) {
      const now = new Date();
      const startDate = new Date(exam.start);
      const endDate = new Date(exam.end);
      return now >= startDate && now <= endDate;
    },

    // Handle taking the exam
    takeExam(examId) {
      this.$router.push(`/takeExam/${examId}`);
    },

    // Format date and time
    formatDateTime(dateTime) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateTime).toLocaleString(undefined, options);
    }
  },

  created() {
    this.fetchSubjectAndExams(); // Fetch subject info and exams when the component is created
  }
};
</script>

<style scoped>
/* Main Container */
.main-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
}

/* Subject Info Container */
.subject-info-container {
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  margin-right: 20px;
}

.subject-info {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.subject-info h2 {
  font-size: 1.75rem;
  color: #212529;
  font-weight: bold;
  margin-bottom: 10px;
}

.subject-info p {
  font-size: 1.1rem;
  color: #495057;
}

/* Navigation Bar */
.nav {
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 10px;
  gap: 10px;
}

.nav-link {
  color: #343a40 !important;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  background-color: #007bff;
  color: white !important;
}

.router-link-active {
  color: #007bff !important;
  background-color: #e9f5ff;
  padding: 10px 15px;
  border-radius: 5px;
}

/* Published Exams Table */
.table {
  margin-top: 20px;
}

.table th, .table td {
  text-align: center;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

/* Error Alert */
.alert {
  margin-top: 20px;
}

.text-center {
  margin-top: 20px;
  font-size: 1.25rem;
}
</style>
