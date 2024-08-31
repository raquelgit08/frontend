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
        <router-link to="/pendingstudentslist" class="nav-link"><i class="bi bi-hourglass-split fs-4"></i> Pending</router-link>
      </nav>
    </div>
    <div class="container-fluid">
      <h4 class="text-center">Students to be accepted</h4><br>
      
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'PendingStudent',
    data() {
      return {
        students: []
      };
    },
    methods: {
      async fetchStudents() {
        try {
          const response = await axios.get('http://localhost:8000/api/viewAllStudents', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.students = response.data.students;
        } catch (error) {
          alert('Error fetching students: ' + error.message);
        }
      },
      async kickStudent(studentId) {
        if (confirm('Are you sure you want to remove this student from the class?')) {
          try {
            await axios.delete(`http://localhost:8000/api/students/${studentId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            alert('Student removed successfully');
            this.fetchStudents();
          } catch (error) {
            alert('Error removing student: ' + error.message);
          }
        }
      },
      async inviteStudent(studentId) {
        try {
          const response = await axios.post(`http://localhost:8000/api/inviteStudent`, {
            student_id: studentId
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          alert(response.data.message || 'Invitation sent successfully');
        } catch (error) {
          alert('Error inviting student: ' + error.message);
        }
      }
    },
    mounted() {
      this.fetchStudents();
    }
  };
  </script>
  
  <style scoped>
  .container-fluid {
    margin-top: 10px;
  }
  h4 {
    
    color: #060000;
    padding: 10px;
    border-radius: 8px 8px 0 0;
    font-family: 'Georgia', serif;
    margin-bottom: 20px;
  }
  .table {
    font-size: 15px;
  }
  .table-info {
    background-color: #e0ffff;
  }
  .btn-danger {
    margin-right: 10px;
  }
  .container-fluid {
    margin: auto;
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
  