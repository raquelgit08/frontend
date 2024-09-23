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

    <div class="container-fluid">
      <h4 class="text-center">Manage Students</h4><br>

      <!-- Invite Student Button on the Right Side -->
      <div class="d-flex justify-content-end mb-4">
        <button class="btn btn-success" @click="openModal">Invite Student</button>
      </div>

      <!-- Modal for inviting students -->
      <div class="modal" tabindex="-1" role="dialog" v-if="isModalVisible">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Invite Student</h5>
              <button type="button" class="close" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <input v-model="inviteEmail" type="email" class="form-control" placeholder="Enter student's email" />
              </div>
              <div class="form-group mt-2">
                <input v-model="inviteName" type="text" class="form-control" placeholder="Enter student's name" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="inviteStudentEmail">Invite</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-10 offset-md-1">
          <table class="table table-bordered table-hover">
            <thead class="table-info">
              <tr>
                <th scope="col" class="text-center">No.</th>
                <th scope="col" class="text-center">LRN</th>
                <th scope="col" class="text-center">Last Name</th>
                <th scope="col" class="text-center">First Name</th>
                <th scope="col" class="text-center">Middle Name</th>
                <th scope="col" class="text-center">Sex</th>
                <th scope="col" class="text-center">Email</th>
                <th scope="col" class="text-center">Strand</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in students" :key="student.id">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ student.user?.idnumber }}</td>
                <td class="text-center">{{ student.user?.lname }}</td>
                <td class="text-center">{{ student.user?.fname }}</td>
                <td class="text-center">{{ student.user?.mname }}</td>
                <td class="text-center">{{ student.user?.sex }}</td>
                <td class="text-center">{{ student.user?.email }}</td>
                <td class="text-center">{{ student.strands?.addstrand }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StudentsListSubject',
  data() {
    return {
      students: [],
      subject: {
        subjectName: '',
        semester: '',
        schoolYear: ''
      },
      inviteEmail: '',
      inviteName: '',
      error: '',
      isModalVisible: false // Modal visibility state
    };
  },
  methods: {
    async fetchStudents() {
      try {
        const classId = this.$route.params.class_id;
        const response = await axios.get(`http://localhost:8000/api/viewAllStudents`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          params: { class_id: classId }
        });
        this.students = response.data.students;
      } catch (error) {
        alert('Error fetching students: ' + error.message);
      }
    },
    async fetchSubject() {
      try {
        const classId = this.$route.params.class_id;
        const token = localStorage.getItem('token');

        if (!token) {
          this.error = 'Authorization token is missing. Please log in again.';
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/class/${classId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.data.class || !response.data.class.subject.subjectname) {
          this.error = 'Class not found or you are not authorized to view this class.';
          return;
        }

        this.subject.subjectName = response.data.class.subject.subjectname;
        this.subject.semester = response.data.class.semester;
        this.subject.schoolYear = response.data.class.year.addyear;
        this.subject.gen_code = response.data.class.gen_code;
      } catch (error) {
        this.error = error.response ? error.response.data.message : 'Failed to fetch subject data.';
      }
    },
    async inviteStudentEmail() {
      try {
        const response = await axios.post(`http://localhost:8000/api/inviteStudentByEmail`, {
          email: this.inviteEmail,
          name: this.inviteName
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert(response.data.message || 'Invitation sent successfully');
        // Add the invited student to the students list (for demonstration purposes)
        this.students.push({
          id: this.students.length + 1, // Temporary ID
          user: {
            email: this.inviteEmail,
            fname: this.inviteName,
          }
        });
        this.closeModal(); // Close modal after invitation
      } catch (error) {
        alert('Error inviting student: ' + error.message);
      }
    },
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.inviteEmail = '';
      this.inviteName = '';
    }
  },
  mounted() {
    this.fetchStudents();
    this.fetchSubject();
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

.nav-link:hover :active {
  background-color: #007bff;
  color: white !important;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
}



.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
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


.table-wrapper {
  
    padding: 0 15px;
    max-width: 100%;
    overflow-x: auto;
  }

  /* Table Styles */
  .table-custom {
    background-color: #ffffff;
    border-radius: 8px;
    font-size: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #200909;
    overflow: hidden;
  }

  .table-custom th {
    background-color: #0d8eead7;
    color: #ffffff;
    font-weight: 700;
    font-size: 20px;
  }
  
  .table th, .table td {
    text-align: center;
    vertical-align: middle;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .td{
    font-size: 19px;
  }

  .table-custom tbody tr:hover {
    background-color: #f1f3f5;
  }

  .table-custom tbody tr {
    transition: background-color 0.3s ease;
  }
  .router-link-active {
  color: #007bff !important;
  border-bottom: 2px solid #007bff;
}
</style>
