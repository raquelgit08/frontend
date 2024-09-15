<template>
    <div class="main-container">
    <!-- Subject Information Display on the Left -->
    <div class="subject-info-container">
      <div v-if="subject.subjectName" class="subject-info">
        <h2>{{ subject.subjectName }}</h2>
        <p>{{ subject.semester }} | {{ subject.schoolYear }}</p>
      </div>
    </div>

    <!-- Navigation Bar Positioned Next to Subject Info -->
    <nav class="nav nav-pills">
      <router-link to="/teacheraddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4"></i></span>
      </router-link>
      <router-link :to="`/subject/${$route.params.class_id}`" class="nav-link">Dashboard</router-link>
      <router-link :to="`/AddExam/${$route.params.class_id}`" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i> Exams</router-link>
      <router-link :to="`/Feedback/${$route.params.class_id}`" class="nav-link"><i class="bi bi-chat-dots fs-4"></i> Feedback</router-link>
      <!-- <router-link :to="`/ItemAnalysis/${$route.params.class_id}`" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i> Item Analysis</router-link> -->
      <router-link :to="`/PerformanceTracking/${$route.params.class_id}`" class="nav-link"><i class="bi bi-activity fs-4"></i> Performance Tracking</router-link>
      <router-link :to="`/studentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> Students</router-link>
      <router-link :to="`/pendingstudentslist/${$route.params.class_id}`" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
        </nav>
      </div>

              <!-- Subject Page Content -->
      <div class="subject-page container mt-5">
        <h5 class="text-center">List of Student</h5>

    <!-- Error Handling -->
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>
  </div>
   
  </template>
  
  <script>
  export default {
    name: 'ListOfTheStudentinSubjects',
    data() {
      return {
        selectedItem: '',
        items: [
          { path: '/ListOfStudent', label: 'List of Students', icon: 'bi bi-speedometer2 fs-4' },
          { path: '/AddExam', label: 'Add Exam', icon: 'bi bi-file-earmark-text fs-4' },
          { path: '/Feedback', label: 'Feedback', icon: 'bi bi-chat-square-text fs-4' },
          { path: '/ItemAnalysis', label: 'Item Analysis', icon: 'bi bi-graph-up-arrow fs-4' },
          { path: '/PerformanceTracking', label: 'Performance Tracking', icon: 'bi bi-speedometer2 fs-4' },
          { path: '/GenerateReport', label: 'Report Generating', icon: 'bi bi-speedometer2 fs-4' }
        ]
      };
    },
    methods: {
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
  .analysis-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .container-fluid {
    flex: 1;
  }
  
  .left-column {
    background-color: white;
    padding: 10px;
    border-right: 1px solid #ddd;
    height: 100vh;
    width: 250px;
  }
  
  .right-column {
    padding: 20px;
    background-color: white;
    flex: 1;
  }
  
  .list-group-container {
    height: 100%;
  }
  
  .list-group {
    color: #333;
    text-decoration: none;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 10px 0;
    padding: 10px;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  
  .list-group.active,
  .list-group:hover,
  .logOut:hover {
    background-color: #50C878;
    color: white;
  }
  
  .icon-label {
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .icon-label i {
    margin-right: 10px;
  }
  
  .icon-label .label {
    flex: 1;
  }
  
  .analysis-page h1 {
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  </style>
  