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
      <router-link :to="`/mysubject`" class="nav-link">Dashboard</router-link>
      <router-link :to="`/myExams`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <router-link :to="`/myfeedbacks`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> My Feedbacks</router-link>
      <router-link :to="`/mysubjectperformances`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
    </nav>

    <!-- Subject Page Content -->
    <div class="subject-page container mt-5">
      <h5 class="text-center">Published Exams</h5>

      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <!-- Published Exams List -->
      <table v-if="publishedExams.length" class="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Quarter</th>
            <th>Start Date & Time</th>
            <th>End Date & Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in publishedExams" :key="exam.id">
            <td>{{ exam.title }}</td>
            <td>{{ exam.quarter }}</td>
            <td>{{ exam.start }}</td>
            <td>{{ exam.end }}</td>
          </tr>
        </tbody>
      </table>

      <!-- No Published Exams Found -->
      <div v-else class="alert alert-info text-center">
        No published exams found.
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MyExams',
  data() {
    return {
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      publishedExams: [], // Store published exams here
      error: '' // Store error messages here
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

        // Fetch the class and subject info
        const response = await axios.get(`http://localhost:8000/api/class/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        // Set subject data
        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;

        // Fetch published exams for the subject
        this.fetchPublishedExams(classId);
      } catch (error) {
        if (error.response) {
          this.handleErrorResponse(error.response);
        } else {
          this.error = 'Failed to fetch subject data. Please try again later.';
        }
      }
    },
    async fetchPublishedExams(classId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/tblclass/${classId}/exams`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Filter only the published exams
        this.publishedExams = response.data.exams.filter(exam => exam.is_published);
      } catch (error) {
        this.error = 'Failed to fetch published exams. Please try again later.';
      }
    },
    handleErrorResponse(response) {
      if (response.status === 404) {
        this.error = 'Class not found or you are not authorized to view this class.';
      } else if (response.status === 403) {
        this.error = 'You are not authorized to view this class.';
      } else {
        this.error = response.data.message || 'Failed to fetch subject data. Please try again later.';
      }
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
