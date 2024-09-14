<template>
  <div class="exam-container">
    <h2 class="text-center exam-title">{{ exam.title }}</h2>

    <!-- Exam Form -->
    <form v-if="!examSubmitted" @submit.prevent="submitExam" class="exam-form">
      <div v-if="exam.questions && exam.questions.length">
        <div v-for="(question, index) in paginatedQuestions" :key="index" class="question-container">
  <h4 class="question-header">{{ index + 1 }}. {{ question.question }}</h4>
  <div v-if="question.choices && question.choices.length > 0" class="choice-container">
    <label v-for="choice in question.choices" :key="choice.id" class="choice-label">
      <input
        type="radio"
        :name="'question_' + question.id"
        :value="choice.choices.id"
        v-model="selectedAnswers[question.id]"
      />
      {{ choice.choices }}
    </label>
  </div>
  <div v-else>No choices available for this question</div>
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
    updateSelectedAnswer(questionId, answerText) {
      this.selectedAnswers[questionId] = answerText;
    },
    updateStudentTextAnswer(questionId, answerText) {
      this.studentTextAnswers[questionId] = answerText;
    },
    async fetchExam() {
      const examId = this.$route.params.exam_id;
      try {
        const response = await axios.get(`http://localhost:8000/api/viewExam2updated2/${examId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Log to ensure questions and choices are fetched correctly
        console.log(response.data.exam);

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
    validateAnswers() {
      if (Object.keys(this.selectedAnswers).length !== this.exam.questions.length) {
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
    async submitExam() {
      if (!this.validateAnswers()) return;

      this.isSubmitting = true;
      const formattedAnswers = this.exam.questions.map((question) => {
        const selectedChoice = this.selectedAnswers[question.id];
        const textAnswer = this.studentTextAnswers[question.id] || null;
        let addchoices_id = null;
        let Student_answer = null;
        if (selectedChoice) {
          const choice = question.choices.find(choice => choice.choice_text === selectedChoice);
          addchoices_id = choice?.id;
          Student_answer = choice?.choice_text;
        } else {
          Student_answer = textAnswer;
        }
        return {
          question_id: question.id,
          addchoices_id,
          Student_answer,
        };
      });

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

<style scoped lang="scss">
.exam-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .exam-title {
    color: #007bff;
    margin-bottom: 20px;
    text-align: center;
  }

  .question-container {
    margin-bottom: 20px;
  }

  .question-header {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .choice-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .choice-label {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    input {
      margin-right: 10px;
    }
  }

  .pagination-controls {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .button-group {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }

  .results-container {
    margin-top: 30px;

    .results-title {
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .feedback-title {
      font-size: 1.3rem;
      margin-bottom: 10px;
    }

    .total-score {
      font-size: 1.2rem;
      margin-top: 20px;
    }

    .result-item {
      margin-bottom: 20px;
    }

    .correct-answer {
      color: green;
      font-weight: bold;
    }

    .incorrect-answer {
      color: red;
      font-weight: bold;
    }

    .points {
      font-size: 1.1rem;
    }
  }
}
</style>
