<template>
    <div class="container">
      <h2 class="text-center">{{ exam.title }}</h2>
      <div v-if="exam.questions && exam.questions.length">
        <div v-for="(question, index) in exam.questions" :key="question.id" class="mb-4">
          <h5>Question {{ index + 1 }}: {{ question.question }}</h5>
          <ul>
            <li v-for="choice in question.choices" :key="choice.id">{{ choice.choices }}</li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p>No questions available for this exam.</p>
      </div>
      <button @click="$router.push('/myexams')" class="btn btn-secondary">Back to Exams</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'StudentViewExams',
    data() {
      return {
        exam: {}  // Holds the exam details
      };
    },
    created() {
      this.fetchExam();
    },
    methods: {
      // Fetch the exam details from the server
      async fetchExam() {
        const examId = this.$route.params.exam_id;
        try {
          const response = await axios.get(`http://localhost:8000/api/viewExam2/${examId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          this.exam = response.data.exam;  // Store the exam details
        } catch (error) {
          console.error('Failed to fetch exam:', error.message);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Optional styling */
  .container {
    margin-top: 50px;
  }
  .text-center {
    margin-bottom: 20px;
  }
  </style>
  