<template>
  <div class="container-fluid">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2 class="subject-title">{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} semester  | S.Y. :{{ subject.schoolYear }}</p>
        <p class="class-code">Class Code: <span>{{ subject.gen_code }}</span></p>
      </div>
    </div>

    <!-- Unified Navigation Bar -->
    <nav class="nav nav-pills">
      <router-link to="/teacheraddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-5">Go Back to Classes</i></span>
      </router-link>
      <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>

      <!-- <div class="status ms-auto d-flex align-items-center">
        <div class="mx-3">
          <i class="bi bi-check-circle-fill text-success"></i> Finish: {{ examData.finished_students }}
        </div>
        <div class="mx-3">
          <i class="bi bi-x-circle-fill text-danger"></i> Unfinish: {{ examData.unfinished_students }}
        </div>
       
      </div> -->
      <button @click="downloadExcel" class="btn btn-primary download-button">
      <i class="bi bi-file-earmark-arrow-down"></i> Download Exam Results
    </button>
    </nav>

    <div class="performance-page">
      <div class="container-fluid">
        

        <!-- Alert for Errors -->
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <!-- Grading Sheet -->
        <div v-if="results && Object.keys(results).length" class=" table-wrapper">
          <table class="table table-bordered table-hover table-custom">
            <thead>
              <!-- Main Header Row -->
              <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 100px;">LRN</th>
                <th>Student Name</th>
                <th>Sex</th>
                <th>Strand</th>

                <!-- Exam Title Headers with Tooltips -->
                <th v-for="(examData, examTitle) in results" :key="examTitle" style="width: 10%;">
                  <div :title="formatDateTime(examData.exam_results[0]?.exam_start)">
                    {{ examTitle }}
                  </div>
                </th>
              </tr>

            <!-- Sub-Header Row for Score, PS, WS under each Exam Title -->
              <tr>
                <th colspan="5" style="background-color: white;"></th> <!-- Empty space for non-exam columns -->
                <!-- Sub-Headers for each Exam Column -->
                <th v-for="(examData, examTitle) in results" :key="examTitle + '-subheader'">
                  <div style="display: flex; flex-direction: row; gap: 40px; padding-left: 10px; padding-right: 10px;">
                    <span>Score</span>
                    <span>PS</span>
                    <span>WS</span>
                  </div>
                </th>

               
              </tr>
            </thead>

            <tbody>
              <tr v-for="(student, index) in paginatedStudents" :key="student.lrn">
                <td>{{ index + 1 + (currentPage - 1) * studentsPerPage }}</td> <!-- Corrected numbering -->
                <td>{{ student.lrn }}</td>
                <td :style="{ width: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'start' }">
                  {{ student.Last_name }}, {{ student.First_name }} {{ student.Middle_i }}
                </td>
                <td style="width: 70px;">{{ student.sex}}</td>
                
                <td :style="{ width: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">{{ student.strand_name }}  {{ student.gradelevel_name }} - {{ student.section }}</td>
                
                <td v-for="(examData, examTitle) in results" :key="examTitle + student.lrn">
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center; ">
                    <!-- Total Score and Points Exam -->
                    <span>{{ student[examTitle]?.total_score || '-' }} / {{ examData.exam_results[0]?.points_exam }}</span>
                    <!-- PS (Percentage Score) -->
                    <span>{{ student[examTitle]?.ps || '-' }}</span>
                    <!-- WS (Weighted Score) -->
                    <span>{{ student[examTitle]?.ws || '-' }}</span>
                  </div>
                </td>


              </tr>
              <tr>
                <td colspan="5">
                  <strong>Exam Statistics</strong><br>
                  <small>Mean : </small> <br>
                  <small>Median : </small><br>
                  <small>Mode : </small><br>
                  <small>Range : </small>
                </td>
                <td v-for="(examData, examTitle) in results" :key="examTitle + '-statistics'">
                  <div>
                    <small> {{ examData.mean_score }}</small><br>
                    <small> {{ examData.median_score }}</small><br>
                    <small>{{ examData.mode_score }}</small><br>
                    <small> {{ examData.score_range }}</small>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>No results available.</p>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-controls">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';

