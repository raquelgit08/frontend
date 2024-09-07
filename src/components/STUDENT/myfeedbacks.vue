<template>
  <div class="main-container">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2>{{ subject.subjectName }}</h2>
        <p>Description: {{ subject.classDescription }}</p>
        <p>Class Code: {{ subject.classGenCode }}</p>
      </div>
    </div>


    <!-- Navigation Bar Positioned Next to Subject Info -->
    <nav class="nav nav-pills">
      <router-link to="/teacheraddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4"></i></span>
      </router-link>
      <router-link :to="`/mysubject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
      <router-link :to="`/myExams/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <router-link :to="`/myfeedbacks/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> My Feedbacks</router-link>
      <router-link :to="`/mysubjectperformances/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
    </nav>

    <!-- Subject Page Content -->
    <div class="subject-page container mt-5">
      <h5 class="text-center">Feedback</h5>

      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <!-- Feedback List -->
      <table class="table table-hover" v-if="feedbacks.length">
        <thead>
          <tr>
            <th>Feedback Title</th>
            <th>Comment</th>
            <th>Date Submitted</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="feedback in feedbacks" :key="feedback.id">
            <td>{{ feedback.title }}</td>
            <td>{{ feedback.comment }}</td>
            <td>{{ formatDateTime(feedback.date_submitted) }}</td>
            <td>
              <span v-if="feedback.status === 'resolved'">Resolved</span>
              <span v-else>Pending</span>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-center">No feedbacks available</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MyFeedbacks',
  data() {
    return {
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      feedbacks: [],
      error: ''
    };
  },
  methods: {
    // Fetch subject info and feedbacks from the server
    async fetchSubjectAndFeedbacks() {
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
        this.subject.semester = subjectResponse.data.semester;
        this.subject.schoolYear = subjectResponse.data.school_year;

        // Fetch feedbacks for the class
        const feedbacksResponse = await axios.get(`http://localhost:8000/api/class/${classId}/feedbacks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.feedbacks = feedbacksResponse.data.feedbacks;

      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Error fetching subject and feedbacks';
      }
    },

    // Format date and time
    formatDateTime(dateTime) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateTime).toLocaleString(undefined, options);
    }
  },

  created() {
    this.fetchSubjectAndFeedbacks(); // Fetch subject info and feedbacks when the component is created
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

/* Feedback Table */
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
