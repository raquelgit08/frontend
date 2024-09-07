<template>
  <div class="main-container">
    <!-- Subject Information Omitted for Brevity -->

    <div class="subject-page container mt-5">
      <h5 class="text-center">Published Exams</h5>

      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <!-- Published Exams List -->
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
            <td>{{ exam.start }}</td>
            <td>{{ exam.end }}</td>
            <td>
              <!-- Check if the exam is available to take -->
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
        semester: '',
        schoolYear: ''
      },
      exams: [],
      error: ''
    };
  },
  methods: {
    async fetchExams() {
      try {
        const classId = this.$route.params.class_id;
        const response = await axios.get(`http://localhost:8000/api/class/${classId}/published-exams`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.exams = response.data.exams;
      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Error fetching published exams';
      }
    },
    isExamAvailable(exam) {
      const now = new Date();
      const startDate = new Date(exam.start);
      const endDate = new Date(exam.end);
      return now >= startDate && now <= endDate;
    },
    takeExam(examId) {
      this.$router.push(`/takeExam/${examId}`);
    }
  },
  created() {
    this.fetchExams();
  }
};
</script>

<style scoped>
/* Omitted styling for brevity */
</style>
