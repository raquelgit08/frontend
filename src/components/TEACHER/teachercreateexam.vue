<template>
  <div class="main-container">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2>{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} Semester | {{ subject.schoolYear }}</p>
      </div>
    </div>

    <!-- Navigation Bar Positioned Next to Subject Info -->
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

    <div class="container-fluid">
      <h2 class="text-center">Examinations</h2>
      
      <div class="table-wrapper">
        <button @click="navigateToAddExam" class="btn btn-primary mt-3 mr-0">Add Exam</button>
        <button @click="showModalHandler" class="btn btn-primary mt-3 mr-0">Test Details</button>
        <!-- <button @click="navigateToAddExam" class="btn btn-primary mt-3 w-80">Add Exam</button> -->
        <table class="table table-hover table-custom">
          <thead class="table-info">
            <tr>
              <th style="width: 4%">#</th>
              <th style="width: 15%">Title</th>
              <th style="width: 9%">Quarter</th>
              <th style="width: 12%">Start Date & Time</th>
              <th style="width: 12%">End Date & Time</th>
              <th style="width: 8%">Total Questions</th>
              <th style="width: 8%">Total Points</th>
              <th style="width: 8%">No. of Response</th>
              <th style="width: 8%">Average Score</th>
              <th style="width: 14%">Actions</th>
            </tr>
          </thead>
          <tbody>
              <tr v-for="(exam, index) in exams" :key="exam.id">
                <td>{{ index + 1 }}</td>
                <td>{{ exam.title }}</td>
                <td>{{ exam.quarter }}</td>
                <td>{{ exam.start }}</td>
                <td>{{ exam.end }}</td>
                <td></td> 
                <td>{{ exam.points_exam }}</td>
                <td></td> 
                <td></td> 
                <td>
                  <button @click="navigateToAddExam(exam.id)" class="btn btn-info btn-sm me-2">View</button>
                <!-- <button @click="viewExam(exam.id)" class="btn btn-info btn-sm me-2">View</button> -->
                <!-- <button @click="editExam(exam.id)" class="btn btn-warning btn-sm me-2">Edit</button> -->
                <button @click="archiveExam(exam.id)" class="btn btn-danger btn-sm me-2">Archive</button>
                <!-- <button @click="publishExam(exam.id)" class="btn btn-success btn-sm">Publish</button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
    <div v-if="isModalVisible" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create Exam Details</h5>
          <button type="button" class="btn-close" @click="isModalVisible = false" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form @submit.prevent="submitExam">
              <!-- Exam Title -->
              <div class="mb-3">
                <label for="exam-title" class="form-label">Exam Title</label>
                <input type="text"  id="exam-title" v-model="examTitle" class="form-control" required />
              </div>

              <div class="row">
                <div class="col-6">
                  <!-- Quarter Selection -->
                  <div class="mb-3">
                    <label for="quarter" class="form-label">Quarter</label>
                    <select id="quarter" v-model="selectedQuarter" class="form-select">
                      <option value="1st Quarter">1st Quarter</option>
                      <option value="2nd Quarter">2nd Quarter</option>
                      <option value="3rd Quarter">3rd Quarter</option>
                      <option value="4th Quarter">4th Quarter</option>
                    </select>
                  </div>
                </div>
                <div class="col-6">
                <label for="points_exam" class="form-label">Max. Points</label>
                <input type="text"  id="exam_points" v-model="points_exam" class="form-control" required />
           
                </div>
              </div>

              <!-- Start and End Time -->
              <div class="row mb-3">
                <div class="col">
                  <label for="start-date" class="form-label">Start Date & Time</label>
                  <input type="datetime-local"  id="start-date"  v-model="startDateTime" class="form-control" required/>
                </div>
                <div class="col">
                  <label for="end-date" class="form-label">End Date & Time</label>
                  <input type="datetime-local" id="end-date" v-model="endDateTime" class="form-control" required />
                 </div>
              </div>
            </form>
          </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Close</button>
          <button type="button" class="btn btn-primary" @click="saveChanges">SAVE RECORD </button>
        </div>
      </div>
    </div>
    </div>

