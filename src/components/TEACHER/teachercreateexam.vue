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
      <!-- <router-link :to="`/ItemAnalysis/${$route.params.class_id}`" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link> -->
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
    </nav>
  </div>

  <div class="container-fluid">
    <h2 class="text-center">Examinations</h2>

    <!-- Search Bar and Exam Schedule Button -->
    <div class="d-flex justify-content-between mb-3">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Search Exam..."
        class="form-control w-50"
        @input="filterExams"
      />
      <button @click="showModalHandler" class="btn btn-primary">Exam Schedule</button>
    </div>

    <div class="table-wrapper">
      <table class="table table-hover table-custom">
        <thead class="table-info">
          <tr>
            <th style="width: 4%">#</th>
            <th style="width: 15%">Title</th>
            <th style="width: 9%">Quarter</th>
            <th style="width: 8%">Start Date</th>
            <th style="width: 8%">Start Time</th>
            <th style="width: 8%">End Date</th>
            <th style="width: 8%">End Time</th>
            <th style="width: 8%">Total Questions</th>
            <th style="width: 8%">Total Points</th>
            <th style="width: 8%">No. of Response</th>
            <th style="width: 8%">Average Score</th>
            <th style="width: 14%">Actions</th>
            <th style="width: 14%">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(exam, index) in filteredExams" :key="exam.id">
            <td>{{ index + 1 }}</td>
            <td>{{ exam.title }}</td>
            <td>{{ exam.quarter }}</td>
            <td>{{ formatDate(exam.start) }}</td>
            <td>{{ formatTime(exam.start) }}</td>
            <td>{{ formatDate(exam.end) }}</td>
            <td>{{ formatTime(exam.end) }}</td>
            <td>{{ exam.totalQuestions }}</td>
            <td>{{ exam.points_exam }}</td>
            <td></td>
            <td></td>
            <td>
              <div class="d-flex justify-content-center">
                <button @click="publishExam(exam.id)" class="btn btn-success btn-sm me-2" v-if="!exam.isPublished">Publish</button>
                <button @click="navigateToAddExam(exam.id)" class="btn btn-info btn-sm me-2">View</button>
                <button @click="confirmArchive(exam.id)" class="btn btn-danger btn-sm">Archive</button>
              </div>
            </td>
            <td>
              <span v-if="exam.isPublished" class="badge bg-success">Published</span>
              <span v-else class="badge bg-warning">Not Published</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal for Creating Exam Details -->
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
              <input type="text" id="exam-title" v-model="examTitle" class="form-control" required />
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
                <input type="text" id="exam_points" v-model="points_exam" class="form-control" required />
              </div>
            </div>

            <!-- Start Date and Time -->
            <div class="row mb-3">
              <div class="col">
                <label for="start-date" class="form-label">Start Date</label>
                <input type="date" id="start-date" v-model="startDate" class="form-control" required />
              </div>
              <div class="col">
                <label for="start-time" class="form-label">Start Time</label>
                <input type="time" id="start-time" v-model="startTime" class="form-control" required />
              </div>
            </div>

            <!-- End Date and Time -->
            <div class="row mb-3">
              <div class="col">
                <label for="end-date" class="form-label">End Date</label>
                <input type="date" id="end-date" v-model="endDate" class="form-control" required />
              </div>
              <div class="col">
                <label for="end-time" class="form-label">End Time</label>
                <input type="time" id="end-time" v-model="endTime" class="form-control" required />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Close</button>
          <button type="button" class="btn btn-primary" @click="saveChanges">SAVE RECORD</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';

export default {
  name: 'TeacherCreateExams',
  data() {
    return {
      exams: [],
      filteredExams: [],
      searchTerm: '',
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: '',
      },
      examTitle: '',
      selectedQuarter: '1st Quarter',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      points_exam: '',
      isModalVisible: false,
      classtable_id: '',
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
        this.exams = response.data.exams.map(exam => ({
          ...exam,
          isPublished: exam.isPublished || false, // Ensure isPublished is part of each exam
        }));
        this.filteredExams = this.exams;
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
        this.classtable_id = response.data.class.id;
      } catch (error) {
        console.error('Error fetching subject:', error);
      }
    },
    async publishExam(examId) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:8000/api/exams/publish2/${examId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Find the published exam and update its status in the exams array
        const updatedExam = this.exams.find(exam => exam.id === examId);
        if (updatedExam) {
          updatedExam.isPublished = true;
        }
        
        Swal.fire('Success', 'Exam published successfully!', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to publish the exam. Please try again.', 'error');
        console.error('Failed to publish exam:', error.message);
      }
    },
    filterExams() {
      this.filteredExams = this.exams.filter((exam) =>
        exam.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    navigateToAddExam(examId) {
      this.$router.push(`/AddExam/${examId}`);
    },
    showModalHandler() {
      this.isModalVisible = true;
    },
    async archiveExam(examId) {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:8000/api/exam/${examId}/archive`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.exams = this.exams.filter((exam) => exam.id !== examId);
        this.filteredExams = this.filteredExams.filter((exam) => exam.id !== examId);
        Swal.fire('Archived!', 'The exam has been archived.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to archive the exam. Please try again.', 'error');
        console.error('Failed to archive exam:', error.message);
      }
    },
    confirmArchive(examId) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, archive it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.archiveExam(examId);
        }
      });
    },
    saveChanges() {
      if (!this.examTitle || !this.startDate || !this.startTime || !this.endDate || !this.endTime || !this.points_exam) {
        Swal.fire('Error!', 'Please fill in all the required fields.', 'error');
        return;
      }
      const startDateTime = moment(`${this.startDate} ${this.startTime}`).format('YYYY-MM-DD HH:mm:ss');
      const endDateTime = moment(`${this.endDate} ${this.endTime}`).format('YYYY-MM-DD HH:mm:ss');

      axios
        .post(
          'http://localhost:8000/api/createExam',
          {
            classtable_id: this.classtable_id,
            title: this.examTitle,
            quarter: this.selectedQuarter,
            start: startDateTime,
            end: endDateTime,
            points_exam: this.points_exam,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          this.isModalVisible = false;
          const examId = response.data.exam.id;
          this.$router.push(`/AddExam/${examId}`);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    formatDate(dateTime) {
      return moment(dateTime).format('MM/DD/YYYY');
    },
    formatTime(dateTime) {
      return moment(dateTime).format('hh:mm A');
    },
  },
};
</script>

<style scoped>
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
.container-fluid{
  margin-top: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
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
  border-bottom: 1px solid #dee2e6;
}

.table-custom tbody tr:hover {
  background-color: #f1f3f5;
}

.table-custom tbody tr {
  transition: background-color 0.3s ease;
}

.d-flex .btn {
  min-width: 80px;
  transition: background-color 0.3s ease;
}

.d-flex .btn:hover {
  background-color: #007bff;
  color: white;
}

</style>
