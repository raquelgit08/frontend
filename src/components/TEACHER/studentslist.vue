<template>
  <div class="container-fluid">
    <h4 class="text-center">Manage Students</h4><br>
    <div class="row mb-4">
      <div class="col-md-8 offset-md-2">
        <table class="table table-bordered table-hover">
          <thead class="table-info">
            <tr>
              <th scope="col" class="text-center">Email</th>
              <th scope="col" class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student) in students" :key="student.id">
              <td class="text-center">{{ student.email }}</td>
              <td class="text-center">
                <button class="btn btn-danger" @click="kickStudent(student.id)">Kick</button>
                <button class="btn btn-primary" @click="inviteStudent(student.id)">Invite</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ManageStudentEmails',
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
  background-color: #87CEFA;
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
</style>
