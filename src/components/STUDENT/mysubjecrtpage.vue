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
      <!---<router-link :to="`/myItemAnalysis/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-bar-chart-line fs-4"></i> Item Analysis
      </router-link> -->
      <router-link :to="`/mysubjectperformance/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-activity fs-4"></i> Subject Performance 
      </router-link>
     <!-- <router-link :to="`/mysubjectperformance/${$route.params.class_id}`" class="nav-link">
        <i class="bi bi-person-lines-fill fs-4"></i> Students
      </router-link> -->
    </nav>

    <!-- Subject Page Content -->
    <div class="subject-page container mt-5">
      <h5 class="text-center">Dashboard</h5>

      <!-- Error Handling -->
      <div v-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MySubjectPages',
  data() {
    return {
      subject: {
        subjectName: '',         // Maps to 'subject_name' from backend
        classDescription: '',    // Maps to 'class_description' from backend
        classGenCode: ''         // Maps to 'class_gen_code' from backend
      },
      error: ''
    };
  },
  methods: {
    async fetchSubject() {
      const classId = this.$route.params.class_id;
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:8000/api/classroom/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Response to this subject received:', response.data);
        if (response.data) {
          // Map the backend response to the frontend's subject object
          this.subject.subjectName = response.data.subject_name;
          this.subject.classDescription = response.data.class_description;
          this.subject.classGenCode = response.data.class_gen_code;
        } else {
          this.error = 'Class details not found';
        }
      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Error fetching subject details';
      }
    }
  },
  created() {
    this.fetchSubject();  // Call the method when the component is created
  }
};
</script>



<style scoped>
/* Main Container */
.main-container {
  display: flex;
  align-items: flex-start; /* Align items at the start for better structure */
  justify-content: space-between;
  flex-wrap: wrap; /* Ensure responsiveness on smaller screens */
  padding: 20px; /* Add padding to the main container */
  gap: 20px; /* Add spacing between the subject info and navigation */
}

/* Subject Info Container */
.subject-info-container {
  flex: 1;
  min-width: 250px; /* Ensure a minimum width for smaller screens */
  max-width: 350px; /* Limit the maximum width */
  margin-right: 20px; /* Add more space to the right */
}

.subject-info {
  padding: 20px;
  background-color: #f8f9fa; /* Lighter background color */
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Increase shadow depth for better distinction */
  transition: box-shadow 0.3s ease;
}

.subject-info:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15); /* Hover effect for better interactivity */
}

.subject-info h2 {
  font-size: 1.75rem;
  color: #212529; /* Slightly darker color for better readability */
  font-weight: bold;
  margin-bottom: 10px;
}

.subject-info p {
  font-size: 1.1rem;
  color: #495057; /* Softer gray for better readability */
}

/* Navigation Bar */
.nav {
  flex: 2;
  display: flex;
  flex-wrap: wrap; /* Ensure items wrap on smaller screens */
  background-color: #ffffff;
  justify-content: center; /* Center nav items for balance */
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Increase shadow depth */
  padding: 15px;
  border-radius: 10px;
  gap: 10px; /* Add spacing between the nav items */
}

.nav-link {
  color: #343a40 !important;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 15px; /* Add padding for better spacing */
  border-radius: 5px; /* Add rounded corners */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  background-color: #007bff;
  color: white !important; /* Change text color to white on hover */
}

.router-link-active {
  color: #007bff !important;
  border-bottom: none; /* Remove the border-bottom and rely on color change */
  background-color: #e9f5ff; /* Subtle background change for active links */
  padding: 10px 15px; /* Keep padding consistent */
  border-radius: 5px;
}

/* Dashboard Title */
.subject-page h5 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #212529;
  letter-spacing: 1px;
  margin-bottom: 40px;
  margin-top: 20px;
  text-align: center;
}

/* Alert Styling */
.alert {
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
    flex-direction: column; /* Stack the containers vertically */
    gap: 10px; /* Reduce the gap for smaller screens */
  }

  .nav {
    flex-direction: row;
    justify-content: space-between; /* Align the links across the container */
  }

  .nav-link {
    padding: 8px 10px; /* Adjust padding for smaller screens */
  }
  
}


</style>
