<template>
  <div class="container-fluid">
   
    
    <div class="subject-info-container">
      <div class="subject-info">
        <div class=" d-flex align-items-center">
          <button @click="$router.go(-1)" class="nav-link" style="border: none; background: none; color: inherit; font-weight: 500; font-size: 20px;">
            <i class="bi bi-arrow-bar-left" style="font-weight: 800;"></i> Go back
          </button>
        </div>
        <div class="col-12">
      <h4 class="mb-0" style="text-align: center;">{{ exam_title }}</h4> <!-- Remove default margin -->
      <p class="mb-1">Instructions: {{ instruction }}</p> <!-- Reduce bottom margin -->
      <p class="mb-1">Completion Percentage: <b> {{ completion_percentage }}</b></p> <!-- Reduce bottom margin -->
      <p class="mb-1">Students Completed Exam: <b>  {{ students_completed_exam }} / {{ total_students }} </b></p> <!-- Reduce bottom margin -->
    </div>

     </div><br><br>

     <div v-if="questionAnalysis.length > 0" class="questions-container ">
        <table class="table table-striped table-custom">
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Correct Answer</th>
              <th>Correct Selections</th>
              <th>Incorrect Selections</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(question, index) in questionAnalysis" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ question.question }}</td>
              <td>{{ question.correct_answer }}</td>
              <td style="text-align: center; cursor: pointer;">{{ question.choices.find(choice => choice.choice === question.correct_answer).count }}</td>
              <td style="text-align: center; cursor: pointer;">{{ question.totalResponses - question.choices.find(choice => choice.choice === question.correct_answer).count }}</td>
            </tr>
          </tbody><br>
        </table>
      </div>

      <div v-else>
        <p>No item analysis data available for this exam.</p>
      </div>
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
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      questionAnalysis: [], // Stores item analysis data
      error: ''
    };
  },
  created() {
    this.fetchSubject(); // Fetch the subject details
    this.fetchItemAnalysis(); // Fetch the item analysis data
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
    async fetchItemAnalysis() {
      try {
        const examId = this.$route.params.exam_id;
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = 'Authorization token is missing. Please log in again.';
          return;
        }

        const response = await axios.get(`${config.apiBaseURL}/itemAnalysis`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            examId: examId,
          }
        });
        console.log('Item analysis response:', response);
        
        // Calculate total responses for each question
        
        this.questionAnalysis = response.data.item_analysis.map((question) => {
          const totalResponses = question.choices.reduce((sum, choice) => sum + choice.count, 0);
          return {
            ...question,
            totalResponses: totalResponses // Add total responses to each question
          };
        });
        // Add these lines to set completion percentage and counts
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
    getPercentage(count, totalResponses) {
      return totalResponses > 0 ? ((count / totalResponses) * 100).toFixed(2) : 0;
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
    }
  }
};
</script>
<style scoped>
/* Main Container */
.main-container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
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
</style>
