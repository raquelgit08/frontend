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
      <router-link :to="`/mysubjectperformance/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-activity fs-4"></i> Subject Performance 
      </router-link>
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
              <button @click="viewExam(exam.id)" class="btn btn-info btn-sm">
                View Exam
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-center">No exams available</p>
    </div>

    <!-- Exam Details Modal -->
    <div class="modal fade" id="examModal" tabindex="-1" aria-labelledby="examModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="examModalLabel">{{ modalExam.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><strong>Schedule:</strong> {{ formatDateTime(modalExam.start) }} - {{ formatDateTime(modalExam.end) }}</p>
            <p><strong>Quarter:</strong> {{ modalExam.quarter }}</p>
            <p><strong>Status:</strong> <span v-if="isExamAvailable(modalExam)">Available</span><span v-else>Unavailable</span></p>
            <p v-if="modalExam.description"><strong>Description:</strong> {{ modalExam.description }}</p>
          </div>
          <div class="modal-footer">
            <button @click="takeExam(modalExam.id)" class="btn btn-primary">Take Exam</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap'; // Importing Bootstrap's Modal

export default {
  name: 'MyExams',
  data() {
    return {
      subject: {
        subjectName: '',
        classDescription: '',
        classGenCode: ''
      },
      exams: [],
      modalExam: {}, // Holds the exam details to display in the modal
      error: ''
    };
  },
  methods: {
    // Fetch subject info and exams from the server
    async fetchSubjectAndExams() {
      const classId = this.$route.params.class_id;
      const token = localStorage.getItem('token');

      try {
        const subjectResponse = await axios.get(`http://localhost:8000/api/classroom/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.subject.subjectName = subjectResponse.data.subject_name;
        this.subject.classDescription = subjectResponse.data.class_description;
        this.subject.classGenCode = subjectResponse.data.class_gen_code;

        const examsResponse = await axios.get(`http://localhost:8000/api/tblclass/${classId}/exams2`, {
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
      this.$router.push(`/examtakingpage/${examId}`);
    },

    // Fetch exam details and display them in the modal
    async viewExam(examId) {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:8000/api/viewExam2/${examId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.modalExam = response.data.exam;

        // Show modal
        const examModal = new Modal(document.getElementById('examModal'));
        examModal.show();
      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Error fetching exam details';
      }
    },

    // Format date and time for display
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

/* Main Container */
.main-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
}

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

.table {
  margin-top: 20px;
}

.table th, .table td {
  text-align: center;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.alert {
  margin-top: 20px;
}

.text-center {
  margin-top: 20px;
  font-size: 1.25rem;
}
</style>
