<template>
  <div class="exam-container">
    <h2 class="text-center exam-title">{{ exam.title }}</h2>

    <!-- Exam Form -->
    <form v-if="!examSubmitted" @submit.prevent="submitExam" class="exam-form">
      <div v-if="exam.questions && exam.questions.length">
        <div v-for="(question, index) in paginatedQuestions" :key="index" class="question-container">
          <h4 class="question-header">{{ index + 1 }}. {{ question.question }}</h4>
          
          <!-- Multiple Choice Questions -->
          <div v-if="question.choices && question.choices.length > 0" class="choice-container">
            <label v-for="choice in question.choices" :key="choice.id" class="choice-label">
              <input type="radio" :name="'question_' + question.id" :value="choice.id" v-model="selectedAnswers[question.id]" />
              {{ choice.choices }}
            </label>
          </div>
          
          <!-- No Choices Available -->
          <div v-else>
            <input type="text" v-model="studentTextAnswers[question.id]" placeholder="Your answer here" class="form-control" />
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <button type="button" class="btn btn-secondary" @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span class="pagination-status">Page {{ currentPage }} of {{ totalPages }}</span>
        <button type="button" class="btn btn-secondary" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>

      <!-- Validation Errors -->
      <div v-if="validationError" class="alert alert-danger">
        {{ validationError }}
      </div>

      <!-- Form Buttons -->
      <div class="button-group">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit Exam</span>
        </button>
        <button type="button" @click="clearForm" class="btn btn-secondary">Clear form</button>
      </div>
    </form>

    <!-- Display Results After Submission -->
    <div v-if="examSubmitted" class="results-container">
      <div class="row">
        <div class="col-8">
          <h3 class="results-title">Your Results</h3>
          <ul class="results-list">
            <li v-for="(result, index) in results" :key="result.question_number" class="result-item">
              <p><strong>{{ index + 1 }}. Question {{ result.question }}:</strong></p>
              <p>Your Answer: 
                <span :class="{'correct-answer': result.student_answer === result.correct_answer, 'incorrect-answer': result.student_answer !== result.correct_answer}" class="user-answer">
                  {{ result.student_answer }}
                </span>
              </p>
              <p>Correct Answer: <span class="correct-answer">{{ result.correct_answer }}</span></p>
              <p>Points: <span class="points">{{ result.points_awarded }}</span></p>
            </li>
          </ul>
          <p class="total-score"><strong>Total Score: {{ totalScore }}</strong></p>
        </div>
        <div class="col-4">
          <h3 class="feedback-title">Your Feedback</h3>
          <textarea v-model="comment" class="form-control" rows="10" placeholder="Please provide your feedback about the exam..."></textarea>
          <button @click="submitFeedback(exam.id)" type="button" class="btn btn-primary mt-2">Submit Feedback</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'ExamTakingPages',
  data() {
    return {
      exam: {},
      selectedAnswers: {},
      studentTextAnswers: {},
      isSubmitting: false,
      validationError: '',
      comment: '',
      examSubmitted: false,
      results: [],
      totalScore: 0,
      currentPage: 1,
      questionsPerPage: 5,
    };
  },
  computed: {
    paginatedQuestions() {
      const start = (this.currentPage - 1) * this.questionsPerPage;
      const end = start + this.questionsPerPage;
      return this.exam.questions ? this.exam.questions.slice(start, end) : [];
    },
    totalPages() {
      return this.exam.questions ? Math.ceil(this.exam.questions.length / this.questionsPerPage) : 1;
    },
  },
  created() {
    this.fetchExam();
  },
  methods: {
    clearForm() {
      this.selectedAnswers = {};
      this.studentTextAnswers = {};
      this.validationError = '';
    },
    validateAnswers() {
      if (Object.keys(this.selectedAnswers).length + Object.keys(this.studentTextAnswers).length !== this.exam.questions.length) {
        this.validationError = 'Please answer all questions before submitting.';
        return false;
      }
      for (const question of this.exam.questions) {
        if (!this.selectedAnswers[question.id] && !this.studentTextAnswers[question.id]) {
          this.validationError = `Please provide an answer for question ${question.id}`;
          return false;
        }
      }
      this.validationError = '';
      return true;
    },
    async fetchExam() {
      const examId = this.$route.params.exam_id;
      try {
        const response = await axios.get(`http://localhost:8000/api/viewExam2updated2/${examId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.exam = response.data.exam;
        this.exam.questions = response.data.exam.instructions.questions;
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to retrieve exam details. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        this.$router.push('/myExams');
      }
    },
    async submitExam() {
      if (!this.validateAnswers()) return;

      this.isSubmitting = true;
      const formattedAnswers = this.exam.questions.map((question) => {
        const selectedChoice = this.selectedAnswers[question.id];
        const textAnswer = this.studentTextAnswers[question.id] || null;
        return {
          question_id: question.id,
          addchoices_id: selectedChoice ? selectedChoice : null,
          Student_answer: selectedChoice ? question.choices.find(choice => choice.id === selectedChoice)?.choices : textAnswer,
        };
      });
      console.log('Formatted answers:', formattedAnswers);
      try {
        const examId = this.$route.params.exam_id;
        await axios.post(`http://localhost:8000/api/exam/${examId}/submitExam2`, 
          { answers: formattedAnswers },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        Swal.fire({
          title: 'Success!',
          text: 'Exam submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.getResults(examId);
        });

      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to submit exam. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    async getResults(examId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/getResultswithtestbank/${examId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.results = response.data.results.map((result) => {
          const studentAnswer = this.selectedAnswers[result.question_id] || this.studentTextAnswers[result.question_id];
          return {
            ...result,
            Student_answer: studentAnswer,
          };
        });
        this.totalScore = response.data.total_score;
        this.examSubmitted = true;
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to retrieve results. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    async submitFeedback(examId) {
      try {
        await axios.post(`http://localhost:8000/api/commentfeedback/${examId}`, 
          { comment: this.comment },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        Swal.fire({
          title: 'Success!',
          text: 'Feedback submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.comment = '';
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to submit feedback. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    },
  },
};
</script>

<style scoped>
.exam-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.exam-title {
  margin-bottom: 20px;
}

.exam-form {
  border: 1px solid #dee2e6;
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
}

.question-container {
  margin-bottom: 20px;
}

.choice-container {
  margin-top: 10px;
}

.choice-label {
  display: block;
}

.pagination-controls {
  margin: 20px 0;
}

.results-container {
  margin-top: 20px;
}

.results-title {
  margin-bottom: 20px;
}

.results-list {
  list-style: none;
  padding: 0;
}

.result-item {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.correct-answer {
  color: green;
}

.incorrect-answer {
  color: red;
}

.points {
  font-weight: bold;
}

.feedback-title {
  margin-bottom: 10px;
}
</style>
