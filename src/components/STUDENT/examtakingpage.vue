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
          <textarea v-if="question.requires_text_input" v-model="studentTextAnswers[question.id]" placeholder="Your answer"></textarea>
        </div>
      </div>
      <div v-else>
        <p>No questions available for this exam.</p>
      </div>

      <!-- Display validation errors -->
      <div v-if="validationError" class="alert alert-danger">
        {{ validationError }}
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
  name: 'ExamTakingPage',
  data() {
    return {
      exam: {},  // Holds the exam details
      selectedAnswers: {},  // Holds the user's selected answers (multiple-choice)
      studentTextAnswers: {},  // Holds the user's text answers for questions requiring written input
      isSubmitting: false,  // Prevent multiple submissions
      validationError: '',  // To store validation errors
    };
  },
  created() {
    this.fetchExam();
  },
  methods: {
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

    validateAnswers() {
      // Validate that all required questions have been answered
      if (Object.keys(this.selectedAnswers).length !== this.exam.questions.length) {
        this.validationError = 'Please answer all questions before submitting.';
        return false;
      }

      // Additional backend-like validations:
      for (const question of this.exam.questions) {
        if (!this.selectedAnswers[question.id] && !this.studentTextAnswers[question.id]) {
          this.validationError = `Please provide an answer for question ${question.id}`;
          return false;
        }
      }

      this.validationError = '';  // Clear any existing validation errors
      return true;
    },

    
    async submitExam() {
    // Perform validation before submitting
    if (!this.validateAnswers()) return;

    this.isSubmitting = true;

    const examId = this.$route.params.exam_id;
    const formattedAnswers = this.exam.questions.map((question) => ({
        question_id: question.id,
        addchoices_id: this.selectedAnswers[question.id] || null,  // Send selected multiple-choice answer
        Student_answer: this.studentTextAnswers[question.id] || null,  // Send text answer if applicable
    }));

    try {
        await axios.post(`http://localhost:8000/api/submitExam2/${examId}`, 
          { answers: formattedAnswers },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          }
        );

        // Success notification
        Swal.fire({
          title: 'Success!',
          text: 'Exam submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.$router.push('/myExams');  // Redirect to exams list
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
textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
}
.alert {
  margin-top: 10px;
}
</style>
