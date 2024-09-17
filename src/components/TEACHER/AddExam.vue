<template>
  <div>
    <!-- Subject Information and Navigation Bar at the Top -->
    <div class="main-container">
     

      <!-- Unified Navigation Bar -->
      <nav class="nav nav-pills">
        <router-link to="/teacheraddsubject" class="nav-link">
          <span><i class="bi bi-arrow-left fs-4"></i></span>
        </router-link>
        <router-link :to="`/subject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
        <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link">
          <i class="bi bi-file-earmark-plus fs-4"></i> Exams
        </router-link>
        <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link">
          <i class="bi bi-chat-dots fs-4"></i> Feedback
        </router-link>
        <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link">
          <i class="bi bi-activity fs-4"></i> Performance Tracking
        </router-link>
        <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link">
          <i class="bi bi-person-lines-fill fs-4"></i> Students
        </router-link>
        <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link">
          <i class="bi bi-hourglass-split fs-4"></i> Pending
        </router-link>
      </nav>
    </div>

    <!-- Exam Creation and Management Section -->
    <div class="manage-exam-container">
      <h2 class="page-title">Exam Creation and Management</h2>

      <div class="top-section d-flex justify-content-between align-items-center mb-4">
        <div class="button-group">
          <button v-if="newQuestions.length > 0 && !isPublished" @click="publishExam" type="button" class="btn btn-success me-2">
            Publish Exam
          </button>

          <button @click="viewItemAnalysis(examId)" type="button" class="btn btn-primary">
            View Item Analysis
          </button>
        </div>
      </div>

      <div v-if="isPublished" class="alert alert-success">
        The exam has been successfully published.
      </div>

      <div class="main-content d-flex mt-4">
        <!-- Left Section: Created Questions -->
        <div class="left-section w-50 me-4">
          <h4>Created Questions</h4>
          <div v-if="existingQuestions.length > 0">
            <div v-for="(instruction, iIndex) in existingQuestions" :key="iIndex" class="instruction-card mb-4">
              <h4>Instruction: {{ instruction.instructions.instruction }}</h4>

              <div v-for="(question, qIndex) in instruction.instructions.questions" :key="qIndex" class="question-card mb-4">
                <h5>{{ qIndex + 1 }}. {{ question.question }}</h5>
                <p><strong>Correct Answer:</strong> {{ question.correct_answers[0]?.correct_answer }}</p>

                <div v-if="instruction.question_type === 'true-false'">
                  <ul>
                    <li>True</li>
                    <li>False</li>
                  </ul>
                </div>

                <ul v-else-if="question.choices && question.choices.length > 0">
                  <li v-for="(choice, cIndex) in question.choices" :key="cIndex">{{ choice.choices }}</li>
                </ul>

                <p><strong>Points:</strong> {{ question.correct_answers[0]?.points }}</p>

                <button @click="confirmSaveToTestBank(question)" class="btn btn-info btn-sm">Save to test bank</button>
                <button @click="editQuestion(qIndex)" class="btn btn-warning btn-sm">Edit</button>
                <button @click="deleteQuestion(question.id)" class="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
          </div>
          <div v-else>
            <p>No questions found.</p>
          </div>
        </div>

        <!-- Right Section: Add New Question Form -->
        <div class="right-section w-50">
          <h4>Add New Question</h4>

          <div class="instruction-card mb-4 p-3 border bg-light">
            <div class="mb-3">
              <label for="instruction" class="form-label">Exam Instruction</label>
              <textarea id="instruction" v-model="examInstruction" class="form-control" required></textarea>
            </div>

            <div class="mb-3">
              <label for="questionType" class="form-label">Question Type</label>
              <select id="questionType" v-model="globalQuestionType" class="form-control" required>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="identification">Identification</option>
              </select>
            </div>

            <button @click="createNewInstruction" class="btn btn-secondary mt-2">Change Question Type and Create New Instruction</button>
          </div>

          <div v-for="(question, index) in newQuestions" :key="index" class="question-card mb-4 p-3 border bg-light">
            <div class="mb-3">
              <label class="form-label">Question</label>
              <input type="text" v-model="question.text" class="form-control" required />
            </div>

            <div v-if="globalQuestionType === 'multiple-choice'" class="mb-3">
              <label class="form-label">Choices</label>
              <div v-for="(choice, idx) in question.choices" :key="idx" class="input-group mb-2">
                <input type="text" v-model="question.choices[idx]" class="form-control" placeholder="Choice" />
              </div>
              <button @click="addChoice(question)" class="btn btn-secondary btn-sm">Add Choice</button>
            </div>

            <div class="mb-3">
              <label class="form-label">Correct Answer</label>
              <input type="text" v-model="question.correctAnswer" class="form-control" required />
            </div>

            <div v-if="globalQuestionType === 'true-false'" class="mb-3">
              <label class="form-label">True/False Answer</label>
              <select v-model="question.correctAnswer" class="form-control">
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </div>

            <div v-if="globalQuestionType === 'identification'" class="mb-3">
              <label class="form-label">Correct Answer</label>
              <input type="text" v-model="question.correctAnswer" class="form-control" placeholder="Enter the correct answer" />
            </div>

            <div class="mb-3">
              <label class="form-label">Points</label>
              <input type="number" v-model="question.points" class="form-control" min="1" required />
            </div>
          </div>

          <div class="d-flex justify-content-between">
            <button @click="addNewQuestionForm" class="btn btn-secondary mt-4">Add New Question</button>
            <button @click="saveAllQuestions" class="btn btn-primary mt-4">Save All</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      examId: null,
      existingQuestions: [],
      newQuestions: [
        {
          text: '',
          correctAnswer: '',
          points: 1,
          choices: ['', '', ''],
        },
      ],
      globalQuestionType: 'multiple-choice',
      examInstruction: '',
      isPublished: false,
      
      
    };
  },
  created() {
    this.examId = this.$route.params.examId;
    this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/getExamInstructionAndCorrectAnswers/${this.examId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const instructions = response.data.instructions || [];
        this.existingQuestions = instructions;
        this.examInstruction = instructions.length > 0 ? instructions[0].instruction : '';
      } catch (error) {
        console.error('Failed to fetch questions:', error.message);
      }
    },
   
    addChoice(question) {
      question.choices.push('');
    },
    addNewQuestionForm() {
      this.newQuestions.push({
        text: '',
        correctAnswer: '',
        points: 1,
        choices: this.globalQuestionType === 'multiple-choice' ? ['', '', ''] : [],
      });
    },
    async saveAllQuestions() {
      try {
        const instructionsData = [
          {
            instruction: this.examInstruction,
            question_type: this.globalQuestionType,
            questions: this.newQuestions.map(question => ({
              question: question.text,
              choices: this.globalQuestionType === 'multiple-choice'
                ? question.choices.filter(choice => choice !== '')
                : [],
              correct_answers: [
                { correct_answer: question.correctAnswer, points: question.points },
              ],
            })),
          },
        ];

        await axios.post(
          `http://localhost:8000/api/addQuestionsToExam/${this.examId}`,
          { instructions: instructionsData },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        this.newQuestions = [
          { text: '', correctAnswer: '', points: 1, choices: ['', '', ''] },
        ];

        await this.fetchQuestions();
        alert('All questions saved successfully!');
      } catch (error) {
        console.error('Failed to save questions:', error.message);
        Swal.fire('Error', 'Failed to save questions. Please try again.', 'error');
      }
    },
    async publishExam() {
      axios
        .post(`http://localhost:8000/api/exams/publish2/${this.examId}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(() => {
          this.isPublished = true;
          Swal.fire('Success', 'Exam published successfully!', 'success');
        })
        .catch((error) => {
          console.error('Failed to publish exam:', error.message);
        });
    },
    confirmSaveToTestBank(question) {
      Swal.fire({
        title: 'Do you want to save this question to the test bank?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'No, cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const preparedQuestion = this.prepareQuestionForSelection(question);
          if (preparedQuestion) {
            await this.saveToTestBank(preparedQuestion);
          } else {
            Swal.fire('Error', 'Invalid question data, unable to save.', 'error');
          }
        }
      });
    },
    async saveToTestBank(questionData) {
      try {
        const payload = {
          schedule_id: this.examId,
          questions: [questionData],
        };

        await axios.post(
          `http://localhost:8000/api/storetestbank`,
          payload,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        Swal.fire('Success', 'Question saved to test bank successfully!', 'success');
      } catch (error) {
        console.error('Error saving to test bank:', error.response.data);
        Swal.fire('Error', error.response.data.message, 'error');
      }
    },
    viewItemAnalysis(examId) {
      this.$router.push(`/ItemAnalysis/${examId}`);
    }
  }
};
</script>

<style scoped>
.manage-exam-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-weight: bold;
  color: #0b355e;
  text-align: center;
  margin-bottom: 20px;
}

.left-section, .right-section {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.question-card {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

input.form-control, textarea.form-control {
  margin-bottom: 10px;
}

/* Subject and Navigation Styles */
.main-container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-bottom: 20px;
}

.subject-info-container {
  flex: 1;
  max-width: 300px;
  margin-right: 10px;
  margin-left: 10px;
  display: flex;
  align-items: center;
}

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

.nav {
  flex: 2;
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
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
</style>
