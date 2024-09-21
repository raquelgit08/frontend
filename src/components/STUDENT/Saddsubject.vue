<template>
  <div class="container-fluid">
    <h3 >Enrolled Subjects</h3>
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
                <label for="gen_code" class="form-label">Subject Code</label>
                <input type="text" v-model="genCode" class="form-control" id="gen_code" required />
              </div>
              <button type="submit" class="btn btn-primary">Join this Class</button>
              <div v-if="message" :class="['alert', success ? 'alert-success' : 'alert-danger']">
                {{ message }}
              </div>
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
          <div class="card-body">
            <h5 class="card-title">{{ subject.subject_name }}</h5>
            <div class="d-flex justify-content-between align-items-center">
            <p class="mb-0 class-code">Class Code: {{ subject.class_gen_code }}</p>
          </div>
            
          
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mt-4">
      <p>No subjects available.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
        const response = await axios.get('http://localhost:8000/api/getStudentClassroomDetails', {
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
      try {
        const response = await axios.post('http://localhost:8000/api/jcstudent2',
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
      } catch (error) {
        this.message = error.response ? error.response.data.error : 'An error occurred';
        this.success = false;
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
}

.add-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background-color: #87ceeb;
  border: none;
  color: #fff;
  cursor: pointer;
}

.add-button:hover {
  background-color: #00bfff;
}

.modal-header {
  background-color: #87ceeb;
  color: #fff;
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
  border: 2px solid #87ceeb;
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
  width: 260px;
  height: 320px;
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
  background-color: #A7E6FF;
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
