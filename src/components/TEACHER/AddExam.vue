<template>
  <div class="manage-exam-container">
    <h2 class="page-title">Exam Creation and Management</h2>

    <div class="top-section d-flex justify-content-between align-items-center mb-4">
      <div class="button-group">
        <button v-if="existingQuestions.length > 0 && !isPublished" @click="publishExam" type="button" class="btn btn-success me-2">
          Publish Exam
        </button>
        <button v-if="selectedQuestions.length > 0" @click="saveToTestBank" type="button" class="btn btn-info me-2">
          Save Selected to Test Bank
        </button>
        <button @click="viewExamSchedule" type="button" class="btn btn-primary">
          View Exam Schedule
        </button>
      </div>
    </div>

    <!-- Show the published message if the exam is published -->
    <div v-if="isPublished" class="alert alert-success">
      The exam has been successfully published.
    </div>

    <div class="main-content d-flex mt-4">
      <!-- Left Section: Created Questions -->
      <div class="left-section w-50 me-4">
        <h4>Created Questions</h4>
        <div v-if="existingQuestions.length > 0">
          <div class="instruction-card mb-4 p-3 border bg-light">
            <p><strong>Instruction:</strong> {{ examInstruction }}</p>
          </div>

          <!-- Display all existing questions with a checkbox to select -->
          <div v-for="(question, index) in existingQuestions" :key="index" class="question-card mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="question-title">{{ index + 1 }}. {{ question.question }}</h5>
              <input type="checkbox" v-model="selectedQuestions" :value="prepareQuestionForSelection(question)" />
            </div>
            <p><strong>Correct Answer:</strong> {{ question.correct_answers[0]?.correct_answer }}</p>
            <p><strong>Points:</strong> {{ question.correct_answers[0]?.points }}</p>

            <ul v-if="question.choices && question.choices.length > 0">
              <li v-for="(choice, idx) in question.choices" :key="idx">
                {{ choice.choices }}
              </li>
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
              <input type="text" v-model="question.choices[idx].choices" class="form-control" placeholder="Choice" />
            </div>
            <button @click="addChoice(question)" class="btn btn-secondary btn-sm">Add Choice</button>
          </div>

          <!-- Correct Answer for all question types -->
          <div class="mb-3">
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
import Swal from 'sweetalert2';

export default {
  name: 'AddExaminationsofSHS',
  data() {
    return {
      examInstruction: '',
      globalQuestionType: 'multiple-choice',
      questions: [
        {
          question: '',
          correct_answers: [
            {
              correct_answer: '',
              points: 1,
            },
          ],
          choices: [{ choices: '' }, { choices: '' }, { choices: '' }],
        },
      ],
      existingQuestions: [],
      examId: null,
      selectedQuestions: [], // Store selected questions
      isPublished: false, // Track the published status
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
      question.choices.push({ choices: '' }); // Add an empty choice to the array
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
        choices: this.globalQuestionType === 'multiple-choice' ? [{ choices: '' }, { choices: '' }, { choices: '' }] : [],
      });
    },

    createNewInstruction() {
      this.questions = [];
      this.addNewQuestionForm(); // Reset the question form
    },

    prepareQuestionForSelection(question) {
      return {
        question_id: question.question_id,
        correct_id: question.correct_answers[0]?.correct_answer_id,
        choices: question.choices ? question.choices.map(choice => ({
          choice_id: choice.choice_id, // Prepare all choices for selection
        })) : [],
      };
    },

    async saveAllQuestions() {
      try {
        const instructionsData = [
          {
            instruction: this.examInstruction,
            question_type: this.globalQuestionType,
            questions: this.questions.map((question) => {
              let existingQuestion = this.existingQuestions.find(
                (q) => q.question === question.question
              );

              let questionData = {
                question: question.question,
                correct_answers: [
                  {
                    correct_answer: question.correct_answers[0].correct_answer,
                    points: question.correct_answers[0].points,
                  },
                ],
              };

              if (this.globalQuestionType === 'multiple-choice') {
                questionData.choices = question.choices;
              }

              if (existingQuestion) {
                // Update existing question if found
                existingQuestion = { ...existingQuestion, ...questionData };
              } else {
                // Add new question if not found
                this.existingQuestions.push(questionData);
              }

              return questionData;
            }),
          },
        ];

        await axios.post(
          `http://localhost:8000/api/addQuestionsToExam/${this.examId}`,
          { instructions: instructionsData },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        await this.fetchQuestions();
        Swal.fire('Success', 'All questions saved successfully!', 'success');
      } catch (error) {
        console.error('Error saving questions:', error.message);
        Swal.fire('Error', 'There was a problem saving the questions.', 'error');
      }
    },

    async saveToTestBank() {
      if (this.selectedQuestions.length === 0) {
        Swal.fire('No Questions Selected', 'Please select at least one question to save.', 'warning');
        return;
      }

      try {
        const payload = {
          schedule_id: this.examId, 
          questions: this.selectedQuestions.map((question) => ({
            question_id: question.question_id,
            correct_id: question.correct_id,
            choices: question.choices.map(choice => ({
              choice_id: choice.choice_id, 
            })),
          })),
        };

        await axios.post(
          `http://localhost:8000/api/storetestbank`,
          payload,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        Swal.fire('Success', 'Selected questions saved to test bank successfully!', 'success');
        this.selectedQuestions = []; // Clear selected questions after saving
      } catch (error) {
        console.error('Error saving to test bank:', error.message);
        Swal.fire('Error', 'There was a problem saving the questions to the test bank.', 'error');
      }
    },

    async publishExam() {
      try {
        await axios.post(
          `http://localhost:8000/api/exams/publish2/${this.examId}`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        this.isPublished = true; // Set isPublished to true when the exam is successfully published
        Swal.fire('Success', 'Exam published successfully', 'success');
      } catch (error) {
        console.error('Failed to publish exam:', error.message);
        Swal.fire('Error', 'There was a problem publishing the exam.', 'error');
      }
    },

    viewExamSchedule() {
      Swal.fire('Redirect', 'Redirecting to exam schedule...', 'info');
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

.correct-answer {
  color: green;
  font-weight: bold;
}

input.form-control, textarea.form-control {
  margin-bottom: 10px;
}

.d-flex {
  display: flex;
  justify-content: space-between;
}

.alert {
  margin-top: 10px;
}
</style>
