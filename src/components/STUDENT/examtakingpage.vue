<template>
  <div class="container-fluid">
    <div class="timer-container">
      <div v-if="!examOver" class=" time-box">
        <p style="font-size: 20px;">TIME REMAINING:</p>
        <h1>{{ formattedTime }}</h1>
      </div>
    </div>
    <h2 class="text-center exam-title">{{ exam.title }}</h2>
    <p> {{ instructions.instruction }}</p>
    <div v-if="examOver">
      <h3>Time is up!</h3>
    </div>
    <!-- Exam Form -->
    <!-- <div class="question-box"> -->
      <form v-if="!examSubmitted && !examOver" @submit.prevent="submitExam" class="question-box">
      <div v-if="exam.questions && exam.questions.length">
        <div v-for="(question, index) in paginatedQuestions" :key="index" class="question-container">
          <h4 class="question-header"> {{ question.question }}</h4>
          
          <!-- Multiple Choice Questions -->
          <div v-if="question.choices && question.choices.length > 0" class="choice-container">
            <label v-for="choice in question.choices" :key="choice.id" class="choice-box">
              <input type="radio" :name="'question_' + question.id" :value="choice.id" v-model="selectedAnswers[question.id]" :disabled="examOver" />
              {{ choice.choices }}
            </label>
          </div>
          
          <!-- No Choices Available -->
          <div v-else>
            <input type="text" v-model="studentTextAnswers[question.id]" placeholder="Your answer here" class="form-control" :disabled="examOver" />
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <!-- <button type="button" class="btn btn-secondary" @click="prevPage" :disabled="currentPage === 1 || examOver">Previous</button> -->
        <span class="pagination-status">Question {{ currentPage }} of {{ totalPages }}</span>
        <button type="button" class="btn btn-secondary" @click="nextPage" :disabled="currentPage === totalPages || examOver">Next</button>
      </div>
      <div v-if="!examSubmitted && !examOver && currentPage === totalPages" class="button-group">
        <button type="submit" @click="submitExam" class="btn btn-primary w-100" :disabled="isSubmitting">
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit Exam</span>
        </button>
      </div>

      <!-- Validation Errors -->
      <div v-if="validationError" class="alert alert-danger">
        {{ validationError }}
      </div>

      <!-- Form Buttons -->
      <!-- <div class="button-group">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting || examOver">
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit Exam</span>
        </button>
        <button type="button" @click="clearForm" class="btn btn-secondary" :disabled="examOver">Clear form</button>
      </div> -->
    </form>
    <!-- </div> -->

    <!-- Display Results After Submission -->
    <div v-if="examSubmitted" class="results-container">
      <div class="row">
        <div class="col-md-7 ">
          <div class="result">
            <h3 class="results-title">Your Results</h3>
            <p class="total-score"><strong>Total Score: {{ totalScore }} / {{ totalPossiblePoints }}</strong></p>
            <p>Average: {{ average }} %</p>
            
            <div class="donut-chart-container">
              <canvas id="averageChart"></canvas>
              <div class="average-text">{{ average }}%</div>
              
            </div>
            <button @click="showResult" type="button" class="btn btn-primary mt-2">Show Result</button>
            <div class="box" v-if="showResults">
              <div class="show">
                <ul class="results-list">
                  <li v-for="(result, index) in results" :key="result.question_number" class="result-item">
                    <p><strong>{{ index + 1 }}. Question {{ result.question }}:</strong></p>
                    <p>Your Answer: 
                      <span :class="{'correct-answer': result.student_answer === result.correct_answer, 'incorrect-answer': result.student_answer !== result.correct_answer}" class="user-answer">
                    {{ result.student_answer || 'Unanswered' }}
                  </span>
                    </p>
                    <!-- <p>Correct Answer: <span class="correct-answer">{{ result.correct_answer }}</span></p> -->
                    <p>Points: <span class="points">{{ result.points_awarded }}</span></p>
                  </li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
        <div class="col-md-5 ">
          <div class="feedbackarea">
            <h3 class="feedback-title">Your Feedback</h3>
            <textarea v-model="comment" class="form-control" rows="10" placeholder="Please provide your feedback about the exam..."></textarea>
            <button @click="submitFeedback(exam.id)" type="button" class="btn btn-primary mt-2">Submit Feedback</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'ExamTakingPages',
  data() {
    return {
      exam: {},
      instructions: {},
      selectedAnswers: {},
      studentTextAnswers: {},
      isSubmitting: false,
      validationError: '',
      comment: '',
      examSubmitted: false,
      showResults: false,
      results: [],
      totalScore: 0,
      totalPossiblePoints: 0,
            average: 0,
      currentPage: 1,
      questionsPerPage: 1,
      timeRemaining: 0,
      timerInterval: null,
      end: null,
      examOver: false, // Flag to indicate if the exam is over
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
    formattedTime() {
      if (this.timeRemaining < 0) {
        return 'Time is up!';
      }
      const minutes = Math.floor(this.timeRemaining / 60);
      const seconds = this.timeRemaining % 60;
      return `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
      
    }
  },
  created() {
    this.fetchExam();
  },
  methods: {
    clearForm() {
      if (!this.examOver) {
        this.selectedAnswers = {};
        this.studentTextAnswers = {};
        this.validationError = '';
      }
    },
    showResult() {
      this.showResults = !this.showResults; 
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
        console.log('Exam data retrieved:', response.data);
        this.exam = response.data.exam;
        this.exam.questions = response.data.exam.instructions.questions;
        const startTime = new Date(this.exam.start);
        const endTime = new Date(this.exam.end);
        this.initializeTimer(startTime, endTime);

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
     // if (!this.validateAnswers()) return;
    
      this.isSubmitting = true;

      const formattedAnswers = this.exam.questions.map((question) => {
        const selectedChoice = this.selectedAnswers[question.id] ;
        const textAnswer = this.studentTextAnswers[question.id] || null;

        // Submit null or a placeholder if the question is unanswered
        return {
          question_id: question.id,
          addchoices_id: selectedChoice ? selectedChoice : null,
          Student_answer: selectedChoice ? question.choices.find(choice => choice.id === selectedChoice)?.choices : textAnswer,
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
        this.examSubmitted = true; //
      }
      clearInterval(this.timerInterval);

      // this.timeRemaining=0;
      // this.minutes=0;
      // this.seconds=0;
   
    },

    async getResults(examId) {
      try {                                                         
        const response = await axios.get(`http://localhost:8000/api/getResultswithtestbank/${examId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('API Response:', response);

        // Log the specific data you're receiving
        console.log('Results:', response.data.results);
        console.log('Total Score:', response.data.total_score);
        this.results = response.data.results;
        this.totalScore = response.data.total_score;
        this.totalPossiblePoints = response.data.total_possible_points;
        this.average = response.data.average;

        this.renderAverageChart();
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
    renderAverageChart() {
      const ctx = document.getElementById('averageChart').getContext('2d');
      new Chart(ctx, { // Remove the variable if not needed
        type: 'doughnut',
        data: {
          labels: ['Average', 'Remaining'],
          datasets: [{
            data: [this.average, 100 - this.average],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverOffset: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
        },
      });
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
          this.$router.push('/saddsubject');
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
    initializeTimer(startTime, endTime) {
      const now = new Date();
      if (now > endTime) {
        this.submitExam(); 
        this.examOver = true;
        
        return;
      }

      this.timeRemaining = Math.floor((endTime - now) / 1000);

      this.timerInterval = setInterval(() => {
        this.timeRemaining = Math.floor((endTime - new Date()) / 1000);
        if (this.timeRemaining <= 0) {
          clearInterval(this.timerInterval);
          this.examOver = true;
          this.submitExam(); // Automatically submit when time is up
        }
      }, 1000);
    },
    nextPage() {
      if (this.currentPage < this.totalPages && !this.examOver) {
        this.currentPage += 1;
      }
    },
    prevPage() {
      if (this.currentPage > 1 && !this.examOver) {
        this.currentPage -= 1;
      }
    }
  },
  beforeMount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },
};
</script>

<style scoped>

.exam-title {
  margin-bottom: 20px;
}
/* .exam-form {
  padding-top: 0;
  padding: 80px;
} */
.question-box {
  border: 2px solid #ddd; /* Adds border to the entire question box */
  padding: 40px;
  border-radius: 10px; /* Rounded corners */
  width: 60%; /* Adjust width */
  margin: 20px auto; /* Centers the entire question box */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Adds subtle shadow */
}

.question-header {
  width: 100%; /* Ensures the text takes full width */
  text-align: left; /* Keeps the text aligned to the left */
  margin-bottom: 30px;
  font-size: 35px;
}

.choice-container {
  display: flex;
  flex-direction: column;
  gap: 25px; /* Adds space between choices */
  font-size: 25px;
  width: 100%;
}

.choice-box {
  border: 1px solid #ccc; /* Adds a border around each choice */
  padding: 10px;
  border-radius: 8px; /* Rounded corners for each choice box */
  background-color: #f9f9f9; /* Slight background color */
  width: 100%;
}

.choice-label {
  width: 100%;
  text-align: left; /* Ensures the label text is left aligned */
}


.pagination-controls {
  display: flex;
  justify-content: center; /* Centers the pagination controls */
  align-items: center;
  margin-top: 20px;
}

.pagination-status {
  margin: 0 10px;
}

.pagination-status {
  margin: 0 10px;
}

.results-container {
  margin-top: 20px;
 
}
.results-title {
  margin-bottom: 20px;
}
.results-list {
  list-style-type: none;
  padding: 0;
  
}
.result-item {
  margin-bottom: 10px;
}
.correct-answer {
  color: green;
}
.incorrect-answer {
  color: red;
}
.button-group {
  margin-top: 20px;
}
.timer-container {
  position: absolute;
  top: 110px; /* Adjust as needed */
  right: 40px; /* Adjust as needed */
  z-index: 1000; /* Ensure it is above other content */
}

.time-box {
 
  text-align: center;
  font-size: 50px;

}
.choice-container {
  margin-top: 10px;
}

/*  */

.choice-label input[type="radio"] {
  margin-right: 10px; /* Space between radio button and choice text */
}
.donut-chart-container {
  position: relative;
  width: 300px; /* Adjust width as needed */
  height: 300px; /* Adjust height as needed */
  margin: auto;
}

.average-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
}
.result, .feedbackarea, .box {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff;
  margin-right: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Adds subtle shadow */
}
.feedbackarea{
  margin-top: 30px;
}
.box {
 
  overflow-y: auto; /* Enable vertical scrolling if content overflows */
  max-height: 500px; /* Set a maximum height for the box */
}

</style>