</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
export default {
  name: 'TeacherCreateExams',
  data() {
    return {
      exams: [],
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: '',
      },
      examTitle: '',
      selectedQuarter: '1st Quarter',
      startDateTime: '',
      endDateTime: '',
      examDetails: null,
      isModalVisible: false,
      classtable_id: '', // Add this property to store the classtable_id
    };
  },
  created() {
    this.fetchExams();
    this.fetchSubject();
  },
  methods: {
    async fetchExams() {
  try {
    const classId = this.$route.params.class_id;
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8000/api/getAllExamsByClass/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    this.exams = response.data.exams;
    console.log(this.exams); 
  } catch (error) {
    console.error('Error fetching exams:', error);
  }
},
    async fetchSubject() {
      try {
        const classId = this.$route.params.class_id;
        const token = localStorage.getItem('token');

        const response = await axios.get(`http://localhost:8000/api/class/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data.class || !response.data.class.subject.subjectname) {
          console.error('Class not found or you are not authorized to view this class.');
          return;
        }

        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
        this.classtable_id = response.data.class.id; // Store the classtable_id
      } catch (error) {
        console.error('Error fetching subject:', error);
      }
    },
    navigateToAddExam(examId) {
  this.$router.push(`/teacherAddExam/${examId}`);
},
    showModalHandler() {
      this.isModalVisible = true;
    },
    saveChanges() {
      const startDateTime = moment(this.startDateTime).format('YYYY-MM-DD HH:mm:ss');
      const endDateTime = moment(this.endDateTime).format('YYYY-MM-DD HH:mm:ss');

      axios.post('http://localhost:8000/api/createExam', {
        classtable_id: this.classtable_id,
        title: this.examTitle,
        quarter: this.selectedQuarter,
        start: startDateTime,
        end: endDateTime,
        points_exam: this.points_exam,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(response => {
        console.log(response.data);
        this.isModalVisible = false;
      })
      .catch(error => {
        console.error(error);
      });
    },
    viewExam(examId) {
      this.$router.push(`/viewExam/${examId}`);
    },
    editExam(examId) {
      this.$router.push(`/editExam/${examId}`);
    },
    async archiveExam(examId) {
      try {
        await axios.patch(`http://localhost:8000/api/exam/${examId}/archive`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.exams = this.exams.filter(exam => exam.id !== examId);
        alert('Exam archived successfully.');
      } catch (error) {
        console.error('Failed to archive exam:', error.message);
        alert('Failed to archive exam. Please try again later.');
      }
    },

    async publishExam(examId) {
      try {
        // Send POST request to publish exam
        await axios.post(`http://localhost:8000/api/exams/publish2/${examId}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // SweetAlert success message
        Swal.fire({
          title: 'Exam Published!',
          text: 'The exam has been successfully published and students have been notified via email.',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // Refresh exam list after publishing
        this.fetchExams();

      } catch (error) {
        let errorMessage = 'An error occurred while publishing the exam.';
        if (error.response && error.response.status === 404) {
          errorMessage = 'Exam not found.';
        } else if (error.response && error.response.status === 500) {
          errorMessage = 'Internal server error. Please try again later.';
        }
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    },
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  align-items: stretch; /* Ensure both containers stretch to the same height */
  justify-content: space-between; /* Space out the subject info and nav bar */

}

/* Subject Info Container */
.subject-info-container {
  flex: 1; /* Flex value of 1 to take equal height as the nav */
  max-width: 300px;
  margin-right: 10px;
  display: flex;
  align-items: center; /* Center the content vertically */
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
.container-fluid{
  margin-top: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

/* Navigation Bar */
.nav {
  flex: 2; /* Flex value of 2 to balance the nav width */
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  align-items: center; /* Ensure nav items are centered vertically */
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
/* Table Wrapper */
.table-wrapper {
  margin: 0 auto;
  padding: 0 15px;
  max-width: 100%;
  overflow-x: auto;
  
}

/* Table Styles */
.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(5, 4, 4, 0.1);
  border: 1px solid #200909;
  overflow: hidden;
}

.table-custom th {
  background-color: #0d8eead7;
  color: #000000;
  font-weight: 700;
}
.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

.table-custom tbody tr:hover {
  background-color: #f1f3f5;
}

.table-custom tbody tr {
  transition: background-color 0.3s ease;
}

</style>
