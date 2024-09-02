<template>
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
      <router-link to="/AddExam" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <router-link to="/Feedback" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
      <router-link to="/ItemAnalysis" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link>
      <router-link to="/PerformanceTracking" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
      <router-link to="/studentslist" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      <router-link to="/pendingstudentslist" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
    </nav>
  </div>

  <!-- Subject Page Content -->
  <div class="subject-page container-fluid mt-5">
    <!-- Error Handling -->
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- Exam Management Content -->
    <button class="add-quiz-btn" @click="showForm = !showForm">Add Quiz or Exam</button>

    <div class="row mt-4">
      <!-- Column for the Exam Form -->
      <div class="col-md-3 col-sm-12">
        <div v-if="showForm" class="form-container p-4 shadow rounded">
          <center><h3>Exam Schedule</h3></center>
          <div class="modal-header mb-3 d-flex justify-content-between align-items-center">
            <div class="quarter-filter w-100">
              <label for="quarter" class="form-label">Quarter:</label>
              <select id="quarter" v-model="selectedQuarter" class="form-select">
                <option value="1st Quarter">1st Quarter</option>
                <option value="2nd Quarter">2nd Quarter</option>
                <option value="3rd Quarter">3rd Quarter</option>
                <option value="4th Quarter">4th Quarter</option>
              </select>
            </div>
          </div>
          <div class="form-body">
            <div class="date-time-group d-flex justify-content-between mb-3">
              <div class="form-group me-2 flex-grow-1">
                <label for="date" class="form-label">Date:</label>
                <input type="date" id="date" v-model="selectedDate" class="form-control" />
              </div>
              <div class="form-group ms-2 flex-grow-1">
                <label for="time" class="form-label">Time:</label>
                <input type="time" id="time" v-model="selectedTime" class="form-control" />
              </div>
            </div>
            <div class="centered-button text-center">
              <button class="create-exam-btn btn btn-primary btn-lg" @click="redirectToExamCreation">Create Exam</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-9 col-sm-12">
        <div v-if="showForm" class="container-fluid p-4 shadow rounded bg-light">
          <h3 class="text-center mb-4">Exam Creation</h3>

          <!-- Section for displaying added questions -->
          <div class="mb-4">
            <div class="form-group">
              <label for="title" class="form-label">Exam Title</label>
              <input type="text" class="form-control" id="title" v-model="examTitle" />
            </div>

            <div class="added-questions">
              <h4 class="mb-3">Added Questions</h4>
              <div v-for="(item, index) in questions" :key="index" class="mb-3 p-3 border rounded bg-white shadow-sm position-relative">
                <!-- Numbering -->
                <span class="badge bg-primary position-absolute top-0 start-0 mt-2 ms-2">{{ index + 1 }}</span>

                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h5 class="mb-0">{{ item.type.charAt(0).toUpperCase() + item.type.slice(1) }} Question</h5>
                  <div>
                    <button @click="duplicateItem(index)" class="btn btn-outline-primary btn-sm me-2">
                      <i class="fas fa-copy"></i> Duplicate
                    </button>
                    <button @click="deleteItem(index)" class="btn btn-outline-danger btn-sm">
                      <i class="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </div>

                <div class="mb-2">
                  <label for="question" class="form-label">Question</label>
                  <input type="text" id="question" v-model="item.question" :disabled="item.disabled" class="form-control" />
                </div>

                <div v-if="item.type === 'multiple-choice'">
                  <div class="mb-2">
                    <label class="form-label">Options</label>
                    <div class="row">
                      <div v-for="(option, idx) in item.options" :key="idx" class="col-md-6 mb-2">
                        <label :for="'option' + idx" class="form-label">Option {{ String.fromCharCode(65 + idx) }}</label>
                        <input type="text" :id="'option' + idx" v-model="item.options[idx]" :disabled="item.disabled" class="form-control" />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="item.type === 'true-false'">
                  <div class="mb-2">
                    <label for="correct-answer" class="form-label">Correct Answer</label>
                    <select id="correct-answer" v-model="item.correctAnswer" :disabled="item.disabled" class="form-select">
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                </div>

                <div v-if="item.type === 'identification'">
                  <div class="mb-2">
                    <label for="correct-answer" class="form-label">Correct Answer</label>
                    <input type="text" id="correct-answer" v-model="item.correctAnswer" :disabled="item.disabled" class="form-control" />
                  </div>
                </div>

                <div class="mb-2">
                  <label for="points" class="form-label">Points</label>
                  <input type="number" id="points" v-model="item.points" :disabled="item.disabled" class="form-control" />
                </div>
              </div>
            </div>

            <!-- Section for creating new questions -->
            <div>
              <h4 class="mb-3">Create New Question</h4>
              <div class="mb-3">
                <label for="question-type" class="form-label">Select Question Type</label>
                <select id="question-type" v-model="selectedQuestionType" class="form-select">
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True or False</option>
                  <option value="identification">Identification</option>
                </select>
              </div>

              <!-- Multiple Choice Question Form -->
              <div v-if="selectedQuestionType === 'multiple-choice'">
                <div v-for="(item, index) in newMultipleChoiceQuestions" :key="index" class="question-form mb-3">
                  <div class="mb-2">
                    <label for="question" class="form-label">Question</label>
                    <input type="text" v-model="item.question" class="form-control" />
                  </div>

                  <div class="mb-2">
                    <label class="form-label">Options</label>
                    <div class="row">
                      <div v-for="(option, idx) in item.options" :key="idx" class="col-md-6 mb-2">
                        <label :for="'option' + idx" class="form-label">Option {{ String.fromCharCode(65 + idx) }}</label>
                        <input type="text" v-model="item.options[idx]" class="form-control" />
                      </div>
                    </div>
                  </div>

                  <div class="mb-2">
                    <label for="correct-answer" class="form-label">Correct Answer</label>
                    <select v-model="item.correctAnswer" class="form-select">
                      <option v-for="(option, idx) in item.options" :value="idx" :key="idx">
                        {{ String.fromCharCode(65 + idx) }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-2">
                    <label for="points" class="form-label">Points</label>
                    <input type="number" v-model="item.points" class="form-control" />
                  </div>

                  <button @click="addNewQuestion" class="btn btn-success">Add Question</button>
                </div>
              </div>

              <!-- True or False Question Form -->
              <div v-if="selectedQuestionType === 'true-false'">
                <div class="mb-3">
                  <label for="question" class="form-label">Question</label>
                  <input type="text" v-model="trueFalseQuestion.question" class="form-control" />
                </div>

                <div class="mb-3">
                  <label for="correct-answer" class="form-label">Correct Answer</label>
                  <select v-model="trueFalseQuestion.correctAnswer" class="form-select">
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="points" class="form-label">Points</label>
                  <input type="number" v-model="trueFalseQuestion.points" class="form-control" />
                </div>

                <button @click="addTrueFalseQuestion" class="btn btn-success">Add Question</button>
              </div>

              <!-- Identification Question Form -->
              <div v-if="selectedQuestionType === 'identification'">
                <div class="mb-3">
                  <label for="question" class="form-label">Question</label>
                  <input type="text" v-model="identificationQuestion.question" class="form-control" />
                </div>

                <div class="mb-3">
                  <label for="correct-answer" class="form-label">Correct Answer</label>
                  <input type="text" v-model="identificationQuestion.correctAnswer" class="form-control" />
                </div>

                <div class="mb-3">
                  <label for="points" class="form-label">Points</label>
                  <input type="number" v-model="identificationQuestion.points" class="form-control" />
                </div>

                <button @click="addIdentificationQuestion" class="btn btn-success">Add Question</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SubjectPages',
  data() {
    return {
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      selectedQuarter: '1st Quarter',
      selectedDate: '',
      selectedTime: '',
      showForm: false,
      error: '',
      examTitle: '',
      questions: [],
      selectedQuestionType: '',
      newMultipleChoiceQuestions: [{ question: '', options: ['', '', '', ''], correctAnswer: '', points: 0 }],
      trueFalseQuestion: { question: '', correctAnswer: 'true', points: 0 },
      identificationQuestion: { question: '', correctAnswer: '', points: 0 }
    };
  },
  created() {
    this.fetchSubject();
  },
  methods: {
    async fetchSubject() {
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
      this.error = 'Class not found. Please check the class ID.';
      return;
    }

    this.subject.subjectName = response.data.class.subject.subjectname;
    this.subject.semester = response.data.class.semester;
    this.subject.schoolYear = response.data.class.year.addyear;
    
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        this.error = 'Class not found. Please check the class ID.';
      } else if (error.response.status === 403) {
        this.error = 'You are not authorized to view this class. Please contact your administrator.';
      } else if (error.response.status === 401) {
        this.error = 'Session expired. Please log in again.';
      } else {
        this.error = error.response.data.message || 'Failed to fetch subject data. Please try again later.';
      }
    } else {
      this.error = 'Network error: Failed to fetch subject data. Please check your connection.';
    }
  }
},
    toggleForm() {
      this.showForm = !this.showForm;
    },
    getCurrentDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },
    getCurrentTime() {
      const today = new Date();
      const hh = String(today.getHours()).padStart(2, '0');
      const mm = String(today.getMinutes()).padStart(2, '0');
      const ss = String(today.getSeconds()).padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    },
    redirectToExamCreation() {
      // this.$router.push({ path: '/AddExam' });
    },
    addNewQuestion() {
      this.questions.push({
        type: 'multiple-choice',
        question: this.newMultipleChoiceQuestions[0].question,
        options: [...this.newMultipleChoiceQuestions[0].options],
        correctAnswer: this.newMultipleChoiceQuestions[0].correctAnswer,
        points: this.newMultipleChoiceQuestions[0].points
      });
      // Reset form
      this.newMultipleChoiceQuestions = [{ question: '', options: ['', '', '', ''], correctAnswer: '', points: 0 }];
    },
    addTrueFalseQuestion() {
      this.questions.push({
        type: 'true-false',
        question: this.trueFalseQuestion.question,
        correctAnswer: this.trueFalseQuestion.correctAnswer,
        points: this.trueFalseQuestion.points
      });
      // Reset form
      this.trueFalseQuestion = { question: '', correctAnswer: 'true', points: 0 };
    },
    addIdentificationQuestion() {
      this.questions.push({
        type: 'identification',
        question: this.identificationQuestion.question,
        correctAnswer: this.identificationQuestion.correctAnswer,
        points: this.identificationQuestion.points
      });
      // Reset form
      this.identificationQuestion = { question: '', correctAnswer: '', points: 0 };
    },
    duplicateItem(index) {
      const item = this.questions[index];
      this.questions.splice(index + 1, 0, { ...item });
    },
    deleteItem(index) {
      this.questions.splice(index, 1);
    },
    // submitForm() {
    //   // Send the form data to the backend
    //   axios.post('/api/exams', this.exam)
    //     .then(response => {
    //       alert('Exam created successfully');
    //       this.resetForm();
    //     })
    //     .catch(error => {
    //       console.error('Error creating exam:', error);
    //       alert('Failed to create exam');
    //     });
    // },
  
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
.question-form{
  font-size: 20px;
 
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

/* Subject Page Content */
.subject-page {
  margin-top: 40px;
}

.subject-page h5 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #343a40;
  letter-spacing: 1px;
  margin-bottom: 40px;
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

.exam-page h1 {
  font-family: 'Lucida Sans Unicode', sans-serif;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  background-color: #8fd6a4;
  color: rgb(6, 0, 0);
  padding: 10px;
  border-radius: 8px 8px 0 0;
}

.nothing-follows {
  font-family: 'Lucida Sans Unicode', sans-serif;
  font-size: 16px;
  color: #555;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); /* Dark transparent background */
  z-index: 1050; /* High z-index to appear above other elements */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem; /* Padding for smaller screens */
}

.modal-content {
  background: #fff; /* White background for the modal */
  width: 95%; /* Expanded width to nearly full screen */
  height: 80vh; /* Height set to 80% of viewport */
  border-radius: 12px; /* Rounded corners for a softer look */
  position: relative;
  padding: 2rem; /* Additional padding for spacious feel */
  overflow-y: auto; /* Enable scrolling if content overflows */
}

.create-exam-btn {
  background: linear-gradient(45deg, #4CAF50, #81C784); /* Example gradient */
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  transition: background 0.3s ease;
}

.create-exam-btn:hover {
  background: linear-gradient(45deg, #388E3C, #66BB6A); /* Darker on hover */
}


.form-select, .form-control {
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}

.close-btn:hover {
  color: #ff4d4d; /* Hover color for the close icon */
}
</style>
