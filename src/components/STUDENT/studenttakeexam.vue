<template>
  <div class="container">
    <h2 class="text-center">Available Examinations</h2>
    <div class="row">
      <div v-for="exam in exams" :key="exam.id" class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ exam.title }}</h5>
            <p class="card-text">Quarter: {{ exam.quarter }}</p>
            <p class="card-text">Start: {{ exam.start }}</p>
            <p class="card-text">End: {{ exam.end }}</p>
            <p class="card-text">Total Questions: {{ exam.total_questions }}</p>
            <p class="card-text">Total Points: {{ exam.total_points }}</p>
            <button @click="takeExam(exam.id)" class="btn btn-primary">Take Exam</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StudentTakingExams',
  data() {
    return {
      exams: [],
    };
  },
  created() {
    this.fetchExams();
  },
  methods: {
    async fetchExams() {
      try {
        const response = await axios.get(`http://localhost:8000/api/student/exams`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.exams = response.data.exams;
      } catch (error) {
        console.error('Failed to fetch exams:', error.message);
      }
    },
    takeExam(examId) {
      this.$router.push(`/takeExam/${examId}`);
    },
  },
};
</script>

<style scoped>
/* Card styles remain the same */
</style>
