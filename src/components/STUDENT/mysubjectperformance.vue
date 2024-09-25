<template>
  <div class="container-fluid">
    <!-- Subject Information Display -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2 class="subject-title">{{ subject.subjectName }}</h2>
        <p class="subject-description">Description: {{ subject.classDescription }}</p>
        <p class="class-code">
        Class Code: <span>{{ subject.classGenCode }}</span> | {{ subject.class_semester }} Semester S.Y: {{ subject.class_addyear }}
      </p>
      <p>Teacher: {{ subject.teacher_fname }} {{ subject.teacher_mname }} {{ subject.teacher_lname }}</p>
      </div>
    </div>

    <!-- Navigation Bar Positioned Next to Subject Info -->
    <nav class="nav nav-pills">
      <router-link to="/Saddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4"></i></span> Back to Classes
      </router-link>
     
      <router-link :to="`/myExams/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-file-earmark-plus fs-4"></i> Examinations
      </router-link>
      <!-- <router-link :to="`/myfeedbacks/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-chat-dots fs-4"></i> Feedback
      </router-link> -->
      <router-link :to="`/mysubjectperformance/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-activity fs-4"></i> My Performance 
      </router-link>

      <div class="col-md-2 d-flex align-items-center">
          <select v-model="selectedGender"  class="form-control custom-select"  id="gender">
            <option v-for="type in gender" :key="type" :value="type">{{ type }}</option>
          </select>
        </div> 
      <div class="status ms-auto d-flex align-items-center">
        <div class="mx-3">
          <i class="bi bi-check-circle-fill text-success"></i> Passed: {{ passCount }}
        </div>
        <div class="mx-3">
          <i class="bi bi-x-circle-fill text-danger"></i> Failed: {{ failCount }}
        </div>
       
      </div>

    </nav>

    <!-- Published Exams List -->
    <div class="cointainer-fluid" style="margin-top: 20px;">
     

      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <!-- Performance Table -->
       <div class="table-wrapper">
        <table class="table table-hover table-custom" v-if="performances.length">
          <thead>
            <tr>
              <th>#</th>
              <th>Quarterly Examinations</th>
              <th>Total Points</th>
              <th>Percentage</th>
              <th>Remarks</th>
              <th>Date Taken</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(performance, index) in filteredPerformances" :key="performance.id">
              <td>{{ index + 1 }}</td> <!-- Add numbering here -->
              <td style="text-align: start;">{{ performance.exam_title }}</td>
              <td>{{ performance.total_score }} / {{ performance.total_exam }}</td>
              <td :class="{ 'text-success': performance.average >= 50}"> <b>{{ performance.average }} % </b></td>
              <td :class="{ 'text-danger': performance.status === 'Failed' }">
                {{ performance.status }}
              </td>

              <td>{{ formatDate(performance.start) }}</td>
            </tr>
          </tbody>
        </table>
      <p style="text-align: center;">. . . . . . . . . . . . . . . . .   Nothing   Follows . . . . . . . . . . . . . . . </p>
       </div>
      <!-- <p v-else class="text-center no-exams-message">No performace yet </p> -->
    </div>

 
  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';

export default {
  name: 'MySubjectPerformance',
  data() {
    return {
      subject: {
        subjectName: '',         // Maps to 'subject_name' from backend
        classDescription: '',    // Maps to 'class_description' from backend
        classGenCode: ''         // Maps to 'class_gen_code' from backend
      },
      selectedGender: 'Filter By Status',
      gender: ['Filter By Status', 'Passed', 'Failed'],
      performances: [],           // To store the performance list
      error: ''                   // To store any error messages
    };
  },
  computed: {
    filteredPerformances() {
      if (this.selectedGender === 'Passed') {
        return this.performances.filter(performance => performance.status === 'Passed');
      } else if (this.selectedGender === 'Failed') {
        return this.performances.filter(performance => performance.status === 'Failed');
      }
      return this.performances; // Default: return all performances
    }
  },
  methods: {
    async fetchSubjectAndPerformances() {
      const classId = this.$route.params.class_id;
      const token = localStorage.getItem('token');

      try {
        // Fetching subject details
        const subjectResponse = await axios.get(`${config.apiBaseURL}/classroom/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (subjectResponse.data) {
          this.subject.subjectName = subjectResponse.data.subject_name;
          this.subject.classDescription = subjectResponse.data.class_description;
          this.subject.classGenCode = subjectResponse.data.class_gen_code;
          this.subject.class_semester = subjectResponse.data.class_semester,
          this.subject.class_addyear = subjectResponse.data.class_addyear,
          this.subject.teacher_fname = subjectResponse.data.teacher_fname,
          this.subject.teacher_lname = subjectResponse.data.teacher_lname,
          this. subject.teacher_mname = subjectResponse.data.teacher_mname
        } else {
          this.error = 'Class details not found';
          return;
        }
        
        // Fetching performance data
        const performancesResponse = await axios.get(`${config.apiBaseURL}/getResultsallexam`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
          params: {
            classtable_id: classId // Send classtable_id as a query parameter
          }
        });
        console.log('Performances Response:', performancesResponse.data);

        // if (performancesResponse.data) {
        //   this.performances = performancesResponse.data; // Assuming backend returns the results array
        // } else {
        //   this.error = 'No performance data found';
          
        // }
        if (performancesResponse.data) {
          this.performances = performancesResponse.data;

          // Count passes and fails
          this.passCount = this.performances.filter(performance => performance.status === 'Passed').length;
          this.failCount = this.performances.filter(performance => performance.status === 'Failed').length;
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
.nav , .subject-info-container , .table-wrapper{
  margin-left: 20px;
}


.subject-info-container {
  background-color: #EEEDED;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;

  height: 150px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
.nav , .subject-info-container{
  margin-left: 20px;
}
.container-fluid{
  margin-left: 15px;
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

.class-code span {
  color: #007bff;
  font-weight: 800;
}

.nav {
  flex-wrap: wrap;
  gap: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 10px;
}

.class-code span {
  color: #007bff;
  font-weight: 800;
}


.nav-link {
  color: #000000;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover :active {
  background-color: #007bff;
  color: white !important;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
}



.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
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


.table-wrapper {
  overflow-x: auto;
  }

  /* Table Styles */
  .table-custom {
    background-color: #ffffff;
    border-radius: 8px;
    font-size: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* border: 1px solid #200909; */
    overflow: hidden;
  }

  .table-custom th {
    background-color: #0d8eead7;
    color: #ffffff;
    font-weight: 700;
    font-size: 20px;
  }
  
  .table th, .table td {
    text-align: center;
    vertical-align: middle;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .td{
    font-size: 19px;
  }

  .table-custom tbody tr:hover {
    background-color: #f1f3f5;
  }

  .table-custom tbody tr {
    transition: background-color 0.3s ease;
  }
  .router-link-active {
    color: #007bff !important;
    border-bottom: 2px solid #007bff;
  }
</style>
