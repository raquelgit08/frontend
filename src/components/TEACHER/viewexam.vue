<template>
    <div class="exam-details-page">
      <div v-if="examDetails" class="card mt-4">
        <div class="card-header">
          <h4>{{ examDetails.title }}</h4>
        </div>
        <div class="card-body">
          <p><strong>Quarter:</strong> {{ examDetails.quarter }}</p>
          <p><strong>Start:</strong> {{ examDetails.start }}</p>
          <p><strong>End:</strong> {{ examDetails.end }}</p>
          <p><strong>Total Questions:</strong> {{ examDetails.questions.length }}</p>
          <p><strong>Total Points:</strong> {{ examDetails.total_points }}</p>
          
          <!-- Display the list of questions -->
          <div v-for="(question, index) in examDetails.questions" :key="index">
            <h5>Question {{ index + 1 }}</h5>
            <p>{{ question.question }}</p>
            <ul v-if="question.choices.length">
              <li v-for="choice in question.choices" :key="choice.id">{{ choice.choices }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Loading exam details...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ViewExam',
    data() {
      return {
        examDetails: null,
      };
    },
    created() {
      this.fetchExamDetails();
    },
    methods: {
      async fetchExamDetails() {
        try {
          const examId = this.$route.params.exam_id; 
          const response = await axios.get(`http://localhost:8000/api/view-exam/${examId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          this.examDetails = response.data.exam;
        } catch (error) {
          console.error('Failed to fetch exam details:', error);
          // You can also add some error handling logic here, like showing a user-friendly message
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .exam-details-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .card {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .card-header h4 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .card-body p {
    font-size: 18px;
    margin-bottom: 8px;
  }
  </style>
  