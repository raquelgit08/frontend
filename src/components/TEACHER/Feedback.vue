<template>
  <div class="container-fluid">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2 class="subject-title">{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} | {{ subject.schoolYear }}</p>
        <p class="class-code">Class Code: <span>{{ subject.gen_code }}</span></p>
      </div>
    </div>

    <!-- Unified Navigation Bar -->
    <nav class="nav nav-pills">
      <router-link to="/teacheraddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4">Go Back to Classes</i></span>
      </router-link>
      <router-link :to="`/teachercreateexam/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
    </nav>

    <!-- Feedback Page Content -->
    <div class="feedback-page">
      <div class="container-fluid">
 
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else>
          <div v-for="feedback in feedbacks" :key="feedback.title" class="feedback-box">
            <h6>{{ feedback.title }} </h6>
            <ul class="comments-list">
              <li v-if="feedback.comments === 'No comment'" class="comment-item">{{ feedback.comments }}</li>
              <li v-else v-for="comment in feedback.comments" :key="comment.student_id" class="comment-item">
                <i class="bi bi-chat-dots-fill me-2"></i>
                <strong>{{ comment.student_name }} {{ comment.fname }} {{ comment.mname }}</strong>: {{ comment.comment }}
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'FeedbacksofStudent',
  data() {
    return {
      selectedExam: null, // Store the selected exam here
      filteredExams: [],
      exams: [], // Add this line to initialize exams
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      feedbacks: [], // To store feedbacks from the API
      error: ''
    };
  },
  created() {
    this.fetchSubject(); // Fetch subject details when the component is created
    this.fetchExams();
    this.fetchComments();
  },
  methods: {
    async fetchSubject() {
      try {
        const classId = this.$route.params.class_id; // Get class_id from route params
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

        // Check if the response data structure is correct
        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        // Update subject details from the API response
        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
      } catch (error) {
        console.error('Error fetching subject:', error); // Log error to the console for debugging
        if (error.response) {
          if (error.response.status === 404) {
            this.error = 'Class not found or you are not authorized to view this class.';
          } else if (error.response.status === 403) {
            this.error = 'You are not authorized to view this class.';
          } else {
            this.error = error.response.data.message || 'Failed to fetch subject data. Please try again later.';
          }
        } else {
          this.error = 'Failed to fetch subject data. Please try again later.';
        }
      }
    },
    async fetchExams() {
      try {
        const classId = this.$route.params.class_id;
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/getAllExamsByClass/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched exams:', response.data.exams);
        this.exams = response.data.exams.map(exam => ({
          ...exam,
          isPublished: exam.isPublished || false, // Ensure isPublished is part of each exam
        }));
        this.filteredExams = this.exams;
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    },
    selectExam(exam) {
      // Handle exam selection
      this.selectedExam = exam;
      this.filterFeedbacksByExam(exam.id);
    },
    filterFeedbacksByExam(examId) {
      // Filter feedbacks based on selected exam
      this.filteredFeedbacks = this.feedbacks.filter(feedback => feedback.exam_id === examId);
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
    async fetchComments() {
      try {
        const classId = this.$route.params.class_id; // Get class_id from route params
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = 'Authorization token is missing. Please log in again.';
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/getComments`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            classtable_id: classId
          }
        });

        this.feedbacks = response.data.comments; // Set the comments data to the feedbacks array
      } catch (error) {
        this.handleError(error, 'Failed to fetch comments.');
      }
    },
    handleError(error, message) {
      console.error('Error:', error);
      if (error.response) {
        if (error.response.status === 404) {
          this.error = 'Resource not found.';
        } else if (error.response.status === 403) {
          this.error = 'You are not authorized to view this data.';
        } else {
          this.error = error.response.data.message || message;
        }
      } else {
        this.error = message;
      }
    },
    handleLogoutClick() {
      // Logout logic here
    },
    handleItemClick(path) {
      this.selectedItem = path;
    }
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

/* Feedback Box Styling */
.feedback-box {
  /* background-color: #f8f9fa; */
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.feedback-box h6 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.feedback-box ul {
  padding-left: 20px;
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

.comments-list {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}

.comment-item {
  flex: 1 1 calc(33.33% - 20px); /* Each comment takes up 1/3 of the row */
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px #000000;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.comment-item i {
  margin-right: 10px;
  color: #b6d9fe;
  
}

@media (max-width: 768px) {
  .comment-item {
    flex: 1 1 100%; /* On smaller screens, comments will take full width */
  }
}

</style> 