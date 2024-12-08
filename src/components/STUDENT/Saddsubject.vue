<template>
  <div class="container-fluid">
    <h3 >Classes</h3>
    <button class="bi bi-plus-circle add-button" @click="showModal = true"></button>

    <!-- Modal for Adding Subject -->
    <div v-if="showModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Join in Class</h5>
            <button type="button" class="btn-close" @click="showModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addSubject">
              <div class="mb-3">
                <label for="gen_code" class="form-label">Class Code</label>
                <input type="text" v-model="genCode" class="form-control" id="gen_code" required />
              </div>
              <button type="submit" class="btn " style="background-color: antiquewhite;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);"><b>  Join this Class </b></button>
              <!-- <div v-if="message" :class="['alert', success ? 'alert-success' : 'alert-danger']">
                {{ message }}
              </div> -->
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Displaying Approved Subjects -->
    <div v-if="subjects.length" class="mt-4">
      <div class="card-container">
        <div v-for="subject in subjects" :key="subject.class_id" class="card" @click="goToRoom(subject.class_id)">
          <img :src="subject.imageUrl || require('@/assets/newlogo.png')" class="card-img" alt="Subject Image" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ subject.subject_name }}</h5>
            <div class="mt-auto">
              <p class="mb-0 class-code">Class Code: <b> {{ subject.class_gen_code }}</b></p>
              <p class="mb-0 teacher-name">Teacher: {{ subject.teacher_lname }}, {{ subject.teacher_fname }}</p>
              <p class="mb-0 teacher-name">S.Y. : {{ subject.year_name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-4">
      <p>No Classes enrolled.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';
import Swal from 'sweetalert2';

export default {
  name: 'AddSubject',
  data() {
    return {
      showModal: false,
      genCode: '',
      message: '',
      success: false,
      subjects: [],
    };
  },
  methods: {
    async fetchSubjects() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${config.apiBaseURL}/getStudentClassroomDetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Response:', response); // Log the full response
        console.log('Subjects Data:', response.data); // Log the response data (subjects)
        this.subjects = response.data;
      } catch (error) {
        this.subjects = [];
      }
    },
    goToRoom(classId) {
      this.$router.push(`/myExams/${classId}`);
    },
    async addSubject() {
      const token = localStorage.getItem('token');
      const isAlreadyJoined = this.subjects.some(subject => subject.class_gen_code === this.genCode);
      if (isAlreadyJoined) {
        // Show SweetAlert error if subject is already joined
        Swal.fire({
          icon: 'Request Not Submitted.',
          title: 'Already Joined',
          text: 'You have already joined this class.',
        });
        return;
      }

      try {
        const response = await axios.post(`${config.apiBaseURL}/jcstudent2`,
          { gen_code: this.genCode },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        this.message = response.data.message;
        this.success = true;
        this.genCode = '';
        this.showModal = false;
        this.fetchSubjects(); // Refresh the subjects list after adding a new subject

        Swal.fire({
          icon: 'success',
          title: 'Request Successfully Submitted ',
          text: 'Please inform your teacher ',
        });
      } catch (error) {
        this.message = error.response ? error.response.data.error : 'An error occurred';
        this.success = false;
        Swal.fire({
          icon: 'error',
          title: 'Request Submission Failed',
          text: error.response ? error.response.data.error : 'An error occurred',
        });
      }
    },
  },
  created() {
    this.fetchSubjects(); // Fetch subjects when the component is created
  },
};
</script>

<style scoped>
.container-fluid {
  padding: 10px;
  align-items: center;
  padding-left: 40px;
}

.add-button {
  position: fixed;
  bottom: 70px;
  right: 20px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background-color: #c1a398;
  border: none;
  color: #ffffff;
  cursor: pointer;
}

.add-button:hover {
  background-color: #deb5a7;

  }

.modal-header {
  background-color: #eed3c9;
  color: #000000;
  border-bottom: 1px solid #ddd;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.btn-close {
  filter: invert(1);
}

.modal-body {
  background-color: #f0f8ff;
}

.form-control {
  border-radius: 5px;
  border: 2px solid #d2c0ba;
}


.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  cursor: pointer; 
}

.card {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 280px;
  height: 350px;
  background-color: #ffffff;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.card-img {
  width: 100%;
  height: 170px;
  object-fit: cover;
}

.card-body {
  padding: 22px;
  background-color: #f4e5df;
  flex-grow: 1;
}

.card-title {
  font-size: 18px;
  margin-bottom: 5px;
  color: #030202;
  font-weight: 600;
}

.card-text {
  font-size: 15px;
  color: #000000;
}

.btn-primary {
  border-radius: 20px;
}
</style>
