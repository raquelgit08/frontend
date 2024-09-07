<template>
  <div class="container">
    <div class="main-container">
      <div class="subject-info-container">
        <div v-if="subject.subjectName" class="subject-info">
          <h2>{{ subject.subjectName }}</h2>
          <p>{{ subject.semester }} | {{ subject.schoolYear }}</p>
        </div>
      </div>

      <nav class="nav nav-pills">
        <router-link to="/teacheraddsubject" class="nav-link">
          <span><i class="bi bi-arrow-left fs-4"></i></span>
        </router-link>
        <router-link :to="`/subject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
        <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link">Exams</router-link>
        <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
        <router-link :to="`/ItemAnalysis/${$route.params.class_id}`" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link>
        <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
        <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
        <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
      </nav>
    </div>

    <div class="exam-list mt-4">
      <h2 class="text-center">Examinations</h2>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Quarter</th>
            <th>Start Date & Time</th>
            <th>End Date & Time</th>
            <th>Total Questions</th>
            <th>Total Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in exams" :key="exam.id">
            <td>{{ exam.title }}</td>
            <td>{{ exam.quarter }}</td>
            <td>{{ exam.start }}</td>
            <td>{{ exam.end }}</td>
            <td>{{ exam.total_questions }}</td>
            <td>{{ exam.total_points }}</td>
            <td>
              <button @click="viewExam(exam.id)" class="btn btn-info btn-sm me-2">View</button>
              <button @click="editExam(exam.id)" class="btn btn-warning btn-sm me-2">Edit</button>
              <button @click="archiveExam(exam.id)" class="btn btn-danger btn-sm me-2">Archive</button>
              <button @click="publishExam(exam.id)" class="btn btn-success btn-sm">Publish</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="navigateToAddExam" class="btn btn-primary mt-3 w-100">Add Exam</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

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
        const response = await axios.get(`http://localhost:8000/api/tblclass/${classId}/exams`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.exams = response.data.exams.map(exam => ({
          ...exam,
          total_questions: exam.total_questions || 0,
          total_points: exam.total_points || 0,
        }));
      } catch (error) {
        console.error('Failed to fetch exams:', error.message);
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
      } catch (error) {
        console.error('Error fetching subject:', error);
      }
    },
    navigateToAddExam() {
      this.$router.push(`/teacherAddExam/${this.$route.params.class_id}`);
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
    await axios.patch(`http://localhost:8000/api/exam/${examId}/publish`, {}, {
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

    // Optionally update the local list to reflect the published status
    const updatedExam = this.exams.find(exam => exam.id === examId);
    if (updatedExam) {
      updatedExam.is_published = true;
    }

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
}
}

};
</script>

<style scoped>
/* Style for the exam list */
.main-container {
  display: flex;
  justify-content: space-between;
}

.subject-info-container {
  flex: 1;
  max-width: 300px;
}

.nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.exam-list {
  margin-top: 20px;
}

.table-hover {
  width: 100%;
}
</style>
