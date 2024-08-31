<template>
  <div class="container-fluid">
    <nav class="nav nav-pills nav-fill">
      <router-link to="/teacheraddsubject" class="nav-link">
        <span><i class="bi bi-arrow-left fs-4"></i></span>
      </router-link>
      <router-link to="/subject" class="nav-link" aria-current="page"> Dashboard</router-link>
      <router-link to="/AddExam" class="nav-link"><i class="bi bi-file-earmark-plus fs-4"></i>Exams</router-link>
      <router-link to="/Feedback" class="nav-link"><i class="bi bi-chat-dots fs-4"></i>Feedback</router-link>
      <router-link to="/ItemAnalysis" class="nav-link"><i class="bi bi-bar-chart-line fs-4"></i>Item Analysis</router-link>
      <router-link to="/PerformanceTracking" class="nav-link"><i class="bi bi-activity fs-4"></i>Performance tracking</router-link>
      <router-link to="/studentslist" class="nav-link"><i class="bi bi-person-lines-fill fs-4"></i> List of Students</router-link>
      <router-link to="/studentslist" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
    </nav>
  </div>
    <div class="feedback-page">
      <div class="container-fluid">
        <h5>feedbacccckkksssss</h5>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FeedbacksofStudent',
    data() {
      return {
        selectedItem: '',
       
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
  .feedback-page {
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
  
  .feedback-page h1 {
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
.nav {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: black !important;
  text-decoration: none;
  padding: 10px 15px;
}

.nav-link:hover {
  color: #333;
}

.router-link-active {
  border-bottom: 3px solid #007bff; /* Blue bottom border for active link */
  color: #007bff !important; /* Change text color for active link */
}

.nav-link i {
  margin-right: 5px;
}
  </style>
  