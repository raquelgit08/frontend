<template>
  <div class="main-container">
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2>{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} | {{ subject.schoolYear }}</p>
      </div>
    </div>

    <div class="container-fluid">
      <h5>Item Analysis</h5>
      <h3>Total Number of Students Enrolled: {{ total_students }}</h3>
      <h4>Completion Percentage: {{ completion_percentage }}</h4>
      <h4>Students Completed Exam: {{ students_completed_exam }} / {{ total_students }}</h4>

      <!-- Check if analysis is ready -->
      <div v-if="questionAnalysis.length > 0" class="questions-container">
        <div v-for="(question, index) in questionAnalysis" :key="index" class="question-analysis">
          <div class="question-header">
            <h6>{{ index + 1 }}. {{ question.question }}</h6>
            <span class="difficulty-percentage">Difficulty: {{ question.difficulty_percentage }}</span>
          </div>

          <p><strong>Correct Answer:</strong> {{ question.correct_answer }}</p>

          <ul>
            <li v-for="(choice, choiceIndex) in question.choices" :key="choiceIndex">
              {{ choice.choice }}: {{ choice.count }} selections ({{ getPercentage(choice.count, question.totalResponses) }}%)
              <div class="progress">
                <div class="progress-bar" :class="{'bg-success': choice.choice === question.correct_answer, 'bg-danger': choice.choice !== question.correct_answer}"
                  role="progressbar" :style="{ width: getPercentage(choice.count, question.totalResponses) + '%' }"
                  :aria-valuenow="getPercentage(choice.count, question.totalResponses)" aria-valuemin="0" aria-valuemax="100">
                  {{ getPercentage(choice.count, question.totalResponses) }}%
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div v-else>
        <p>No item analysis data available for this exam.</p>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

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

        const response = await axios.get(`http://localhost:8000/api/class/${classId}`, {
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

        const response = await axios.get('http://localhost:8000/api/itemAnalysis', {
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

/* Subject Info Container */
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
