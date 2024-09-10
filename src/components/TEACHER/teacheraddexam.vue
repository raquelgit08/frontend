<template>
  <div class="container-fluid">
    <h2>Create Exam</h2>
    <p>Exam Title: {{ examDetails.title }}</p>
    <p>Quarter: {{ examDetails.quarter }}</p>
    <p>Start Date & Time: {{ examDetails.start }}</p>
    <p>End Date & Time: {{ examDetails.end }}</p>
    <form @submit.prevent="submitExam">
      <div class="mb-3">
        <label for="instruction" class="form-label">INSTRUCTION/S :</label>
        <input type="text"  id="instruction" v-model="instruction" class="form-control" required />
      </div>

      <!-- Questions Section -->
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="question-card mb-4 p-3 border rounded"
      >
        <h5 class="question-title">Question {{ index + 1 }}</h5>

        <div class="mb-3">
          <label class="form-label">Question Type</label>
          <select
            v-model="question.type"
            class="form-select"
            @change="changeQuestionType(index, question.type)"
          >
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
            placeholder="Enter the question text"
            required
          />
        </div>

        <!-- Options for Multiple Choice -->
        <div v-if="question.type === 'multiple-choice'" class="mb-3">
          <label class="form-label">Options</label>
          <div
            v-for="(option, idx) in question.options"
            :key="idx"
            class="d-flex align-items-center mb-2"
          >
            <input
              type="text"
              v-model="question.options[idx]"
              class="form-control me-2"
              placeholder="Option"
              required
            />
            <button
              @click="removeOption(index, idx)"
              type="button"
              class="btn btn-danger btn-sm"
            >
              X
            </button>
          </div>
          <button
            @click="addOption(index)"
            type="button"
            class="btn btn-secondary btn-sm"
          >
            Add Option
          </button>
        </div>

        <!-- Correct Answer -->
        <div class="mb-3">
          <label class="form-label">Correct Answer</label>
          <input
            v-if="question.type !== 'multiple-choice'"
            type="text"
            v-model="question.correctAnswer"
            class="form-control"
            placeholder="Enter the correct answer"
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
            placeholder="Enter the points for this question"
            required
          />
        </div>

        <!-- Button Alignment for Options and Remove Question -->
        <div class="d-flex justify-content-between mt-3">
          <button
            @click="removeQuestion(index)"
            type="button"
            class="btn btn-danger btn-sm"
          >
            Remove Question
          </button>
        </div>
      </div>

      <!-- Buttons Alignment: Add New Question Left, Submit Right -->
      <div class="d-flex justify-content-between mt-4">
        <button @click="addQuestion" type="button" class="btn btn-secondary">
          Add New Question
        </button>
        <button type="submit" class="btn btn-primary">Create Exam</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'TeacherAddExams',
  data() {
    return {
      examTitle: '',
      selectedQuarter: '1st Quarter',
      startDateTime: '',
      endDateTime: '',
      questions: [],
      examDetails : {},
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
  
        await axios.post(`http://localhost:8000/api/addQuestionsToExam/${this.examId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        Swal.fire('Success', 'Exam created successfully!', 'success').then(() => {
          // this.$router.push(`/teachercreateexam/${this.$route.params.class_id}`);
        });
      } catch (error) {
        console.error('Failed to create exam:', error.message);
      }
    },
    async fetchExamDetails() {
      try {
        const examId = this.$route.params.exam_id; // Get the exam ID from the route parameter
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/getExam/${examId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.examDetails = {
          title: response.data.exam.title,
          quarter: response.data.exam.quarter,
          start: response.data.exam.start,
          end: response.data.exam.end,
        }; // Assign response data to corresponding properties
      } catch (error) {
        console.error('Error fetching exam details:', error);
      }
    },
  },
  created() {
    this.fetchExamDetails();
  },
};
</script>

<style scoped>
/* Exam Page Styling */
.exam-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Exam Title */
.exam-page h2 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
  color: #343a40;
}

/* Form Labels */
.form-label {
  font-weight: 500;
  color: #495057;
}

/* Question Card Styling */
.question-card {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.question-card h5 {
  font-weight: 500;
  color: #343a40;
}

/* Buttons */
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-sm {
  font-size: 0.875rem;
}

.btn-secondary.btn-sm {
  background-color: #6c757d;
  border-color: #6c757d;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .exam-page {
    padding: 15px;
  }

  .question-card {
    padding: 10px;
  }
}
</style>
