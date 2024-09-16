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
      
      <!-- Check if analysis is ready -->
      <div v-if="questionAnalysis.length > 0">
        <div v-for="(question, index) in questionAnalysis" :key="index" class="question-analysis">
          <h6>{{ index + 1 }}. {{ question.question }}</h6>
          
          <!-- Correct Answer -->
          <p><strong>Correct Answer:</strong> {{ question.correct_answer }}</p>

          <!-- Choice List with Selection Count and Percentage -->
          <ul>
            <li v-for="(choice, choiceIndex) in question.choices" :key="choiceIndex">
              {{ choice.choice }}: {{ choice.count }} selections ({{ choice.percentage }}%)
            </li>
          </ul>
        </div>
      </div>

      <!-- Show a message if no analysis is available -->
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

        // Ensure the response aligns with the backend structure
        this.questionAnalysis = response.data.item_analysis; // Properly access the item_analysis array
      } catch (error) {
        console.error('Error fetching item analysis:', error);
        this.handleError(error);
      }
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

.question-analysis {
  background-color: #f8f9fa;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.question-analysis h6 {
  font-weight: bold;
}

.question-analysis ul {
  list-style-type: none;
  padding-left: 0;
}

.question-analysis li {
  padding: 5px 0;
}
</style>
