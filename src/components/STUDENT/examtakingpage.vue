<template>
    <div class="container">
      <h2 class="text-center">{{ exam.title }}</h2>
      <div v-if="timeRemaining > 0">
        <p>Time Remaining: {{ formatTime(timeRemaining) }}</p>
        <form @submit.prevent="submitExam">
          <div v-for="(question, index) in exam.questions" :key="question.id" class="mb-4">
            <h5>Question {{ index + 1 }}: {{ question.question }}</h5>
            <div v-for="choice in question.choices" :key="choice.id">
              <label>
                <input type="radio" :name="'question-' + question.id" :value="choice.id" v-model="answers[question.id]" />
                {{ choice.choices }}
              </label>
            </div>
          </div>
          <button type="submit" class="btn btn-success">Submit Exam</button>
        </form>
      </div>
      <div v-else>
        <p>Time is up! The exam has been automatically submitted.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ExamTakingPages',
    data() {
      return {
        exam: {},
        timeRemaining: 0,
        answers: {},
      };
    },
    created() {
      this.fetchExam();
      this.startTimer();
    },
    methods: {
      async fetchExam() {
        const examId = this.$route.params.exam_id;
        try {
          const response = await axios.get(`http://localhost:8000/api/exam/${examId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          this.exam = response.data.exam;
          this.calculateTimeRemaining();
        } catch (error) {
          console.error('Failed to fetch exam:', error.message);
        }
      },
      calculateTimeRemaining() {
        const now = new Date();
        const end = new Date(this.exam.end);
        this.timeRemaining = (end - now) / 1000;
      },
      startTimer() {
        const timer = setInterval(() => {
          if (this.timeRemaining > 0) {
            this.timeRemaining--;
          } else {
            clearInterval(timer);
            this.autoSubmitExam();
          }
        }, 1000);
      },
      formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      },
      async submitExam() {
        const examId = this.$route.params.exam_id;
        try {
          await axios.post(`http://localhost:8000/api/exam/${examId}/submit`, {
            answers: this.answers,
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          alert('Exam submitted successfully!');
          this.$router.push('/examResults');  // Redirect to results page
        } catch (error) {
          console.error('Failed to submit exam:', error.message);
          alert('Failed to submit exam. Please try again later.');
        }
      },
      autoSubmitExam() {
        this.submitExam();
        alert('Time is up! The exam has been automatically submitted.');
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles remain the same */
  </style>
  