<template>
  <div class="manage-exam-container">
    <h2 class="page-title">Exam Creation and Management</h2>

    <div class="top-section d-flex justify-content-between align-items-center mb-4">
      <div class="button-group">
        <button v-if="newQuestions.length > 0 && !isPublished" @click="publishExam" type="button" class="btn btn-success me-2">
          Publish Exam
        </button>
        <button @click="viewExamSchedule" type="button" class="btn btn-primary">
          View Exam Schedule
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
          <div v-for="(question, index) in existingQuestions" :key="index" class="question-card mb-4">
            <h5>{{ index + 1 }}. {{ question.question }}</h5>
            <p><strong>Correct Answer:</strong> {{ question.correct_answers[0]?.correct_answer }}</p>
            <p><strong>Points:</strong> {{ question.correct_answers[0]?.points }}</p>

            <!-- Display choices -->
            <ul v-if="question.choices && question.choices.length > 0">
              <li v-for="(choice, idx) in question.choices" :key="idx">{{ choice.choices }}</li>
            </ul>

            <!-- Button to save to test bank -->
            <button @click="confirmSaveToTestBank(question)" class="btn btn-info btn-sm">Select to Save</button>
            <button @click="editQuestion(index)" class="btn btn-warning btn-sm">Edit</button>
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
        <div v-for="(question, index) in newQuestions" :key="index" class="question-card mb-4 p-3 border bg-light">
          <div class="mb-3">
            <label class="form-label">Question</label>
            <input type="text" v-model="question.text" class="form-control" required />
          </div>

          <!-- Display input fields based on question type -->
          <div v-if="globalQuestionType === 'multiple-choice'" class="mb-3">
            <label class="form-label">Choices</label>
            <div v-for="(choice, idx) in question.choices" :key="idx" class="input-group mb-2">
              <input type="text" v-model="question.choices[idx]" class="form-control" placeholder="Choice" />
            </div>
            <button @click="addChoice(question)" class="btn btn-secondary btn-sm">Add Choice</button>
            <div class="mb-3">
            <label class="form-label">Correct Answer</label>
            <input type="text" v-model="question.correctAnswer" class="form-control" required />
          </div>

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
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      examId: null,
      existingQuestions: [], // Existing questions from backend
      newQuestions: [
        {
          text: '', // Question text
          correctAnswer: '', // Correct answer
          points: 1, // Default points
          choices: ['', '', ''], // Default multiple-choice structure
        },
      ],
      globalQuestionType: 'multiple-choice', // Default question type
      examInstruction: '', // Exam instruction
      isPublished: false, // Publish status
    };
  },
  created() {
    this.examId = this.$route.params.examId;
    this.fetchQuestions(); // Fetch existing questions when the component loads
  },
  methods: {
    // Fetch the existing questions from the backend
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

    // Add a new choice to a multiple-choice question
    addChoice(question) {
      question.choices.push(''); // Add an empty choice
    },

    // Add a new question form for the user to fill out
    addNewQuestionForm() {
      this.newQuestions.push({
        text: '',
        correctAnswer: '',
        points: 1,
        choices: this.globalQuestionType === 'multiple-choice' ? ['', '', ''] : [],
      });
    },

    // Save all newly created questions to the backend
    async saveAllQuestions() {
      try {
        const instructionsData = [
          {
            instruction: this.examInstruction,
            question_type: this.globalQuestionType,
            questions: this.newQuestions.map(question => ({
              question: question.text,
              choices:
                this.globalQuestionType === 'multiple-choice'
                  ? question.choices.filter(choice => choice !== '') // Filter out empty choices
                  : [],
              correct_answers: [
                {
                  correct_answer: question.correctAnswer,
                  points: question.points,
                },
              ],
            })),
          },
        ];

        // Post the new questions to the backend
        await axios.post(
          `http://localhost:8000/api/addQuestionsToExam/${this.examId}`,
          { instructions: instructionsData },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        // Clear the newQuestions array after saving to avoid duplications
        this.newQuestions = [
          {
            text: '',
            correctAnswer: '',
            points: 1,
            choices: this.globalQuestionType === 'multiple-choice' ? ['', '', ''] : [],
          },
        ];

        // Re-fetch the existing questions to update the view
        await this.fetchQuestions();

        alert('All questions saved successfully!');
      } catch (error) {
        console.error('Failed to save questions:', error.message);
        Swal.fire('Error', 'Failed to save questions. Please try again.', 'error');
      }
    },

    // Save the selected question to the test bank
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

    // Prepare the question data for saving to the test bank
    prepareQuestionForSelection(question) {
      const questionId = question.id || question.question_id;
      const correctAnswerId = question.correct_answers?.[0]?.correct_answer_id || question.correct_answers?.[0]?.id;

      let choices = [];

      if (this.globalQuestionType === 'true-false') {
        choices = [
          { choice_id: 1, choices: 'True' },
          { choice_id: 2, choices: 'False' },
        ];
      } else if (this.globalQuestionType === 'multiple-choice') {
        choices = question.choices.map(choice => ({
          choice_id: choice.choice_id || choice.id,
          choices: choice.choices,
        }));
      }

      // Identification questions have no choices
      if (this.globalQuestionType === 'identification') {
        choices = [];
      }

      if (!questionId || !correctAnswerId) {
        console.error('Missing question_id or correct_answer_id');
        return null;
      }

      return {
        question_id: questionId,
        correct_id: correctAnswerId,
        choices: choices,
      };
    },

    // Save the question to the test bank
    async saveToTestBank(questionData) {
      try {
        const payload = {
          schedule_id: this.examId,
          questions: [questionData], // Save one question at a time
        };

        await axios.post(
          `http://localhost:8000/api/storetestbank`,
          payload,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        Swal.fire('Success', 'Question saved to test bank successfully!', 'success');
      } catch (error) {
        console.error('Error saving to test bank:', error.response.data);
        Swal.fire('Error', error.response.data.message, 'error');
      }
    },

    // Publish the exam
    publishExam() {
      axios.post(
        `http://localhost:8000/api/exams/publish2/${this.examId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
        .then(() => {
          this.isPublished = true;
          Swal.fire('Success', 'Exam published successfully!', 'success');
        })
        .catch((error) => {
          console.error('Failed to publish exam:', error.message);
        });
    },

    // Redirect to the exam schedule
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
