<template>
  <div>
    <!-- Main Container for Subject Info and Navigation -->
    <div class="main-container">
      <!-- Subject Information Display on the Left -->
      <div class="subject-info-container">
        <div v-if="subject.subjectName" class="subject-info">
          <h2>{{ subject.subjectName }}</h2>
          <p>{{ subject.semester }} | {{ subject.schoolYear }}</p>
        </div>
      </div>

      <!-- Unified Navigation Bar -->
      <nav class="nav nav-pills">
        <router-link to="/teacheraddsubject" class="nav-link">
          <span><i class="bi bi-arrow-left fs-4"></i></span>
        </router-link>
        <router-link :to="`/subject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
        <router-link :to="`/AddExam/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
        <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
        <router-link :to="`/ItemAnalysis/${$route.params.class_id}`" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link>
        <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
        <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
        <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
        <router-link :to="`/displayExam/${$route.params.exam_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      </nav>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Exam Creation Form -->
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
      <div class="mb-3 d-flex">
        <div class="me-3 flex-grow-1">
          <label for="start-date" class="form-label">Start Date & Time</label>
          <input
            type="datetime-local"
            id="start-date"
            v-model="startDateTime"
            class="form-control"
            required
          />
        </div>
        <div class="flex-grow-1">
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
      <div v-for="(question, index) in questions" :key="index" class="mb-3">
        <h5>Question {{ index + 1 }}</h5>
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
          <div v-for="(option, idx) in question.options" :key="idx" class="d-flex mb-2">
            <input
              type="text"
              v-model="question.options[idx]"
              class="form-control me-2"
              placeholder="Option"
              required
            />
            <button @click="removeOption(index, idx)" class="btn btn-danger">X</button>
          </div>
          <button @click="addOption(index)" class="btn btn-secondary">Add Option</button>
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

        <!-- Remove Question -->
        <button @click="removeQuestion(index)" class="btn btn-danger">Remove Question</button>
      </div>

      <!-- Add New Question Button -->
      <button @click="addQuestion" class="btn btn-secondary">Add New Question</button>

      <!-- Submit Button -->
      <button type="submit" class="btn btn-primary mt-4">Create Exam</button>
    </form>

    <!-- Modal for Success Message -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Exam Created Successfully</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Your exam has been created successfully!
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="redirectToExams">View Exams</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

export default {
  data() {
    return {
      examTitle: '',
      selectedQuarter: '1st Quarter',
      startDateTime: '',
      endDateTime: '',
      questions: [],
      error: '',
      subject: {}, // Subject data
    };
  },
  created() {
    this.fetchSubjectInfo();
  },
  methods: {
    async fetchSubjectInfo() {
      try {
        const classId = this.$route.params.class_id;
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = 'Authorization token is missing. Please log in again.';
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/class/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
      } catch (error) {
        this.error = error.response ? error.response.data.message : 'Failed to fetch subject data. Please try again later.';
      }
    },
    addQuestion() {
      const newQuestion = {
        type: 'multiple-choice', // Default type is multiple-choice
        question: '',
        correctAnswer: '',
        points: 1,
      };

      // Initialize options only if the question type is multiple-choice
      if (newQuestion.type === 'multiple-choice') {
        newQuestion.options = ['', '', '', '']; // Default options for multiple-choice
      }

      // Push the new question to the questions array
      this.questions.push(newQuestion);
    },
    changeQuestionType(index, type) {
      // Change the type of the question
      this.questions[index].type = type;

      // Reset question data based on type
      if (type === 'multiple-choice') {
        this.questions[index].options = ['', '', '', '']; // Initialize with 4 empty options
        this.questions[index].correctAnswer = ''; // Reset correct answer
      } else {
        delete this.questions[index].options; // Remove options for non-multiple-choice types
        this.questions[index].correctAnswer = ''; // Reset correct answer
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
      return `${date} ${time}:00`; // Adds ":00" for seconds
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
              choices = ['True', 'False'];  // Predefined choices for true/false questions
            }

            return {
              question_type: q.type,
              question: q.question,
              choices: choices,  // Include choices only for relevant types
              correct_answers: [
                {
                  choice_id: null,
                  correct_answer: q.correctAnswer,
                  points: q.points,
                },
              ],
            };
          }),
        };

        console.log('Payload:', payload);  // Log payload to check for issues

        await axios.post('http://localhost:8000/api/addExam', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Show success modal
        const modalElement = document.getElementById('successModal');
        const successModal = new Modal(modalElement);
        successModal.show();

      } catch (error) {
        if (error.response && error.response.data) {
          console.error('Server Error:', error.response.data);  // Check server error details
        }
        this.error = 'Failed to create exam. Please try again.';
        console.error(error);
      }
    },
    redirectToExams() {
      this.$router.push(`/DisplayExams/${this.$route.params.class_id}`);
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
  background-color: #f8f9fa94;
  border: 1px solid #0b355e;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 20px auto;
}
</style>
