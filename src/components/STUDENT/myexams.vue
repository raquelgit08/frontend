<template>
  <div class="container-fluid">
    <!-- Subject Information Display -->
    <div class="subject-info-container d-flex justify-content-between">
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
      
      <router-link :to="`/mysubjectperformance/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-activity fs-4"></i> My Performance 
      </router-link>

      <div class="status ms-auto d-flex align-items-center">
        <div class="mx-3">
          <i class="bi bi-check-circle-fill text-success"></i> Finished: {{ totals.number_of_finished_exams }}
        </div>
        <div class="mx-3">
          <i class="bi bi-x-circle-fill text-danger"></i> Missing: {{ totals.total_missing }}
        </div>
        <div class="mx-3">
          <i class="bi bi-hourglass-split text-warning"></i> Pending: {{ totals.total_pending }}
        </div>
      </div>
    </nav>

    <!-- Published Exams List -->
    <div class="container-fluid" style="margin-top: 20px;">
      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger text-center">
        {{ error }} 
      </div>

      <!-- Published Exams Cards -->
      <div class="row g-4" v-if="exams.length">
        <div class="col-md-4" v-for="exam in exams" :key="exam.id">
          <div class="card h-100 shadow-sm exam-card" :class="{ 'unavailable-card': !isExamAvailable(exam),  'Pasado': exam.status === 'Passed' }" @click="viewExam(exam)">
            <div class="card-body">
              <h5 class="card-title">{{ exam.title }} <b>({{ exam.points_exam}} point/s)</b></h5>
              <div class="row">
                <div class="col-8">
                  <strong>Status: {{ exam.status }} -</strong>
                  <span v-if="isExamAvailable(exam)" class="status-available">Available</span>
                  <span v-else class="status-unavailable">Unavailable</span>
                  <br>
                  <strong>NO. of QUESTIONS: {{ exam.total_questions }}</strong><br>
                  <strong>Due Date: {{ formatDateTime(exam.end) }}</strong>
                </div>
                <div class="col-4 score-right">
                  <strong>{{ exam.total_score }} / {{ exam.points_exam }} </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-else class="text-center no-exams-message">No exams available</p>
    </div>

    <!-- Exam Details Modal -->
    <div v-if="showModal" class="modal-backdrop" @click="closeModal">
      <div class="modal-content shadow-lg" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">{{ modalExam.title }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p><b>Instruction/s: </b>{{ instructions?.instruction || 'No instructions available' }}</p>
          <p><strong>Quarter:</strong> {{ modalExam.quarter }}</p>
          <p><strong>Start Date:</strong> {{ formatDateTime(modalExam.start) }}</p>
          <p><strong>End Date:</strong> {{ formatDateTime(modalExam.end) }}</p>
          <p><strong>Status:</strong> {{ modalExam.originalExam.status }}</p>
          <p><strong>SCORE : {{ modalExam.originalExam.total_score }} / {{ modalExam.originalExam.points_exam}}</strong></p>
          <p><i>You score is {{ modalExam.originalExam.average }}%  of the total score {{ modalExam.originalExam.points_exam}} points</i></p>
          <p v-if="modalExam.description"><strong>Description:</strong> {{ modalExam.description }}</p>
        </div>
        <div class="modal-footer">
          <button v-if="modalExam.originalExam.status === 'Pending'" @click="takeExam(modalExam.id)" class="btn btn-success">
            Take Exam
          </button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MyExams',
  data() {
    return {
      subject: {
        subjectName: '',
        classDescription: '',
        classGenCode: ''
      },
      exams: [], // List of exams
      totals: {
        number_of_finished_exams: 0,
        total_missing: 0,
        total_pending: 0
      },
      modalExam: {},
      error: '',
      showModal: false
    };
  },
  methods: {
    // Fetch the subject and exams from the backend
    async fetchSubjectAndExams() {
      const classId = this.$route.params.class_id;
      const token = localStorage.getItem('token');

      try {
        // Fetch subject info
        const subjectResponse = await axios.get(`http://localhost:8000/api/classroom/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Subject Response:', subjectResponse.data); // Log subject response
        this.subject = {
          subjectName: subjectResponse.data.subject_name,
          classDescription: subjectResponse.data.class_description,
          classGenCode: subjectResponse.data.class_gen_code,
          class_semester: subjectResponse.data.class_semester,
          class_addyear: subjectResponse.data.class_addyear,
          teacher_fname: subjectResponse.data.teacher_fname,
          teacher_lname : subjectResponse.data.teacher_lname,
          teacher_mname: subjectResponse.data.teacher_mname,

        };

        // Fetch published exams for the class
        const examsResponse = await axios.get(`http://localhost:8000/api/tblclass/${classId}/exams2`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Exams Response:', examsResponse.data);
        this.exams = examsResponse.data.exams;  // Published exams
        this.totals = examsResponse.data.totals;  // Totals (finished, missing, pending)

      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Error fetching subject and exams';
      }
    },

    // Check if an exam is available for the student
    isExamAvailable(exam) {
      const now = new Date();
      const startDate = new Date(exam.start);
      const endDate = new Date(exam.end);
      return now >= startDate && now <= endDate && exam.status === 'Pending';
    },

    // Navigate to the exam-taking page
    takeExam(examId) {
      this.closeModal(); // Close modal before navigating
      this.$router.push(`/examtakingpage/${examId}`);
    },

    // View exam details in a modal
    async viewExam(exam) {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:8000/api/viewExam2updated2/${exam.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.modalExam = {
            ...response.data.exam,
            originalExam: exam, // Keep reference to the original exam
        };
        this.instructions = response.data.exam.instructions; 
        this.showModal = true;
      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Error fetching exam details';
      }
    },

    // Format date and time for display
    formatDateTime(dateTime) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateTime).toLocaleString(undefined, options);
    },

    // Close modal
    closeModal() {
      this.showModal = false;
    }
  },

  created() {
    this.fetchSubjectAndExams();  // Fetch data on component creation
  }
};
</script>

<style scoped>
.subject-info-container {
  background-color: #EEEDED;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  height: 150px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
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

.nav-link {
  color: #000000;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  background-color: #007bff;
  color: white !important;
}

.exam-card {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); 
  border: 2px solid #05870e; 
  padding: 5px; 
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.exam-card:hover {
  transform: scale(1.05);
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.status-available {
  color: green;
}

.status-unavailable {
  color: red;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.unavailable-card {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); 
  border: 2px solid rgb(155, 154, 154);
  background-color: rgba(211, 205, 205, 0.445); 
  padding: 5px; 
  border-radius: 8px;
}
.Pasado{
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); 
  border: 2px solid rgb(2, 151, 2);
  background-color: rgba(144, 214, 137, 0.445); 
  padding: 5px; 
  border-radius: 8px;
}
.score-right {
  border: 2px solid #03730c;
  padding: 10px; 
  text-align: right;
  border-radius: 10px; 
  height: 50px;
  background-color: #fcfffc;
}

</style>
