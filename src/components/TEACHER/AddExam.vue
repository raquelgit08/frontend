<template>
  <div class="manage-exam-container">
    <h2 class="page-title">Exam Creation and Management</h2>

    <div class="top-section d-flex justify-content-between align-items-center mb-4">
      <div class="button-group">
        <button v-if="existingQuestions.length > 0" @click="publishExam" type="button" class="btn btn-success me-2">
          Publish Exam
        </button>
        <button v-if="existingQuestions.length > 0" @click="saveToTestBank" type="button" class="btn btn-info me-2">
          Save to Test Bank
        </button>
        <button @click="viewExamSchedule" type="button" class="btn btn-primary">
          View Exam Schedule
        </button>
      </div>
    </div>

    <div class="main-content d-flex mt-4">
      <!-- Left Section: Created Questions -->
      <div class="left-section w-50 me-4">
        <h4>Created Questions</h4>
        <div v-if="existingQuestions.length > 0">
          <div class="instruction-card mb-4 p-3 border bg-light">
            <p><strong>Instruction:</strong> {{ examInstruction }}</p>
          </div>

          <!-- Display all existing questions -->
          <div v-for="(question, index) in existingQuestions" :key="index" class="question-card mb-4">
            <h5 class="question-title">{{ index + 1 }}. {{ question.question }}</h5>
            <p><strong>Correct Answer:</strong> {{ question.correct_answers[0]?.correct_answer }}</p>
            <p><strong>Points:</strong> {{ question.correct_answers[0]?.points }}</p>

            <ul v-if="question.choices && question.choices.length > 0">
              <li v-for="(choice, idx) in question.choices" :key="idx">{{ choice.choices }}</li>
            </ul>

            <button @click="editQuestion(index)" class="btn btn-warning btn-sm me-2">Edit</button>
            <button @click="deleteQuestion(question.question_id)" class="btn btn-danger btn-sm">Delete</button>
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

        <!-- Add Question form -->
        <div v-for="(question, index) in questions" :key="index" class="question-card mb-4 p-3 border bg-light">
          <div class="mb-3">
            <label class="form-label">Question</label>
            <input type="text" v-model="question.text" class="form-control" required />
          </div>

          <div v-if="globalQuestionType === 'multiple-choice'" class="mb-3">
            <label class="form-label">Choices</label>
            <div v-for="(choice, idx) in question.choices" :key="idx" class="input-group mb-2">
              <input type="text" v-model="question.choices[idx].choices" class="form-control" placeholder="Choice" />
            </div>
            <button @click="addChoice(question)" class="btn btn-secondary btn-sm">Add Choice</button>
          </div>

          <div class="mb-3">
            <label class="form-label">Correct Answer</label>
            <input type="text" v-model="question.correctAnswer" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Points</label>
            <input type="number" v-model="question.points" class="form-control" min="1" required />
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button @click="addNewQuestionForm" class="btn btn-secondary mt-4">Add New Question</button>
          <button @click="saveCreatedQuestions" class="btn btn-primary mt-4">Save Questions</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddExaminationsofSHS',
  data() {
    return {
      examInstruction: '',
      globalQuestionType: 'multiple-choice', // Default question type
      questions: [
        {
          text: '',  // Question text
          correctAnswer: '', // Correct answer
          points: 1,  // Points for the question
          choices: [{ choices: '' }, { choices: '' }, { choices: '' }], // Choices for multiple-choice questions
        },
      ],
      existingQuestions: [],
      examId: null, // Will be set when the component is created
    };
  },
  created() {
    this.examId = this.$route.params.examId;
    this.fetchQuestions();  // Fetch existing questions when the component is created
  },
  methods: {
    // Fetch questions from backend
    async fetchQuestions() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/getExamInstructionAndCorrectAnswers/${this.examId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        const { instructions } = response.data;
        this.existingQuestions = instructions.map(instruction => instruction.questions).flat();
        this.examInstruction = instructions.length > 0 ? instructions[0].instruction : '';
      } catch (error) {
        console.error('Failed to fetch questions:', error.message);
      }
    },

    // Add a new choice to the question
    addChoice(question) {
      question.choices.push({ choices: '' });  // Add an empty object with `choices` field
    },

    // Add a new question form
    addNewQuestionForm() {
      this.questions.push({
        text: '',
        correctAnswer: '',
        points: 1,
        choices: this.globalQuestionType === 'multiple-choice' ? [{ choices: '' }, { choices: '' }, { choices: '' }] : [],
      });
    },

    // Save all created questions to the backend
    async saveCreatedQuestions() {
      try {
        const questionsToSave = this.questions.map((question) => ({
          question: question.text,
          choices: this.globalQuestionType === 'multiple-choice' ? question.choices : [],
          correct_answers: [
            {
              correct_answer: question.correctAnswer,
              points: question.points,
            },
          ],
        }));

        const questionData = {
          instruction: this.examInstruction,
          question_type: this.globalQuestionType,
          questions: questionsToSave,  // Save all questions
        };

        // Send data to the backend for all new questions
        await axios.post(
          `http://localhost:8000/api/addQuestionsToExam/${this.examId}`,
          { instructions: [questionData] },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        // Add the created questions to existingQuestions array to display them
        this.existingQuestions.push(...questionsToSave);

        // Clear the form after saving
        this.questions = [
          {
            text: '',
            correctAnswer: '',
            points: 1,
            choices: this.globalQuestionType === 'multiple-choice' ? [{ choices: '' }, { choices: '' }, { choices: '' }] : [],
          },
        ];

        alert('Questions saved successfully!');
      } catch (error) {
        console.error('Error saving questions:', error.message);
      }
    },

    publishExam() {
      axios.post(
        `http://localhost:8000/api/exams/publish2/${this.examId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      ).then(() => {
        alert('Exam published successfully');
      }).catch((error) => {
        console.error('Failed to publish exam:', error.message);
      });
    },

    saveToTestBank() {
      alert('Questions saved to test bank!');
    },

    viewExamSchedule() {
      alert('Redirecting to exam schedule...');
    },
  },
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

.top-section {
  margin-bottom: 20px;
}

.correct-answer {
  color: green;
}

input.form-control, textarea.form-control {
  margin-bottom: 10px;
}

.d-flex {
  display: flex;
  justify-content: space-between;
}
</style>
