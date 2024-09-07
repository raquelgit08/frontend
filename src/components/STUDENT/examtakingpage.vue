<template>
  <div class="container">
    <h2 class="text-center">{{ exam.title }}</h2>
    
    <form @submit.prevent="submitExam">
      <div v-if="exam.questions && exam.questions.length">
        <div v-for="(question, index) in exam.questions" :key="question.id" class="mb-4">
          <h5>Question {{ index + 1 }}: {{ question.question }}</h5>
          <ul>
            <li v-for="choice in question.choices" :key="choice.id">
              <label>
                <input 
                  type="radio" 
                  :name="'question_' + question.id" 
                  :value="choice.id" 
                  v-model="selectedAnswers[question.id]" 
                />
                {{ choice.choices }}
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p>No questions available for this exam.</p>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting">Submitting...</span>
        <span v-else>Submit Exam</span>
      </button>
      <button @click="$router.push('/myExams')" class="btn btn-secondary">Back to Exams</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';  // Import SweetAlert2

export default {
  name: 'ExamTakingPages',
  data() {
    return {
      exam: {},  // Holds the exam details
      selectedAnswers: {},  // Holds the user's selected answers
      isSubmitting: false,  // Prevent multiple submissions
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
        this.exam = response.data.exam;
      } catch (error) {
        console.error('Failed to fetch exam:', error.message);
        this.$router.push('/myExams');
        alert('Failed to retrieve exam details. Please try again later.');
      }
    },

    // Handle exam submission
    async submitExam() {
      this.isSubmitting = true;

      const examId = this.$route.params.exam_id;
      const formattedAnswers = Object.entries(this.selectedAnswers).map(([question_id, correctanswer_id]) => ({
        question_id,
        correctanswer_id,
      }));

      try {
        await axios.post(`http://localhost:8000/api/submitExam2/${examId}`, 
          { answers: formattedAnswers },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        
        // Show SweetAlert on successful submission
        Swal.fire({
          title: 'Success!',
          text: 'Exam submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.$router.push('/myExams');  // Redirect after alert is dismissed
        });
        
      } catch (error) {
        console.error('Failed to submit exam:', error.response ? error.response.data : error.message);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to submit exam. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 50px;
}
.text-center {
  margin-bottom: 20px;
}
.mb-4 {
  margin-bottom: 20px;
}
.btn {
  margin-top: 20px;
}
</style>
