<template>
  <div>
    <h2>Manage Exam Questions</h2>

    <!-- Display Existing Questions -->
    <div v-if="existingQuestions.length > 0" class="existing-questions mt-4">
      <h4>Existing Questions</h4>
      <div v-for="(question, index) in existingQuestions" :key="index" class="question-card mb-4">
        <h5 class="question-title">Question {{ index + 1 }}: {{ question.question }}</h5>
        <p><strong>Type:</strong> {{ question.question_type }}</p>
        <p v-if="question.question_type === 'multiple-choice'"><strong>Options:</strong></p>
        <ul v-if="question.question_type === 'multiple-choice'">
          <li v-for="(option, idx) in question.choices" :key="idx">{{ option }}</li>
        </ul>
        <p><strong>Correct Answer:</strong> {{ question.correct_answers[0].correct_answer }}</p>
        <p><strong>Points:</strong> {{ question.correct_answers[0].points }}</p>

        <!-- Edit and Delete Buttons for Each Question -->
        <button @click="editQuestion(index)" class="btn btn-warning btn-sm me-2">Edit</button>
        <button @click="deleteQuestion(question.id)" class="btn btn-danger btn-sm">Delete</button>
      </div>
    </div>

    <!-- Add New Question Section -->
    <div v-if="isAddingOrEditing">
      <h4 v-if="editIndex !== null">Edit Question</h4>
      <h4 v-else>Add New Question</h4>

      <!-- Instruction Field -->
      <div class="mb-3">
        <label for="instruction" class="form-label">Exam Instruction</label>
        <textarea
          id="instruction"
          v-model="examInstruction"
          class="form-control"
          required
        ></textarea>
      </div>

      <!-- Questions Section -->
      <div v-for="(question, index) in questions" :key="index" class="question-card mb-4">
        <h5 class="question-title">Question {{ index + 1 }}</h5>

        <!-- Question Type -->
        <div class="mb-3">
          <label class="form-label">Question Type</label>
          <select v-model="question.type" class="form-select">
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True or False</option>
            <option value="identification">Identification</option>
          </select>
        </div>

        <!-- Question Text -->
        <div class="mb-3">
          <label class="form-label">Question</label>
          <input
            type="text"
            v-model="question.text"
            class="form-control"
            required
          />
        </div>

        <!-- Options for Multiple Choice Questions -->
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
      </div>

      <!-- Add/Edit Buttons -->
      <div class="d-flex justify-content-between mt-4">
        <button v-if="editIndex === null" @click="addQuestion" type="button" class="btn btn-secondary">Add New Question</button>
        <button v-if="editIndex !== null" @click="updateQuestion" type="button" class="btn btn-warning">Update Question</button>
        <button @click="submitExam" type="button" class="btn btn-primary">Submit</button>
      </div>
    </div>

    <!-- Publish Exam Button -->
    <button v-if="existingQuestions.length > 0" @click="publishExam" type="button" class="btn btn-success mt-4">Publish Exam</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddexaminationsofSHS',
  data() {
    return {
      examInstruction: '', // Instruction for the exam
      questions: [], // Array of questions (for adding/editing)
      existingQuestions: [], // Store existing questions
      examId: null, // This will hold the exam ID from the route
      editIndex: null, // Index of the question being edited
      isAddingOrEditing: false, // Flag to toggle between viewing and adding/editing questions
    };
  },
  created() {
    // Get the examId from the route parameters
    this.examId = this.$route.params.examId;
    this.fetchQuestions(); // Fetch existing questions
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await axios.get(`http://localhost:8000/api/getExamQuestions/${this.examId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.existingQuestions = response.data.questions; // Load existing questions
        this.examInstruction = response.data.instruction; // Set the instruction if available
      } catch (error) {
        console.error('Failed to fetch questions:', error.response ? error.response.data : error.message);
      }
    },

    addQuestion() {
      const newQuestion = {
        type: 'multiple-choice', // Default type
        text: '',
        correctAnswer: '',
        points: 1,
        options: ['', '', '', ''], // 4 options by default for multiple-choice
      };
      this.questions.push(newQuestion);
      this.isAddingOrEditing = true;
    },

    editQuestion(index) {
      this.questions = [this.existingQuestions[index]]; // Load the question to edit
      this.editIndex = index;
      this.isAddingOrEditing = true;
    },

    updateQuestion() {
      this.existingQuestions.splice(this.editIndex, 1, this.questions[0]); // Update the question
      this.questions = [];
      this.isAddingOrEditing = false;
      this.editIndex = null;
    },

    removeOption(questionIndex, optionIndex) {
      this.questions[questionIndex].options.splice(optionIndex, 1);
    },

    addOption(questionIndex) {
      this.questions[questionIndex].options.push('');
    },

    async deleteQuestion(questionId) {
      try {
        await axios.delete(`http://localhost:8000/api/deleteQuestion/${questionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.existingQuestions = this.existingQuestions.filter(q => q.id !== questionId);
        alert('Question deleted successfully');
      } catch (error) {
        console.error('Failed to delete question:', error.response ? error.response.data : error.message);
      }
    },

    async submitExam() {
      try {
        const payload = {
          instruction: this.examInstruction,
          questions: this.questions.map((q) => ({
            question_type: q.type,
            question: q.text,
            choices: q.type === 'multiple-choice' ? q.options : null,
            correct_answers: [{
              correct_answer: q.correctAnswer,
              points: q.points,
            }],
          })),
        };

        await axios.post(`http://localhost:8000/api/addQuestionsToExam/${this.examId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        alert('Questions added successfully');
        this.fetchQuestions(); // Refresh the questions after adding
        this.isAddingOrEditing = false;
        this.questions = [];
      } catch (error) {
        console.error('Failed to add questions:', error.response ? error.response.data : error.message);
      }
    },

    async publishExam() {
      try {
        await axios.post(`http://localhost:8000/api/publishExam/${this.examId}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Exam published successfully');
      } catch (error) {
        console.error('Failed to publish exam:', error.response ? error.response.data : error.message);
      }
    },
  },
};
</script>

<style scoped>
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
</style>
