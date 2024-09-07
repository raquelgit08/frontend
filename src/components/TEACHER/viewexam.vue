<template>
  <div class="exam-details-container">
    <h2 class="text-center">Exam Details</h2>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Question</th>
          <th>Correct Answer</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
  <tr v-for="(item, index) in exam.questions" :key="index">
    <td>{{ item.question }}</td>
    <td>{{ item.correctAnswers?.[0]?.answer || 'No correct answer' }}</td>
    <td>{{ item.points }}</td>
  </tr>
</tbody>
    </table>
    <div class="exam-schedule">
      <h3>Exam Schedule:</h3>
      <p>{{ exam.start }} - {{ exam.end }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ViewExam',
  data() {
    return {
      exam: {},
    };
  },
  async created() {
    try {
      const examId = this.$route.params.examId;
      const response = await axios.get(`http://localhost:8000/api/exams/${examId}/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      this.exam = response.data.exam;
    } catch (error) {
      console.error('Failed to fetch exam details:', error.message);
    }
  },
};
</script>

<style scoped>
.exam-details-container {
  margin-top: 20px;
}

.exam-schedule {
  margin-top: 20px;
}
</style>
  