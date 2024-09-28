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
    </nav>
  </div>

  <div class="container-fluid">
    <!-- <h2 class="text-center">Examinations</h2> -->

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
            <th style="width: 14%">Title</th>
            <th style="width: 9%">Quarter</th>
            <th style="width: 8%">Start Date</th>
            <th style="width: 8%">Start Time</th>
            <th style="width: 8%">End Date</th>
            <th style="width: 8%">End Time</th>
            <th style="width: 10%">Total Points</th>
            <th style="width: 10%">No. of Response</th>
            <th style="width: 8%">Percentage</th>
            <th style="width: 12%">Actions</th>
            <th style="width: 12%">Status</th>
            <th></th>
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
            <td>{{ exam.points_exam }}</td>
            <td>{{ exam.students_completed }} / {{ exam.total_students }}</td>
            <td>{{ exam.completion_percentage }}</td>
            <td>
              <div class="d-flex justify-content-center">
                <button @click="navigateToAddExam(exam.exam_id)" class="btn btn-info btn-sm me-2">View</button>
              </div>
            </td>
            <td>
              <span v-if="isAvailable(exam.start, exam.end)" class="badge bg-success">Available</span>
              <span v-else class="badge bg-warning">Not Available</span>
            </td>
            <td><i class="bi bi-chevron-right" @click="editExam(exam)" style="cursor: pointer;"></i></td>
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
              <!-- Message to Students -->
              <div class="mb-3">
              <label for="message" class="form-label">Message to Students</label>
              <textarea id="message" v-model="examMessage" class="form-control" placeholder="Enter message to notify students about the exam schedule..." rows="4"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Close</button>
          <button type="button" class="btn btn-primary" @click="confirmSaveChanges">Assign to students</button>
        </div>
      </div>
    </div>
  </div>

   <!-- Modal for Editing Exam -->
   <div v-if="isEditModalVisible" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Exam Details</h5>
            <button type="button" class="btn-close" @click="isEditModalVisible = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateExams">
              <div class="mb-3">
                <label for="exam-title" class="form-label">Exam Title</label>
                <input type="text" id="exam-title" v-model="examTitle" class="form-control" required />
              </div>

              <div class="row">
                <div class="col-6 mb-3">
                  <label for="quarter" class="form-label">Quarter</label>
                  <select id="quarter" v-model="selectedQuarter" class="form-select">
                    <option value="1st Quarter">1st Quarter</option>
                    <option value="2nd Quarter">2nd Quarter</option>
                    <option value="3rd Quarter">3rd Quarter</option>
                    <option value="4th Quarter">4th Quarter</option>
                  </select>
                </div>
                <div class="col-6 mb-3">
                  <label for="points_exam" class="form-label">Max. Points</label>
                  <input type="number" id="points_exam" v-model="points_exam" class="form-control" required />
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
               <!-- Message to Students (in Edit Modal) -->
               <div class="mb-3">
                <label for="message" class="form-label">Message to Students</label>
                <textarea id="message" v-model="examMessage" class="form-control" placeholder="Edit the message to notify students about the exam schedule..." rows="4"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="isEditModalVisible = false">Close</button>
            <button type="button" class="btn btn-primary" @click="confirmUpdateExam">Update Exam</button> <!-- Call updateExam here -->
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import config from '@/config';

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
      examMessage: '', // The custom message for the students (added to edit and create modals)
      isEditModalVisible: false, // For Edit Modal Visibility
      selectedExamId: null, // To store selected exam ID for editing
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
        const response = await axios.get(`${config.apiBaseURL}/getAllExamsByClass/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.exams = response.data.exams;
        this.filteredExams = this.exams;
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    },
    async fetchSubject() {
      try {
        const classId = this.$route.params.class_id;
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiBaseURL}/class/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
        this.classtable_id = response.data.class.id;
        this.subject.gen_code = response.data.class.gen_code;
      } catch (error) {
        console.error('Error fetching subject:', error);
      }
    },
    isAvailable(start, end) {
      const now = moment();
      const startTime = moment(start);
      const endTime = moment(end);
      return now.isBetween(startTime, endTime);
    },
    async publishExam(examId) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${config.apiBaseURL}/exam/${examId}/publish`, {
          name: this.examMessage // Send the custom message to the backend
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Find the published exam and update its status in the exams array
        const updatedExam = this.exams.find(exam => exam.id === examId);
        if (updatedExam) {
          updatedExam.isPublished = true;
        }

        Swal.fire('Success', 'Exam has been assigned to students and the message has been sent.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to publish the exam. Please try again.', 'error');
        console.error('Failed to publish exam:', error.message);
      }
    },
    saveChanges() {
      if (!this.examTitle || !this.startDate || !this.startTime || !this.endDate || !this.endTime || !this.points_exam) {
        Swal.fire('Error!', 'Please fill in all the required fields.', 'error');
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to assign the exam to students. Please confirm.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, assign it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          const startDateTime = moment(`${this.startDate} ${this.startTime}`).format('YYYY-MM-DD HH:mm:ss');
          const endDateTime = moment(`${this.endDate} ${this.endTime}`).format('YYYY-MM-DD HH:mm:ss');

          axios
            .post(
              `${config.apiBaseURL}/createExam`,
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
              const examId = response.data.exam.id;
              this.publishExam(examId);
              this.isModalVisible = false;
              this.$router.push(`/AddExam/${examId}`);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    },
    confirmSaveChanges() {
      if (!this.examTitle || !this.startDate || !this.startTime || !this.endDate || !this.endTime || !this.points_exam) {
        Swal.fire('Error!', 'Please fill in all the required fields.', 'error');
        return;
      }
      this.saveChanges();
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
    formatDate(dateTime) {
      return moment(dateTime).format('MM/DD/YYYY');
    },
    formatTime(dateTime) {
      return moment(dateTime).format('hh:mm A');
    },
    editExam(exam) {
      console.log('Editing exam:', exam);
      this.selectedExamId = exam.exam_id;
      this.examTitle = exam.title;
      this.selectedQuarter = exam.quarter;
      this.startDate = moment(exam.start).format('YYYY-MM-DD');
      this.startTime = moment(exam.start).format('HH:mm');
      this.endDate = moment(exam.end).format('YYYY-MM-DD');
      this.endTime = moment(exam.end).format('HH:mm');
      this.points_exam = exam.points_exam;
      this.examMessage = exam.message || ''; // Load the existing message for the exam
      this.isEditModalVisible = true;
    },

    async updateExams() {
      if (!this.examTitle || !this.startDate || !this.startTime || !this.endDate || !this.endTime || !this.points_exam) {
        Swal.fire('Error!', 'Please fill in all the required fields.', 'error');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const payload = {
          classtable_id: this.classtable_id,
          title: this.examTitle,
          quarter: this.selectedQuarter,
          start: moment(`${this.startDate} ${this.startTime}`).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(`${this.endDate} ${this.endTime}`).format('YYYY-MM-DD HH:mm:ss'),
          points_exam: this.points_exam,
        };

         await axios.put(
          `${config.apiBaseURL}/updateQuestionsInExam/${this.selectedExamId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire('Success', 'Exam schedule updated successfully.', 'success');
        await this.fetchExams();
        this.isEditModalVisible = false;
        this.resetForm();
      } catch (error) {
        console.error('Error updating exam schedule:', error);
        Swal.fire('Error!', 'Failed to update the exam. Please try again.', 'error');
      }
    },

    confirmUpdateExam() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to update the exam details. Please confirm.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateExams();
        }
      });
    },

    resetForm() {
      this.examTitle = '';
      this.selectedQuarter = '1st Quarter';
      this.startDate = '';
      this.startTime = '';
      this.endDate = '';
      this.endTime = '';
      this.points_exam = '';
      this.examMessage = '';
    },
  },
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

.nav {
  flex-wrap: wrap;
  gap: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
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
.table th,
.table td {
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
