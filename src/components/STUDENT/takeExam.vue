<!-- /src/components/STUDENT/TakeExam.vue -->

<template>
    <div>
      <h2>{{ exam.title }}</h2>
      <p><strong>Quarter:</strong> {{ exam.quarter }}</p>
      <p><strong>Start Time:</strong> {{ exam.start }}</p>
      <p><strong>End Time:</strong> {{ exam.end }}</p>
  
      <form @submit.prevent="submitExam">
        <div v-for="(question, index) in exam.questions" :key="index" class="mb-4">
          <h5>Question {{ index + 1 }}</h5>
          <p>{{ question.question }}</p>
  
          <div v-if="question.question_type === 'multiple-choice'">
            <div v-for="(choice, cIndex) in question.choices" :key="cIndex">
              <input
                type="radio"
                :name="'question_' + question.id"
                :value="choice.id"
                v-model="studentAnswers[question.id]"
              />
              {{ choice.choice }}
            </div>
          </div>
  
          <div v-else-if="question.question_type === 'true-false'">
            <input
              type="radio"
              :name="'question_' + question.id"
              value="True"
              v-model="studentAnswers[question.id]"
            />
            True
            <input
              type="radio"
              :name="'question_' + question.id"
              value="False"
              v-model="studentAnswers[question.id]"
            />
            False
          </div>
  
          <div v-else>
            <input
              type="text"
              v-model="studentAnswers[question.id]"
              class="form-control"
            />
          </div>
        </div>
  
        <button type="submit" class="btn btn-success">Submit Exam</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name:'TakingExam',
    data() {
        
      return {
        exam: {},
        studentAnswers: {},
      };
    },
    created() {
      this.fetchExamDetails();
    },
    methods: {
      async fetchExamDetails() {
        try {
          const examId = this.$route.params.exam_id;
          const classId = this.$route.params.class_id;
          const response = await axios.get(
            `http://localhost:8000/api/tblclass/${classId}/exam/${examId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          this.exam = response.data.exam;
  
          // Initialize studentAnswers with empty or default values
          this.exam.questions.forEach(question => {
            this.studentAnswers[question.id] = '';
          });
        } catch (error) {
          console.error('Failed to fetch exam details:', error.message);
          alert('Failed to load the exam. Please try again later.');
        }
      },
      async submitExam() {
        try {
          const examId = this.$route.params.exam_id;
          const payload = {
            answers: Object.keys(this.studentAnswers).map(questionId => ({
              question_id: questionId,
              correctanswer_id: this.studentAnswers[questionId],
            })),
          };
  
          await axios.post(`http://localhost:8000/api/submitExam/${examId}`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          alert('Exam submitted successfully!');
          this.$router.push(`/studentdashboard`);
        } catch (error) {
          console.error('Failed to submit exam:', error.message);
          alert('Failed to submit exam. Please try again later.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Custom styles for the exam taking page */
  .mb-4 {
    margin-bottom: 1.5rem;
  }
  </style>
  