export default {
  name: 'PerformancesTracking',
  data() {
    return {
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: '',
        gen_code: ''
      },
     
      results: {},
      examStatistics: {},
      error: '',
      percentageMultiplier: 0.30, // Default multiplier
      currentPage: 1, // Current page in the pagination
      studentsPerPage: 10 // Number of students per page
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.getFlattenResults().length / this.studentsPerPage);
    },
    paginatedStudents() {
      const start = (this.currentPage - 1) * this.studentsPerPage;
      const end = start + this.studentsPerPage;
      return this.getFlattenResults().slice(start, end);
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

        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
        this.subject.gen_code = response.data.class.gen_code;
      } catch (error) {
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

        const response = await axios.get(`${config.apiBaseURL}/getAllStudentResults?classtable_id=${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Student Results API Response:', response.data);

        if (response.data.results) {
          this.results = response.data.results;
          this.student_total_scores = response.data.student_total_scores;
          this.total_points_exam_across_all_exams = response.data.total_points_exam_across_all_exams; // New Assignment
          console.log('Fetched Student Results:', this.results);
        } else {
          this.error = 'No results found for this class.';
        }
      } catch (error) {
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
    async downloadExcel() {
  try {
    const classId = this.$route.params.class_id;
    const token = localStorage.getItem('token');

    // Trigger the download request with class_id from route params
    const response = await axios.get(`${config.apiBaseURL}/export_result`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob', // Important for downloading binary files
      params: {
        classtable_id: classId // Passing the class_id directly here
      }
    });

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `Student_Results_Class_${classId}.xlsx`;

    // Create a link element to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
    alert('An error occurred while downloading the file.');
  }
},
    getFlattenResults() {
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
              Middle_i: result.Middle_i,
              sex : result.sex,
              strand_name: result.strand_name,
              gradelevel_name : result.gradelevel_name,
              section: result.section,
              student_total_scores: 0,
              percentage: 0 // Initialize percentage

            };
            
            results.push(student);
          }
          student[examTitle] = {
          total_score: result.total_score || '0',
          ps: result.ps || '-',
          ws: result.ws || '-',
        };

        }
      }
      results.forEach(student => {
      if (this.total_points_exam_across_all_exams > 0) {
        student.percentage = ((student.student_total_scores / this.total_points_exam_across_all_exams) * this.percentageMultiplier * 100).toFixed(2);
      } else {
        student.percentage = '0.00';
      }
    });

    return results;
  },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  created() {
    this.fetchSubject();
    this.fetchStudentResults();
  }
};
</script>


<style scoped>
.subject-info-container {
  background-color: #EEEDED;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  height: 130px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.subject-title {
  font-size: 25px;
  margin-bottom: 10px;
  font-weight: 800;
  color: #333;
}

.class-code span {
  color: #007bff;
  font-weight: 800;
}
.btn {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  color: #120808;
  font-size: 17px;
  transition: background 0.3s ease;
  border-radius: 5px ;
  border-color: white;
height: 40px;
margin-left: 65px;
  background-color:  #B9EBC5; 
  width: 250px;
  text-align: center;
}

.nav {
  flex-wrap: wrap;
  gap: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 10px;
  margin-bottom: 15px;
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

.router-link-active {
  color: #007bff !important;
  border-bottom: 2px solid #007bff;
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
 
    max-width: 100%;
    overflow-x: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* Table Styles */
  .table-custom {
    background-color: #ffffff;
    border-radius: 8px;
    /* font-size: 20px; */
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    border: 1px solid #200909;
    overflow: hidden;
  }

  .table-custom th {
    background-color: #c1c1c1d7;
    color: #080606;
    font-weight: 700;
    font-size: 15px;
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
  .pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 70px;
}

.pagination-controls button {
  margin: 0 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-controls span {
  font-size: 16px;
  line-height: 32px;
}

</style>
