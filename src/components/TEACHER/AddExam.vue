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
            <input type="text" v-model="question.question" class="form-control" required />
          </div>

          <!-- Multiple Choice Question Type -->
          <div v-if="globalQuestionType === 'multiple-choice'" class="mb-3">
            <label class="form-label">Choices</label>
            <div v-for="(choice, idx) in question.choices" :key="idx" class="input-group mb-2">
              <input type="text" v-model="question.choices[idx]" class="form-control" placeholder="Choice" />
            </div>
            <button @click="addChoice(question)" class="btn btn-secondary btn-sm">Add Choice</button>
          </div>

          <!-- True/False Question Type -->
          <div v-if="globalQuestionType === 'true-false'" class="mb-3">
            <label class="form-label">Correct Answer</label>
            <select v-model="question.correct_answers[0].correct_answer" class="form-control" required>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <!-- Identification Question Type -->
          <div v-if="globalQuestionType === 'identification'" class="mb-3">
            <label class="form-label">Correct Answer</label>
            <input type="text" v-model="question.correct_answers[0].correct_answer" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Points</label>
            <input type="number" v-model="question.correct_answers[0].points" class="form-control" min="1" required />
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button @click="addNewQuestionForm" class="btn btn-secondary mt-4">Add New Question</button>
          <button @click="saveAllQuestions" class="btn btn-primary mt-4">Save All</button>
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
      globalQuestionType: 'multiple-choice', // default is multiple-choice
      questions: [
        {
          question: '',
          correct_answers: [
            {
              correct_answer: '',
              points: 1,
            },
          ],
          choices: ['', '', ''], // default choices for multiple-choice
        },
      ],
      existingQuestions: [],
      examId: null,
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

    addChoice(question) {
      question.choices.push(''); // Add an empty choice to the array
    },

    addNewQuestionForm() {
      this.questions.push({
        question: '',
        correct_answers: [
          {
            correct_answer: '',
            points: 1,
          },
        ],
        choices: this.globalQuestionType === 'multiple-choice' ? ['', '', ''] : [],
      });
    },

    async saveAllQuestions() {
      try {
        // Prepare the payload dynamically
        const instructionsData = [
          {
            instruction: this.examInstruction,
            question_type: this.globalQuestionType,
            questions: this.questions.map((question) => {
              // Exclude `choices` for true-false or identification question types
              let questionData = {
                question: question.question,
                correct_answers: [
                  {
                    correct_answer: question.correct_answers[0].correct_answer,
                    points: question.correct_answers[0].points,
                  },
                ],
              };

              // Only include choices for multiple-choice questions
              if (this.globalQuestionType === 'multiple-choice') {
                questionData.choices = question.choices;
              }

              return questionData;
            }),
          },
        ];

        // Log the payload being sent to verify correctness
        console.log('Payload being sent:', JSON.stringify(instructionsData, null, 2));

        // Send the data to the backend
        await axios.post(
          `http://localhost:8000/api/addQuestionsToExam/${this.examId}`,
          { instructions: instructionsData },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        // Re-fetch questions after saving
        await this.fetchQuestions();
        alert('All questions saved successfully!');
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

input.form-control, textarea.form-control {
  margin-bottom: 10px;
}

.d-flex {
  display: flex;
  justify-content: space-between;
}
</style>
