<template>
    <div class="exam-container">
      <!-- Exam Header Card -->
      <div class="card mb-4">
        <div class="card-header">
          <h1 class="card-title">{{ exam.title }}</h1>
        </div>
        <div class="card-body">
          <p class="card-text"><strong>Quarter:</strong> {{ exam.quarter }}</p>
          <p class="card-text"><strong>Start Date:</strong> {{ formatDateTime(exam.start) }}</p>
          <p class="card-text"><strong>End Date:</strong> {{ formatDateTime(exam.end) }}</p>
        </div>
      </div>
  
      <!-- Question List -->
      <div v-for="(question, index) in exam.questions" :key="index" class="card mb-4 question-block">
        <div class="card-header">
          <h4 class="card-title">Question {{ index + 1 }}</h4>
        </div>
        <div class="card-body">
          <p class="question-text">{{ question.question }}</p>
    
          <div class="answer-section">
            <!-- Multiple Choice -->
            <div v-if="question.question_type === 'multiple-choice'" class="choices">
              <p><strong>Type:</strong> Multiple Choice</p>
              <ul>
                <li v-for="(choice, idx) in question.choices" :key="idx">
                  {{ String.fromCharCode(65 + idx) }}. {{ choice }}
                </li>
              </ul>
            </div>
    
            <!-- True/False -->
            <div v-if="question.question_type === 'true-false'" class="choices">
              <p><strong>Type:</strong> True/False</p>
              <ul>
                <li>True</li>
                <li>False</li>
              </ul>
            </div>
    
            <!-- Identification -->
            <div v-if="question.question_type === 'identification'" class="choices">
              <p><strong>Type:</strong> Identification</p>
              <p><strong>Answer:</strong> {{ question.correct_answers[0].correct_answer }}</p>
            </div>
          </div>
    
          <!-- Points Section -->
          <p class="points"><strong>Points:</strong> {{ question.correct_answers[0].points }}</p>
        </div>
      </div>
  
      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'DisplayExaminations',
    data() {
      return {
        exam: null,
        error: '',
      };
    },
    created() {
      this.fetchExam();
    },
    methods: {
      async fetchExam() {
        try {
          const examId = this.$route.params.exam_id;
          const token = localStorage.getItem('token');
  
          if (!token) {
            this.error = 'Authorization token is missing. Please log in again.';
            return;
          }
  
          const response = await axios.post(
            `http://localhost:8000/api/view-exam/${examId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
  
          this.exam = response.data.exam;
        } catch (error) {
          this.error = error.response ? error.response.data.message : 'Failed to fetch exam data. Please try again later.';
        }
      },
      formatDateTime(dateTime) {
        const [date, time] = dateTime.split('T');
        return `${date} ${time}`;
      }
    },
  };
  </script>
  
  <style scoped>
  /* Main Container */
  .exam-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    border: 1px solid #ddd;
  }
  
  /* Question Block Styling */
  .question-block {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
  }
  
  /* Card Header Styling */
  .card-header {
    background-color: #f7f7f7;
    border-bottom: 1px solid #ddd;
  }
  
  /* Points Styling */
  .points {
    font-size: 1.1em;
    color: #007bff;
  }
  
  /* Error Message Styling */
  .alert {
    margin-top: 20px;
  }
  </style>
  