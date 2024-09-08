<template>
  <div class="exam-container">
    <h2 class="text-center exam-title">{{ exam.title }}</h2>

    <!-- Exam Form -->
    <form v-if="!examSubmitted" @submit.prevent="submitExam" class="exam-form">
      <div v-if="exam.questions && exam.questions.length">
        <div v-for="(question, index) in paginatedQuestions" :key="question.id" class="question-container">
          <h5 class="question-header">Question {{ index + 1 + (currentPage - 1) * questionsPerPage }}:</h5>
          <p class="question-text">{{ question.question }}</p>
          <div class="choice-container">
            <label v-for="choice in question.choices" :key="choice.id" class="choice-label">
        <input type="radio" :name="'question_' + question.id" :value="choice.id" @input="updateSelectedAnswer(question.id, choice.choices)" />
        {{ choice.choices }}
      </label>
    </div>
    <textarea v-if="question.requires_text_input" @input="updateStudentTextAnswer(question.id, $event.target.value)" class="text-answer" 
      placeholder="Your answer">
    </textarea>
        </div>
      </div>
      <div v-else>
        <p class="no-questions">No questions available for this exam.</p>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="prevPage" 
          :disabled="currentPage === 1">
          Previous
        </button>
        <span class="pagination-status">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="nextPage" 
          :disabled="currentPage === totalPages">
          Next
        </button>
      </div>

      <!-- Display validation errors -->
      <div v-if="validationError" class="alert alert-danger">
        {{ validationError }}
      </div>

      <div class="button-group">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit Exam</span>
        </button>
        <button type="button" @click="clearForm" class="btn btn-secondary">Clear form</button>
      </div>
    </form>

    <!-- Results Display -->
    <div v-if="examSubmitted" class="results-container">
      <h3 class="results-title">Your Results</h3>
      <ul class="results-list">
        <li v-for="result in results" :key="result.question_number" class="result-item">
          <p><strong>Question {{ result.question }}:</strong></p>
          <p>Your Answer: <span class="user-answer">{{ result.student_answer }}</span></p>
          <p>Correct Answer: <span class="correct-answer">{{ result.correct_answer }}</span></p>
          <p>Points: <span class="points">{{ result.points_awarded}}</span></p>
        </li>
      </ul>
      <p class="total-score"><strong>Total Score: {{ totalScore }}</strong></p>
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
    // Add a null/undefined check to avoid errors
    return this.exam.questions ? Math.ceil(this.exam.questions.length / this.questionsPerPage) : 1;
  },
},
  created() {
    this.fetchExam();
  },
  methods: {

    clearForm() {
      // Reset the form selections and answers
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
        const response = await axios.get(`http://localhost:8000/api/viewExam2/${examId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.exam = response.data.exam;
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to retrieve exam details. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.$router.push('/myExams');
      }
    },

    // validateAnswers() {
    //   if (Object.keys(this.selectedAnswers).length !== this.exam.questions.length) {
    //     this.validationError = 'Please answer all questions before submitting.';
    //     return false;
    //   }

    //   for (const question of this.exam.questions) {
    //     if (!this.selectedAnswers[question.id] && !this.studentTextAnswers[question.id]) {
    //       this.validationError = `Please provide an answer for question ${question.id}`;
    //       return false;
    //     }
    //   }

    //   this.validationError = '';
    //   return true;
    // },
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

      // const examId = this.$route.params.exam_id;
      // const formattedAnswers = this.exam.questions.map((question) => {
      //   const selectedChoice = this.selectedAnswers[question.id]; 
      //   const textAnswer = this.studentTextAnswers[question.id] || null; 

      const formattedAnswers = this.exam.questions.map((question) => {
      const selectedChoice = this.selectedAnswers[question.id]; 
      const textAnswer = this.studentTextAnswers[question.id] || null; 
      let addchoices_id = null;
      let Student_answer = null;
      if (selectedChoice) {
        const choice = question.choices.find(choice => choice.choices === selectedChoice);
        addchoices_id = choice.id;
        Student_answer = choice.choices;
      } else {
        Student_answer = textAnswer;
      }
      return {
        question_id: question.id,
        addchoices_id,
        Student_answer,
      };
    });

    console.log('Formatted answers:', formattedAnswers);

    try {
      const examId = this.$route.params.exam_id;
      await axios.post(`http://localhost:8000/api/exam/${examId}/submitExam2`, 
        { answers: formattedAnswers },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

    Swal.fire({
      title: 'Success!',
      text: 'Exam submitted successfully!',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      this.getResults(examId);
    });

      } catch (error) {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to submit exam. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } finally {
            this.isSubmitting = false;
          }
        },

        async getResults(examId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/getResults/${examId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Response data:', response.data);

        this.results = response.data.results.map((result) => {
          const studentAnswer = this.selectedAnswers[result.question_id] || this.studentTextAnswers[result.question_id];
          return {
            ...result,
            Student_answer: studentAnswer, 
          };
        });

        console.log('Updated results:', this.results); // Add this line to inspect the updated results array

        this.totalScore = response.data.total_score;
        this.examSubmitted = true;
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to retrieve results. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
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
    }

    
  }
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

    button {
      padding: 10px 20px;
    }
  }

  .results-container {
    margin-top: 20px;
    .total-score {
      font-weight: bold;
      margin-top: 10px;
    }
  }
}
</style>