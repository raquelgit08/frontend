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
      </nav>
    </div>

    <!-- Add Exam Button -->
    <button @click="openExamModal" class="btn btn-primary mb-3">Add Exam</button>

    <!-- Modal for Exam Creation -->
    <div class="modal fade" id="examModal" tabindex="-1" aria-labelledby="examModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="examModalLabel">Create Exam</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
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
        </div>
      </div>
    </div>

    <!-- Display Exam Card After Creation -->
    <div v-if="examDetails" class="card mt-4">
      <div class="card-header">
        <h4>{{ examDetails.title }}</h4>
      </div>
      <div class="card-body">
        <p><strong>Quarter:</strong> {{ examDetails.quarter }}</p>
        <p><strong>Start:</strong> {{ examDetails.start }}</p>
        <p><strong>End:</strong> {{ examDetails.end }}</p>
        <p><strong>Total Questions:</strong> {{ examDetails.total_questions }}</p>
        <p><strong>Total Points:</strong> {{ examDetails.total_points }}</p>

        <!-- View Exam Button -->
        <button @click="goToViewExam" class="btn btn-primary">View Exam</button>

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
      subject: {},
      examId: null,
      examDetails: null,
    };
  },
  created() {
    this.fetchSubjectInfo();
    this.loadExamFromLocalStorage(); // Load exam data from local storage on component creation
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
            Authorization: `Bearer ${token}`,
          },
        });

        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
      } catch (error) {
        this.error = error.response ? error.response.data.message : 'Failed to fetch subject data. Please try again later.';
      }
    },
    openExamModal() {
      const modalElement = document.getElementById('examModal');
      const examModal = new Modal(modalElement);
      examModal.show();
    },
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
    saveExamToLocalStorage() {
      const examData = {
        examId: this.examId,
        examDetails: this.examDetails,
      };
      localStorage.setItem('examData', JSON.stringify(examData));
    },
    loadExamFromLocalStorage() {
      const examData = localStorage.getItem('examData');
      if (examData) {
        const parsedData = JSON.parse(examData);
        this.examId = parsedData.examId;
        this.examDetails = parsedData.examDetails;
      }
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

        const response = await axios.post('http://localhost:8000/api/addExam2', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.examId = response.data.exam.id;
        this.examDetails = {
          ...response.data.exam,
          total_points: response.data.total_points,
          total_questions: response.data.total_questions,
        };

        this.saveExamToLocalStorage(); // Save exam data to local storage

        const modalElement = document.getElementById('examModal');
        const examModal = Modal.getInstance(modalElement);
        examModal.hide();
      } catch (error) {
        if (error.response && error.response.data) {
          console.error('Server Error:', error.response.data);
        }
        this.error = 'Failed to create exam. Please try again.';
      }
    },
    async publishExam() {
      try {
        await axios.post(`http://localhost:8000/api/publishExam/${this.examId}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Exam published successfully!');
      } catch (error) {
        console.error('Failed to publish exam:', error);
        this.error = 'Failed to publish exam. Please try again.';
      }
    },
    methods: {
      goToViewExam() {
    this.$router.push({
      name: 'ViewExam',
      params: {
        class_id: this.$route.params.class_id,
        exam_id: this.examId,
      },
    });
  },
}

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
.btn-primary, .btn-secondary, .btn-danger {
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

.btn-sm {
  font-size: 0.85rem;
  padding: 5px 10px;
}

.btn-danger.btn-sm {
  padding: 4px 8px;
  font-size: 0.8rem;
}
</style>
