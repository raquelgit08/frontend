<template>
  <div class="container-fluid">
    <div class="subject-info-container">
      <div class="subject-info">
        <div class="d-flex align-items-center">
          <button
            @click="$router.go(-1)"
            class="nav-link"
            style="border: none; background: none; color: inherit; font-weight: 500; font-size: 20px;"
          >
            <i class="bi bi-arrow-bar-left" style="font-weight: 800;"></i> Go back
          </button>
        </div>
        <div class="col-12">
          <h4 class="mb-0" style="text-align: center;">{{ exam_title }}</h4>
          <p class="mb-1">Instructions: {{ instruction }}</p>
          <p class="mb-1">Completion Percentage: <b>{{ completion_percentage }}</b></p>
          <p class="mb-1">Students Completed Exam: <b>{{ students_completed_exam }} / {{ total_students }}</b></p>
        </div>
      </div><br><br>

      <div v-if="questionAnalysis.length > 0" class="questions-container" >
        <table class="table table-striped table-custom">
          <thead>
            <tr>
              <th style="width: 3%; text-align: center;">#</th>
              <th style="width: 22%; ">Question</th>
              <th style="width: 22%; ">Correct Answer</th>
              <th style="width: 9%; text-align: center;">Correct Selections</th>
              <th style="width: 9%; text-align: center;">Incorrect Selections</th>
              <th style="width: 13%; text-align: center;">
                 <i class="bi bi-exclamation-triangle" title="Click to show formula" style="cursor: pointer; font-size: 30px; margin-right: 5px; color: #dc3545;" @click="openModal ('Difficulty', '/itemanalysis/difficulty.jpg', 'The Difficulty Index is usually expressed as a percentage or a fraction, representing the proportion of respondents who answer a question correctly. A lower percentage indicates a higher level of difficulty, while a higher percentage suggests that the question is easier.')" >
                 </i>Difficulty</th>
              <th style="width: 13%; text-align: center;">
                <i class="bi bi-sliders" title="Click to show formula" style="cursor: pointer; font-size: 30px;margin-right: 5px; color: #0d6efd;" @click="openModal('Discrimination', '/itemanalysis/discrimination.jpg', 'The Discrimination Index indicates how effectively a question differentiates between students who understand the material well and those who do not. A high Discrimination Index means that high-achieving students are more likely to answer the question correctly than low-achieving students.')" ></i>Discrimination</th>
              <th style="width: 9%; text-align: center;">
                <i class="bi bi-check2-square" title="Click show condition" style="cursor: pointer; font-size: 30px;margin-right: 5px; color: #28a745;" @click="openModal('Decision', '/itemanalysis/evaluation.jpg', 'The Decision metric helps educators determine the quality and appropriateness of each test question. It combines insights from various indices, including the Difficulty and Discrimination Indices, to guide decisions on each items effectiveness in a test.')" ></i>Decision</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(question, index) in paginatedQuestions" :key="index">
              <td style="text-align: center;">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ question.question }}</td>
              <td>{{ question.correct_answer }}</td>
              <td style="text-align: center; cursor: pointer;" @click="showCorrectStudents(question)">
                {{ question.choices.find(choice => choice.choice === question.correct_answer).count }}
              </td>
              <td style="text-align: center; cursor: pointer;" @click="showIncorrectStudents(question)">
                {{ question.totalResponses - question.choices.find(choice => choice.choice === question.correct_answer).count }}
              </td>
              <td style="text-align: center;">
                <!-- <div :class="getDifficultyClass(question.difficulty_category)">
                  <b> {{ question.difficulty_percentage }}</b>
                </div> -->
                <!-- <small style="font-size: 15px;">{{ question.difficulty_category }}</small> -->
                Index: {{ question.itemdifficulty }}<br>
                <small> Remarks :{{ question.DifficultyCategory }} </small>
              </td>
              <td style="text-align: center;">
                Index :{{ question.itemdiscrimination }}<br>
                <small> Remarks :{{ question.DiscriminationCategory }} </small>
              </td>
              <td style="text-align: center;">
                {{ question.Decision }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="showModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p>{{ modalContent }}</p>
            <img :src="modalImage" alt="Image for {{ modalTitle }}" class="img-fluid" />
            
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
        <div class="col-md-2"></div>
        <div class="col-md-7">
          <!-- Pagination Controls -->
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
            </li>
          </ul>
        </nav>
        </div>
      </div>

      <div v-else>
        <p>No item analysis data available for this exam.</p>
      </div>

      <b-modal id="correctStudentsModal" v-model="isModalVisibleCorrect" title="Students Who Answered Correctly" class="custom-modal">
  <div>
    <div v-if="showCardContent" class="info-card">
      <button class="btn-close" @click="closeCard"></button>
      <h5>{{ cardTitle }}</h5>
      <p v-html="cardText"></p> <!-- Use v-html to render HTML -->
    </div>
    <div v-if="correctStudents.length > 0">
      <table class="table table-striped table-custom">
        <thead>
          <tr>
            <th>#</th>
            <th>ID Number</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in paginatedCorrectStudents" :key="index">
            <td>{{ (currentCorrectPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ student.idnumber }}</td>
            <td>{{ student.lname }}</td>
            <td>{{ student.fname }}</td>
            <td>{{ student.mname }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentCorrectPage === 1 }">
            <a class="page-link" href="#" @click.prevent="currentCorrectPage--">Previous</a>
          </li>
          <li v-for="page in totalCorrectPages" :key="page" class="page-item" :class="{ active: currentCorrectPage === page }">
            <a class="page-link" href="#" @click.prevent="currentCorrectPage = page">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentCorrectPage === totalCorrectPages }">
            <a class="page-link" href="#" @click.prevent="currentCorrectPage++">Next</a>
          </li>
        </ul>
      </nav>
    </div>
    <p v-else>No students answered correctly for this question.</p>
  </div>
</b-modal>

<b-modal id="incorrectStudentsModal" v-model="isModalVisibleIncorrect" title="Students Who Answered Incorrectly" class="custom-modal">
  <div>
    <div v-if="incorrectStudents.length > 0">
      <table class="table table-striped table-custom">
        <thead>
          <tr>
            <th>#</th>
            <th>ID Number</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in paginatedIncorrectStudents" :key="index">
            <td>{{ (currentIncorrectPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ student.idnumber }}</td>
            <td>{{ student.lname }}</td>
            <td>{{ student.fname }}</td>
            <td>{{ student.mname }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentIncorrectPage === 1 }">
            <a class="page-link" href="#" @click.prevent="currentIncorrectPage--">Previous</a>
          </li>
          <li v-for="page in totalIncorrectPages" :key="page" class="page-item" :class="{ active: currentIncorrectPage === page }">
            <a class="page-link" href="#" @click.prevent="currentIncorrectPage = page">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentIncorrectPage === totalIncorrectPages }">
            <a class="page-link" href="#" @click.prevent="currentIncorrectPage++">Next</a>
          </li>
        </ul>
      </nav>
    </div>
    <p v-else>No students answered incorrectly for this question.</p>
  </div>
</b-modal>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';

export default {
  name: 'ITEManalysis',
  data() {
    return {
      showModal: false, // Controls modal visibility
      modalTitle: "", // Title to display in the modal
      modalContent: "", // Content for the modal
      modalImage: "", // Image URL to display in the modal
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      questionAnalysis: [],
      correctStudents: [],
      incorrectStudents: [],
      currentPage: 1, // Current page number
      currentCorrectPage: 1, // Current page for correct students
    currentIncorrectPage: 1, // Current page for incorrect students
      itemsPerPage: 10, // Number of items per page
      error: '',
      isModalVisibleCorrect: false,
      isModalVisibleIncorrect: false,
      completion_percentage: 0,
      students_completed_exam: 0,
      total_students: 0,
      exam_title: '',
      instruction: ''
    };
  },
  created() {
    this.fetchSubject();
    this.fetchItemAnalysis();
  },
  computed: {
    paginatedQuestions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.questionAnalysis.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.questionAnalysis.length / this.itemsPerPage);
    },

    paginatedCorrectStudents() {
    const start = (this.currentCorrectPage - 1) * this.itemsPerPage;
    return this.correctStudents.slice(start, start + this.itemsPerPage);
  },
  paginatedIncorrectStudents() {
    const start = (this.currentIncorrectPage - 1) * this.itemsPerPage;
    return this.incorrectStudents.slice(start, start + this.itemsPerPage);
  },
  totalCorrectPages() {
    return Math.ceil(this.correctStudents.length / this.itemsPerPage);
  },
  totalIncorrectPages() {
    return Math.ceil(this.incorrectStudents.length / this.itemsPerPage);
  }
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

        const response = await axios.get(`${config.apiBaseURL}/class/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Full API response:', response);
        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
      } catch (error) {
        console.error('Error fetching subject:', error);
        this.handleError(error);
      }
    },
  //   getDifficultyClass(difficultyCategory) {
  //   if (difficultyCategory === 'Easy') {
  //     return 'easy-color';
  //   } else if (difficultyCategory === 'Moderately Difficult') {
  //     return 'moderate-color';
  //   } else {
  //     return 'difficult-color';
  //   }
  // },
    async fetchItemAnalysis() {
      try {
        const examId = this.$route.params.exam_id;
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = 'Authorization token is missing. Please log in again.';
          return;
        }

        const response = await axios.get(`${config.apiBaseURL}/itemAnalysis2`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            examId: examId,
          }
        });
        console.log('Item analysis response:', response);
        
        this.questionAnalysis = response.data.item_analysis.map((question) => {
          const totalResponses = question.choices.reduce((sum, choice) => sum + choice.count, 0);
          return {
            ...question,
            totalResponses: totalResponses
          };
        });
        
        this.completion_percentage = response.data.completion_percentage;
        this.students_completed_exam = response.data.students_completed_exam;
        this.total_students = response.data.total_students;
        this.exam_title = response.data.exam_title;
        this.instruction = response.data.instruction;
        
      } catch (error) {
        console.error('Error fetching item analysis:', error);
        this.handleError(error);
      }
    },
    
    showCorrectStudents(question) {
      const correctChoice = question.choices.find(choice => choice.choice === question.correct_answer);
      this.correctStudents = correctChoice ? correctChoice.students : [];
      this.isModalVisibleCorrect = true; // Open the modal for correct students
    },
    showIncorrectStudents(question) {
      const incorrectChoice = question.choices.filter(choice => choice.choice !== question.correct_answer);
      this.incorrectStudents = [];
      
      incorrectChoice.forEach(choice => {
        this.incorrectStudents.push(...choice.students);
      });
      
      this.isModalVisibleIncorrect = true; // Open the modal for incorrect students
    },
    handleError(error) {
      if (error.response) {
        if (error.response.status === 404) {
          this.error = 'Data not found.';
        } else if (error.response.status === 403) {
          this.error = 'You are not authorized.';
        } else {
          this.error = error.response.data.message || 'Failed to fetch data.';
        }
      } else {
        this.error = 'Failed to fetch data. Please try again later.';
      }
    },
    openModal(title, image, content) {
      this.modalTitle = title;
      this.modalImage = image;
      this.modalContent = content; // Set the modal content
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  
  }
};
</script>

<style>
.custom-modal .modal-dialog {
  max-width: 70%; /* Adjust the width percentage as needed */
  width: auto; /* Allows the modal to size based on its content */
}

.custom-modal .modal-content {
  padding: 20px; /* Optional: Add padding for aesthetics */
}

.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border: 1px solid #200909;
  overflow: hidden;
}
.table-custom th {
  background-color: #c1c1c1d7;
  color: #000000;
  font-weight: 700;
}
.table th,
.table td {
 
  border-bottom: 1px solid #dee2e6;
}

.table-custom tbody tr:hover {
  background-color: #f1f3f5;
}

.table-custom tbody tr {
  transition: background-color 0.3s ease;
}


.subject-info-container {
  background-color: #EEEDED;
  border-radius: 10px;
  padding: 15px;
  margin-left: 13px;
  margin-right: 13px;
  margin-bottom: 10px;
  height: 190px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.subject-title {
  font-size: 1.75rem;
  margin-bottom: 10px;
  font-weight: 800;
  color: #333;
}

.subject-description {
  color: #555;
  margin-bottom: 5px;
}

/* Analysis Section */
.container-fluid {
  margin: auto;
}

/* Flex container for questions */
.questions-container {
  display: flex;
  flex-wrap: wrap; /* Allows wrapping of items */
  gap: 20px; /* Space between boxes */
}

.question-analysis {
  border: 2px dashed #007bff;

  background-color: #ffffff;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1 1 calc(50% - 20px); /* Take 50% of the width minus the gap */
  box-sizing: border-box; /* Include padding in width calculation */
}

.question-analysis h6 {
  font-weight: bold;
}

/* Question Header - Flexbox to Align Question and Difficulty */
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.difficulty-percentage {
  background-color: #fff3cd;
  padding: 5px 10px;
  border-radius: 5px;
  color: #856404;
  font-weight: bold;
  white-space: nowrap;
}

/* Progress Bar Styling */
.progress {
  height: 20px;
  background-color: #e9ecef;
  border-radius: 10px;
  margin-top: 5px;
  /* max-width: 700px; */
  width: 100%;
}

.progress-bar {
  transition: width 0.4s ease;
  height: 100%;
}
.easy-color {
  color: rgb(19, 160, 19);
}

.moderate-color {
  color: rgb(239, 189, 64); /* A better representation for dark yellow */
}

.difficult-color {
  color: rgb(198, 19, 19);
}

</style>
