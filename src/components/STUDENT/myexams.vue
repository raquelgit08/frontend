<template>
  <div class="main-container">
    <!-- Subject Information Display -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2 class="subject-title">{{ subject.subjectName }}</h2>
        <p class="subject-description">{{ subject.classDescription }}</p>
        <p class="class-code">Class Code: <span>{{ subject.classGenCode }}</span></p>
      </div>
    </div>

    <!-- Navigation Bar Positioned Next to Subject Info -->
    <nav class="nav nav-pills">
      <router-link to="/Saddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4"></i></span> Back to Subjects
      </router-link>
      <router-link :to="`/mysubject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
      <router-link :to="`/myExams/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-file-earmark-plus fs-4"></i> Exams
      </router-link>
      <router-link :to="`/myfeedbacks/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-chat-dots fs-4"></i> Feedback
      </router-link>
      <router-link :to="`/mysubjectperformance/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-activity fs-4"></i> Performance
      </router-link>
    </nav>

    <!-- Published Exams List -->
    <div class="subject-page container mt-5">
      <h5 class="text-center section-title">Published Exams</h5>

      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <!-- Published Exams Cards -->
      <div class="row g-4" v-if="exams.length">
        <div class="col-md-4" v-for="exam in exams" :key="exam.id">
          <div class="card h-100 shadow-sm exam-card">
            <div class="card-body">
              <h5 class="card-title">{{ exam.title }}</h5>
              <p class="card-text">
                <strong>Quarter:</strong> {{ exam.quarter }}<br>
                <strong>Start:</strong> {{ formatDateTime(exam.start) }}<br>
                <strong>End:</strong> {{ formatDateTime(exam.end) }}<br>
                <strong>Status:</strong>
                <span v-if="isExamAvailable(exam)" class="status-available">Available</span>
                <span v-else class="status-unavailable">Unavailable</span>
              </p>
              <div class="d-grid gap-2">
                <button @click="viewExam(exam)" class="btn btn-primary">
                  View Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-else class="text-center no-exams-message">No exams available</p>
    </div>

    <!-- Exam Details Modal -->
    <div v-if="showModal" class="modal-backdrop" @click="closeModal">
      <div class="modal-content shadow-lg" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ modalExam.title }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p><strong>Quarter:</strong> {{ modalExam.quarter }}</p>
          <p><strong>Start Date:</strong> {{ formatDateTime(modalExam.start) }}</p>
          <p><strong>End Date:</strong> {{ formatDateTime(modalExam.end) }}</p>
          <p><strong>Status:</strong>
            <span v-if="isExamAvailable(modalExam)">Available</span>
            <span v-else>Unavailable</span>
          </p>
          <p v-if="modalExam.description"><strong>Description:</strong> {{ modalExam.description }}</p>
        </div>
        <div class="modal-footer">
          <button v-if="isExamAvailable(modalExam)" @click="takeExam(modalExam.id)" class="btn btn-success">
            Take Exam
          </button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
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
        classDescription: '',
        classGenCode: ''
      },
      exams: [],
      modalExam: {},
      error: '',
      showModal: false
    };
  },
  methods: {
    async fetchSubjectAndExams() {
      const classId = this.$route.params.class_id;
      const token = localStorage.getItem('token');

      try {
        const subjectResponse = await axios.get(`http://localhost:8000/api/classroom/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.subject = {
          subjectName: subjectResponse.data.subject_name,
          classDescription: subjectResponse.data.class_description,
          classGenCode: subjectResponse.data.class_gen_code
        };

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

    isExamAvailable(exam) {
      const now = new Date();
      const startDate = new Date(exam.start);
      const endDate = new Date(exam.end);
      return now >= startDate && now <= endDate;
    },

    takeExam(examId) {
      this.closeModal(); // Close the modal before navigating
      this.$router.push(`/examtakingpage/${examId}`);
    },

    async viewExam(exam) {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:8000/api/viewExam2/${exam.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.modalExam = response.data.exam;
        this.showModal = true;
      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Error fetching exam details';
      }
    },

    formatDateTime(dateTime) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateTime).toLocaleString(undefined, options);
    },

    closeModal() {
      this.showModal = false;
    }
  },

  created() {
    this.fetchSubjectAndExams();
  }
};
</script>

<style scoped>
/* General Styling */
.main-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 30px;
}

.subject-info-container {
  background-color: #f7f9fc;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.subject-title {
  font-size: 1.75rem;
  margin-bottom: 10px;
  color: #333;
}

.subject-description {
  color: #555;
  margin-bottom: 5px;
}

.class-code span {
  color: #007bff;
}

.nav {
  flex-wrap: wrap;
  gap: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 10px;
}

.nav-link {
  color: #007bff;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  background-color: #007bff;
  color: white !important;
}

.subject-page {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  color: #333;
}

.exam-card {
  background-color: white;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.exam-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.status-available {
  color: green;
}

.status-unavailable {
  color: red;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
