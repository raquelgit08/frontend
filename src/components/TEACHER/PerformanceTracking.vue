<template>
  <div class="main-container">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2>{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} | {{ subject.schoolYear }}</p>
      </div>
    </div>

    <!-- Unified Navigation Bar -->
    <nav class="nav nav-pills">
      <router-link to="/teacheraddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4"></i></span>
      </router-link>
      <router-link :to="`/subject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
      <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
      <router-link :to="`/ItemAnalysis/${$route.params.class_id}`" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link>
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
    </nav>
  </div>

  <div class="performance-page">
    <div class="container-fluid">
      <h5>Performance Tracking</h5>

      <!-- Alert for Errors -->
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Grading Sheet -->
      <div v-if="results && Object.keys(results).length" class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>LRN</th>
              <th>Student Name</th>
              <th v-for="(examData, examTitle) in results" :key="examTitle">
                <div :title="formatDateTime(examData.exam_results[0]?.exam_start)">
                  {{ examTitle }}
                </div>
                <!-- <div>{{ examTitle }}</div>
                <div>{{ examData.exam_results[0]?.exam_start || 'No Date' }}</div> Display exam date -->
                <!-- <div>Total Points: {{ examData.exam_results[0]?.total_exam || 'N/A' }}</div> -->
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in getFlattenResults()" :key="student.id">
              <td>{{ index + 1 }}</td> <!-- This adds numbering -->
              <td>{{ student.lrn }}</td>
              <td>{{ student.Last_name }}, {{ student.First_name }} {{ student.Middle_i }}</td>
              <td v-for="(examData, examTitle) in results" :key="examTitle + student.lrn">
                {{ student[examTitle] || '-' }} /{{ examData.exam_results[0]?.total_exam }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>No results available.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PerformancesTracking',
  data() {
    return {
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      results: {}, // Results data, including exams and scores
      error: ''
    };
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
        this.error = error.response ? error.response.data.message : 'Failed to fetch subject data. Please try again later.';
      }
    },
    async fetchStudentResults() {
      try {
        const classId = this.$route.params.class_id;
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = 'Authorization token is missing. Please log in again.';
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/getAllStudentResults?classtable_id=${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Student Results Data:', response.data);
        if (response.data.results) {
          this.results = response.data.results;
        } else {
          this.error = 'No results found for this class.';
        }
      } catch (error) {
        console.error('Error fetching student results:', error);
        this.error = error.response ? error.response.data.error : 'Failed to fetch student results. Please try again later.';
      }
    },
    formatDateTime(dateTime) {
      if (!dateTime) return 'N/A';
      const date = new Date(dateTime);
      
      // Format the date
      const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric' };
      const formattedDate = date.toLocaleDateString([], optionsDate);

      // Format the time
      const optionsTime = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      const formattedTime = date.toLocaleTimeString([], optionsTime);

      return `${formattedDate} ${formattedTime}`;
    },

    getFlattenResults() {
      // Create a flattened version of the results data to simplify table rendering
      const results = [];
      for (const examTitle in this.results) {
        const examData = this.results[examTitle];
        for (const result of examData.exam_results) {
          let student = results.find(r => r.lrn === result.Lrn_id);
          if (!student) {
            student = {
              lrn: result.Lrn_id,
              Last_name: result.Last_name,
              First_name: result.First_name,
              Middle_i: result.Middle_i
            };
            results.push(student);
          }
          student[examTitle] = result.total_score || '-'; // Handle null scores
        }
      }
      return results;
    }

    },
    created() {
      this.fetchSubject(); // Fetch subject details when the component is created
      this.fetchStudentResults();
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
  margin: 10px;
  display: flex;
  align-items: center;
}

/* Subject Info Styling */
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

/* Navigation Bar */
.nav {
  flex: 2;
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
}

.nav-link {
  color: #343a40 !important;
  text-decoration: none;
  font-weight: 500;
}

.nav-link:hover {
  color: #007bff !important;
}

.router-link-active {
  color: #007bff !important;
  border-bottom: 2px solid #007bff;
}

/* Dashboard Title */
.subject-page h5 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #343a40;
  letter-spacing: 1px;
  margin-bottom: 40px;
}

/* Grading Sheet Table */
.table {
  width: 100%;
  margin-top: 20px;
  overflow-x: auto; /* Allow horizontal scrolling */
}

/* Make sure table cells are responsive */
.table th, .table td {
  text-align: center;
  vertical-align: middle;
  padding: 8px; /* Adjust padding as necessary */
  font-size: 0.9rem; /* Optionally reduce font size */
}

.table thead th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  color: #343a40;
  font-weight: 600;
  cursor: pointer;
}

.table tbody td {
  color: #495057;
}

/* Make the table borders consistent */
.table-bordered {
  border: 1px solid #dee2e6;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #dee2e6;
}

/* Ensure the alert and other elements fit as well */
.alert {
  margin-top: 20px;
}

</style>
