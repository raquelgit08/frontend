<template>
  <div class="exam-page">
    <h2>Create Exam</h2>
    <form @submit.prevent="submitExam">
      <!-- Exam Title -->
      <div class="mb-3">
        <label for="exam-title" class="form-label">Exam Title</label>
        <input
          type="text"
          id="exam-title"
          v-model="examTitle"
          class="form-control"
          required
        />
      </div>

      <!-- Quarter Selection -->
      <div class="mb-3">
        <label for="quarter" class="form-label">Quarter</label>
        <select id="quarter" v-model="selectedQuarter" class="form-select">
          <option value="1st Quarter">1st Quarter</option>
          <option value="2nd Quarter">2nd Quarter</option>
          <option value="3rd Quarter">3rd Quarter</option>
          <option value="4th Quarter">4th Quarter</option>
        </select>
      </div>

      <!-- Start and End Time -->
      <div class="row mb-3">
        <div class="col">
          <label for="start-date" class="form-label">Start Date & Time</label>
          <input
            type="datetime-local"
            id="start-date"
            v-model="startDateTime"
            class="form-control"
            required
          />
        </div>
        <div class="col">
          <label for="end-date" class="form-label">End Date & Time</label>
          <input
            type="datetime-local"
            id="end-date"
            v-model="endDateTime"
            class="form-control"
            required
          />
        </div>
      </div>
      
      <!-- Questions Section -->
      <div v-for="(question, index) in questions" :key="index" class="question-card mb-4">
        <h5 class="question-title">Question {{ index + 1 }}</h5>

        <div class="mb-3">
          <label class="form-label">Question Type</label>
          <select v-model="question.type" class="form-select" @change="changeQuestionType(index, question.type)">
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True or False</option>
            <option value="identification">Identification</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Question</label>
          <input
            type="text"
            v-model="question.question"
            class="form-control"
            required
          />
        </div>

        <!-- Options for Multiple Choice -->
        <div v-if="question.type === 'multiple-choice'" class="mb-3">
          <label class="form-label">Options</label>
          <div v-for="(option, idx) in question.options" :key="idx" class="d-flex align-items-center mb-2">
            <input
              type="text"
              v-model="question.options[idx]"
              class="form-control me-2"
              placeholder="Option"
              required
            />
            <button @click="removeOption(index, idx)" type="button" class="btn btn-danger btn-sm">X</button>
          </div>
          <button @click="addOption(index)" type="button" class="btn btn-secondary btn-sm">Add Option</button>
        </div>

        <!-- Correct Answer -->
        <div class="mb-3">
          <label class="form-label">Correct Answer</label>
          <input
            v-if="question.type !== 'multiple-choice'"
            type="text"
            v-model="question.correctAnswer"
            class="form-control"
            required
          />
          <select v-else v-model="question.correctAnswer" class="form-select">
            <option v-for="(option, idx) in question.options" :key="idx" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <!-- Points -->
        <div class="mb-3">
          <label class="form-label">Points</label>
          <input
            type="number"
            v-model="question.points"
            class="form-control"
            min="1"
            required
          />
        </div>

        <!-- Button Alignment for Options and Remove Question -->
        <div class="d-flex justify-content-between mt-3">
          <button @click="removeQuestion(index)" type="button" class="btn btn-danger btn-sm">Remove Question</button>
        </div>
      </div>

      <!-- Buttons Alignment: Add New Question Left, Submit Right -->
      <div class="d-flex justify-content-between mt-4">
        <button @click="addQuestion" type="button" class="btn btn-secondary">Add New Question</button>
        <button type="submit" class="btn btn-primary">Create Exam</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      examTitle: '',
      selectedQuarter: '1st Quarter',
      startDateTime: '',
      endDateTime: '',
      questions: [],
    };
  },
  methods: {
    addQuestion() {
      const newQuestion = {
        type: 'multiple-choice',
        question: '',
        correctAnswer: '',
        points: 1,
        options: ['', '', '', ''],
      };

      this.questions.push(newQuestion);
    },
    changeQuestionType(index, type) {
      this.questions[index].type = type;

      if (type === 'multiple-choice') {
        this.questions[index].options = ['', '', '', ''];
        this.questions[index].correctAnswer = '';
      } else {
        delete this.questions[index].options;
        this.questions[index].correctAnswer = '';
      }
    },
    removeQuestion(index) {
      this.questions.splice(index, 1);
    },
    addOption(index) {
      this.questions[index].options.push('');
    },
    removeOption(questionIndex, optionIndex) {
      this.questions[questionIndex].options.splice(optionIndex, 1);
    },
    formatDateTime(dateTime) {
      const [date, time] = dateTime.split('T');
      return `${date} ${time}:00`;
    },
    async submitExam() {
      try {
        const payload = {
          classtable_id: this.$route.params.class_id,
          title: this.examTitle,
          quarter: this.selectedQuarter,
          start: this.formatDateTime(this.startDateTime),
          end: this.formatDateTime(this.endDateTime),
          questions: this.questions.map((q) => {
            let choices = [];
            if (q.type === 'multiple-choice') {
              choices = q.options;
            } else if (q.type === 'true-false') {
              choices = ['True', 'False'];
            }

            return {
              question_type: q.type,
              question: q.question,
              choices: choices,
              correct_answers: [
                {
                  correct_answer: q.correctAnswer,
                  points: q.points,
                },
              ],
            };
          }),
        };

        await axios.post('http://localhost:8000/api/addExam2', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        Swal.fire('Success', 'Exam created successfully!', 'success').then(() => {
          this.$router.push(`/AddExam/${this.$route.params.class_id}`);
        });
      } catch (error) {
        console.error('Failed to create exam:', error.message);
      }
    },
  },
};
</script>


<style scoped>
/* Main Container */
.main-container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 20px;
}

/* Subject Info Container */
.subject-info-container {
  flex: 1;
  max-width: 300px;
  margin-right: 20px;
  display: flex;
  align-items: center;
}

/* Subject Info Styling */
.subject-info {
  width: 100%;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.subject-info h2 {
  font-size: 1.5rem;
  color: #343a40;
  font-weight: 700;
  margin-bottom: 8px;
}

.subject-info p {
  font-size: 1rem;
  color: #6c757d;
}

/* Navigation Bar */
.nav {
  flex: 2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
}

.nav-link {
  color: #343a40 !important;
  text-decoration: none;
  font-weight: 500;
}

.nav-link:hover {
  color: #007bff !important;
}

.router-link-active {
  color: #007bff !important;
  border-bottom: 2px solid #007bff;
}

/* Exam Page Styling */
.exam-page {
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #0b355e;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 20px auto;
}

/* Question Card Styling */
.question-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.question-title {
  font-weight: 600;
  color: #0b355e;
  margin-bottom: 15px;
}

/* Buttons */
.btn-primary, .btn-secondary, .btn-danger, .btn-warning {
  border-radius: 5px;
  font-weight: 600;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-sm {
  font-size: 0.85rem;
  padding: 5px 10px;
}

.btn-danger.btn-sm {
  padding: 4px 8px;
  font-size: 0.8rem;
}

/* Grid and Card Adjustments */
.card {
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  font-weight: bold;
}

.card-footer {
  background-color: #f8f9fa;
}
</style>

