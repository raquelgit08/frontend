<template>
  <div>
    <!-- Subject Information and Navigation Bar at the Top -->
    <div class="main-container">
      <!-- Unified Navigation Bar -->
      <nav class="nav nav-pills">
        <router-link to="/teachercreateexam" class="nav-link">
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
          <i class="bi bi-person-lines fs-4"></i> Students
        </router-link>
        <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link">
          <i class="bi bi-hourglass-split fs-4"></i> Pending
        </router-link>
      </nav>
    </div>

    <!-- Exam Creation and Management Section -->
    <div class="manage-exam-container">
      <h2 class="page-title">Exam Management</h2>

      <div class="top-section d-flex justify-content-between align-items-center mb-4">
        <div class="button-group">
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
              <!-- Check if instruction and instruction.instructions exist -->
              <div v-if="instruction && instruction.instructions">
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

                  <!-- Save to Test Bank Button -->
                  <button @click="confirmSaveToTestBank(question)" class="btn btn-info btn-sm me-2">
                    <i class="bi bi-cloud-upload fs-5"></i> Save to Test Bank
                  </button>

                  <!-- Edit Button triggers modal -->
                  <button @click="editQuestion(iIndex, qIndex, question, instruction)" class="btn btn-warning btn-sm me-2">
                    <i class="bi bi-pencil-square fs-5"></i> Edit
                  </button>

                  <!-- Delete Question Button -->
                  <button @click="deleteQuestion(question.id)" class="btn btn-danger btn-sm">
                    <i class="bi bi-trash fs-5"></i> Delete
                  </button>
                </div>
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

            <button @click="createNewInstruction" class="btn btn-outline-secondary mt-2">Change Question Type and Create New Instruction</button>
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
              <button @click="addChoice(question)" class="btn btn-outline-secondary btn-sm">Add Choice</button>
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
            <button @click="addNewQuestionForm" class="btn btn-outline-secondary mt-4">Add New Question</button>
            <button @click="saveAllQuestions" class="btn btn-outline-primary mt-4">Save All</button>
          </div>
        </div>
      </div>
    </div>

    <b-modal v-model="showEditModal" title="Edit Question" @ok="saveEditedQuestion">
    <div v-if="modalQuestion">
      <!-- Show instruction in the modal -->
      <div class="mb-3">
        <label class="form-label">Instruction</label>
        <input type="text" v-model="modalInstruction" class="form-control" readonly />
      </div>

      <!-- Show question type in the modal -->
      <div class="mb-3">
        <label class="form-label">Question Type</label>
        <input type="text" v-model="modalQuestionType" class="form-control" readonly />
      </div>

      <!-- Question text -->
      <div class="mb-3">
        <label class="form-label">Question</label>
        <input type="text" v-model="modalQuestion.text" class="form-control" required />
      </div>

      <!-- Conditional rendering based on question type -->
      <div v-if="modalQuestionType === 'multiple-choice'" class="mb-3">
        <label class="form-label">Choices</label>
        <div v-for="(choice, idx) in modalQuestion.choices" :key="idx" class="input-group mb-2">
          <input type="text" v-model="modalQuestion.choices[idx]" class="form-control" placeholder="Choice" />
        </div>
        <button @click="addChoice(modalQuestion)" class="btn btn-outline-secondary btn-sm">Add Choice</button>
      </div>

      <!-- True/False Answer -->
      <div v-if="modalQuestionType === 'true-false'" class="mb-3">
        <label class="form-label">True/False Answer</label>
        <select v-model="modalQuestion.correctAnswer" class="form-control">
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
      </div>

      <!-- Identification Answer -->
      <div v-if="modalQuestionType === 'identification'" class="mb-3">
        <label class="form-label">Correct Answer</label>
        <input type="text" v-model="modalQuestion.correctAnswer" class="form-control" placeholder="Enter the correct answer" />
      </div>

      <!-- Points -->
      <div class="mb-3">
        <label class="form-label">Points</label>
        <input type="number" v-model="modalQuestion.points" class="form-control" min="1" required />
      </div>
    </div>
  </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'AddexaminationsofSHS',
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
      showEditModal: false,
      modalQuestion: null,
      modalInstruction: '',
      modalQuestionType: 'multiple-choice',
      editingInstructionIndex: null,
      editingQuestionIndex: null
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
        this.existingQuestions = response.data.instructions || [];
      } catch (error) {
        console.error('Failed to fetch questions:', error.message);
      }
    },
    editQuestion(iIndex, qIndex, question, instruction) {
      // Assign the index of the question and instruction for later use
      this.editingInstructionIndex = iIndex;
      this.editingQuestionIndex = qIndex;

      // Prepare the question data for the modal
      this.modalQuestion = {
        text: question.question || '',
        correctAnswer: question.correct_answers[0]?.correct_answer || '',
        points: question.correct_answers[0]?.points || 1,
        choices: question.choices || (instruction.question_type === 'multiple-choice' ? ['', '', ''] : []),
      };

      // Set the instruction and question type to display in the modal
      this.modalInstruction = instruction.instructions.instruction || '';
      this.modalQuestionType = instruction.question_type || 'multiple-choice';

      // Show the edit modal
      this.showEditModal = true;
    },
    async saveEditedQuestion() {
      try {
        // Retrieve the question from modal data
        const question = this.modalQuestion;
        const updatedQuestions = this.existingQuestions[this.editingInstructionIndex].instructions.questions;

        // Update the existing question with the edited data
        updatedQuestions[this.editingQuestionIndex] = {
          ...updatedQuestions[this.editingQuestionIndex],
          question: question.text,
          correct_answers: [
            {
              correct_answer: question.correctAnswer,
              points: question.points,
            },
          ],
          choices: this.modalQuestionType === 'multiple-choice' ? question.choices : [],
        };

        // Prepare the payload for the backend
        const payload = {
          instructions: this.existingQuestions.map(inst => ({
            id: inst.id,
            instruction: inst.instructions.instruction,
            question_type: inst.question_type,
          })),
          questions: updatedQuestions,
        };

        // Save the edited question to the backend
        await axios.put(
          `http://localhost:8000/api/updateQuestionsInExam/${this.examId}`,
          payload,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        // Refresh the questions and close the modal
        await this.fetchQuestions();
        this.showEditModal = false;
        Swal.fire('Success', 'Question updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating question:', error.message);
        Swal.fire('Error', 'Failed to update question.', 'error');
      }
    },
  
    async deleteQuestion(questionId) {
      try {
        await axios.delete(`http://localhost:8000/api/deleteMultipleQuestions/${questionId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.fetchQuestions();
        Swal.fire('Success', 'Question deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting question:', error.message);
        Swal.fire('Error', 'Failed to delete question.', 'error');
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
        Swal.fire('Success', 'All questions saved successfully!', 'success');
      } catch (error) {
        console.error('Failed to save questions:', error.message);
        Swal.fire('Error', 'Failed to save questions. Please try again.', 'error');
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

.main-container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-bottom: 20px;
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

.btn-sm {
  margin-right: 10px;
}
</style>
