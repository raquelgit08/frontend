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
          <!-- Loop through instructions first -->
          <div v-for="(instruction, iIndex) in existingQuestions" :key="iIndex" class="instruction-card mb-4">
            <!-- Display the instruction text -->
            <h4>Instruction: {{ instruction.instructions ? instruction.instructions.instruction : 'No instruction' }}</h4>

            <!-- Loop through the questions within each instruction -->
            <div v-for="(question, qIndex) in (instruction.instructions ? instruction.instructions.questions : [])" :key="qIndex" class="question-card mb-4">
              <!-- Display the question text -->
              <h5>{{ qIndex + 1 }}. {{ question.question }}</h5>

              <!-- Display the correct answer -->
              <p><strong>Correct Answer:</strong> {{ (question.correct_answers && question.correct_answers.length > 0) ? question.correct_answers[0].correct_answer : 'N/A' }}</p>

              <!-- Check if the question type is True/False -->
              <div v-if="instruction.question_type === 'true-false'">
                <ul>
                  <li>True</li>
                  <li>False</li>
                </ul>
              </div>

              <!-- Display the choices for other question types -->
              <ul v-else-if="question.choices && question.choices.length > 0">
                <li v-for="(choice, cIndex) in question.choices" :key="cIndex">{{ choice.choices }}</li>
              </ul>

              <!-- Display the points assigned -->
              <p><strong>Points:</strong> {{ (question.correct_answers && question.correct_answers.length > 0) ? question.correct_answers[0].points : 'N/A' }}</p>

              <!-- Buttons for actions -->
              <button @click="confirmSaveToTestBank(question)" class="btn btn-info btn-sm">Select to Save</button>
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
        const instructions = response.data.instructions || [];

        // Map the structure to existingQuestions, which now includes instructions
        this.existingQuestions = instructions;
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
                  : [], // True/False or Identification have no choices
              correct_answers: [
                {
                  correct_answer: question.correctAnswer,
                  points: question.points,
                },
              ],
            })),
          },
        ];

        await axios.post(
          'http://localhost:8000/api/addQuestions',
          {
            exam_id: this.examId,
            instructions: instructionsData,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        Swal.fire('Success', 'Questions have been saved successfully!', 'success');
        this.newQuestions = []; // Clear the form
      } catch (error) {
        console.error('Failed to save questions:', error.message);
        Swal.fire('Error', 'Failed to save questions.', 'error');
      }
    },

    // Confirm saving a question to the test bank
    confirmSaveToTestBank(question) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to save this question to the test bank.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.post(
              'http://localhost:8000/api/saveQuestionToTestBank',
              { question_id: question.id },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              }
            );

            Swal.fire('Saved!', 'The question has been saved to the test bank.', 'success');
          } catch (error) {
            console.error('Failed to save question to test bank:', error.message);
            Swal.fire('Error', 'Failed to save question to the test bank.', 'error');
          }
        }
      });
    },

    // Edit a specific question by its index
    editQuestion(index) {
      const question = this.newQuestions[index];
      this.$refs[`questionForm_${index}`].scrollIntoView({ behavior: 'smooth' });
      this.$nextTick(() => {
        this.newQuestions[index] = { ...question }; // Update the question form with selected question details
      });
    },

    // Delete a specific question
    async deleteQuestion(questionId) {
      try {
        await axios.delete(
          `http://localhost:8000/api/deleteQuestion/${questionId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        Swal.fire('Deleted!', 'The question has been deleted.', 'success');
        this.fetchQuestions(); // Refresh the list of questions
      } catch (error) {
        console.error('Failed to delete question:', error.message);
        Swal.fire('Error', 'Failed to delete the question.', 'error');
      }
    },

    // Publish the exam
    async publishExam() {
      try {
        await axios.post(
          `http://localhost:8000/api/publishExam/${this.examId}`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        this.isPublished = true; // Update the publish status
        Swal.fire('Published!', 'The exam has been published.', 'success');
      } catch (error) {
        console.error('Failed to publish exam:', error.message);
        Swal.fire('Error', 'Failed to publish the exam.', 'error');
      }
    },

    // View the exam schedule
    viewExamSchedule() {
      this.$router.push(`/exam-schedule/${this.examId}`);
    },

    // Change the global question type and reset the form
    createNewInstruction() {
      this.newQuestions = [
        {
          text: '',
          correctAnswer: '',
          points: 1,
          choices: this.globalQuestionType === 'multiple-choice' ? ['', '', ''] : [],
        },
      ];
    },
  },
};
</script>
<style scoped>
.manage-exam-container {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
}

.top-section {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.instruction-card, .question-card {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.instruction-card {
  padding: 10px;
  background-color: #f9f9f9;
}

.question-card {
  padding: 15px;
  background-color: #fff;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.btn {
  margin-right: 5px;
}
</style>
