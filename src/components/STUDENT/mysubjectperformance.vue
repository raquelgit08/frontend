<template>
  <div class="main-container">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2>{{ subject.subjectName }}</h2>
        <p>Description: {{ subject.classDescription }}</p>
        <p>Class Code: {{ subject.classGenCode }}</p>
      </div>
    </div>

    <!-- Navigation Bar Positioned Next to Subject Info -->
    <nav class="nav nav-pills">
      <router-link to="/Saddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4"></i></span>
      </router-link>
      <router-link :to="`/mysubject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
      <router-link :to="`/myExams/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-file-earmark-plus fs-4"></i> Exams
      </router-link>
      <router-link :to="`/myfeedbacks/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-chat-dots fs-4"></i> Feedback
      </router-link>
      <router-link :to="`/mysubjectperformance/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-activity fs-4"></i> Subject Performance 
      </router-link>
    </nav>

    <!-- Subject Page Content -->
    <div class="subject-page container mt-5">
      <h5 class="text-center">Subject Performance</h5>

      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <!-- Performance Table -->
      <table class="table table-hover" v-if="performances.length">
        <thead>
          <tr>
            <th>Exam Title</th>
            <th>Total Score</th>
            <th>Total Exam</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="performance in performances" :key="performance.id">
            <td>{{ performance.exam_title }}</td>
            <td>{{ performance.total_score }}</td>
            <td>{{ performance.total_exam }}</td>
            <td>{{ performance.status }}</td>
            <td>{{ formatDate(performance.start) }}</td>
       
          </tr>
        </tbody>
      </table>

      <p v-else class="text-center">No performance data available</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MySubjectPerformance',
  data() {
    return {
      subject: {
        subjectName: '',         // Maps to 'subject_name' from backend
        classDescription: '',    // Maps to 'class_description' from backend
        classGenCode: ''         // Maps to 'class_gen_code' from backend
      },
      performances: [],           // To store the performance list
      error: ''                   // To store any error messages
    };
  },
  methods: {
    async fetchSubjectAndPerformances() {
      const classId = this.$route.params.class_id;
      const token = localStorage.getItem('token');

      try {
        // Fetching subject details
        const subjectResponse = await axios.get(`http://localhost:8000/api/classroom/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (subjectResponse.data) {
          this.subject.subjectName = subjectResponse.data.subject_name;
          this.subject.classDescription = subjectResponse.data.class_description;
          this.subject.classGenCode = subjectResponse.data.class_gen_code;
        } else {
          this.error = 'Class details not found';
          return;
        }
        
        // Fetching performance data
        const performancesResponse = await axios.get(`http://localhost:8000/api/getResultsallexam`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
          params: {
            classtable_id: classId // Send classtable_id as a query parameter
          }
        });
        console.log('Performances Response:', performancesResponse.data);

        if (performancesResponse.data) {
          this.performances = performancesResponse.data; // Assuming backend returns the results array
        } else {
          this.error = 'No performance data found';
          
        }
      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Error fetching subject and performance details';
      }
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    }
  },
  created() {
    this.fetchSubjectAndPerformances(); // Fetch data when component is created
  }
};
</script>

<style scoped>
/* Main Container */
.main-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
}

/* Subject Info Container */
.subject-info-container {
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  margin-right: 20px;
}

.subject-info {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.subject-info:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.subject-info h2 {
  font-size: 1.75rem;
  color: #212529;
  font-weight: bold;
  margin-bottom: 10px;
}

.subject-info p {
  font-size: 1.1rem;
  color: #495057;
}

/* Navigation Bar */
.nav {
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 10px;
  gap: 10px;
}

.nav-link {
  color: #343a40 !important;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  background-color: #007bff;
  color: white !important;
}

.router-link-active {
  color: #007bff !important;
  background-color: #e9f5ff;
  padding: 10px 15px;
  border-radius: 5px;
}

/* Performance Table */
.table {
  margin-top: 20px;
}

.table th, .table td {
  text-align: center;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

/* Error Alert */
.alert {
  margin-top: 20px;
  border-radius: 15px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8d7da;
  color: #721c24;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    gap: 10px;
  }

  .nav {
    flex-direction: row;
    justify-content: space-between;
  }

  .nav-link {
    padding: 8px 10px;
  }
}
</style>
