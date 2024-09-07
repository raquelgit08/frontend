<template>
  <div class="container-fluid">
    <h3 style="margin-top: 20px;">Enrolled Subjects</h3>
    <button class="bi bi-plus-circle add-button" @click="showModal = true"></button>

    <!-- Modal for Adding Subject -->
    <div v-if="showModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Subject</h5>
            <button type="button" class="btn-close" @click="showModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addSubject">
              <div class="mb-3">
                <label for="gen_code" class="form-label">Subject Code</label>
                <input type="text" v-model="genCode" class="form-control" id="gen_code" required />
              </div>
              <button type="submit" class="btn btn-primary">Add Subject</button>
              <div v-if="message" :class="{'alert': true, 'alert-success': success, 'alert-danger': !success}">
                {{ message }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Displaying Approved Subjects -->
    <div v-if="subjects.length" class="mt-4" style="margin: 20px; align-items: center;">
      <div class="card-container">
        <div v-for="subject in subjects" :key="subject.class_id" class="card">
          <img :src="subject.imageUrl || require('@/assets/newlogo.png')" class="card-img" alt="Subject Image" />
          <div class="card-body">
            <h5 class="card-title">{{ subject.subject_name }}</h5>
            <p class="card-text"> Class Code: {{ subject.class_gen_code }}</p>
            <p class="card-text">Subject Descriptions: {{ subject.class_description }}</p>
            <router-link :to="`/mysubject/${subject.class_id}`" class="btn btn-primary">Go to Room</router-link>

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
      subjects: [], // Ensure subjects is initialized as an array
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
        this.subjects = response.data;
      } catch (error) {
        this.subjects = [];
      }
    },
    async addSubject() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(
          'http://localhost:8000/api/jcstudent2',
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
.container {
  margin-top: 20px;
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
  font-size: 50px;
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

.form-control:focus {
  border-color: #00bfff;
  box-shadow: 0 0 0 0.2rem rgba(0, 191, 255, 0.25);
}

.btn-primary {
  background-color: #87ceeb;
  border: none;
}

.btn-primary:hover {
  background-color: #00bfff;
}

.alert {
  margin-top: 10px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  border: 3px solid #2c71c190;
  border-radius: 8px;
  width: 250px;
  background-color: #fff;
}

.card-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.card-body {
  padding: 15px;
  background-color: #00bfff36;
}

.card-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 1rem;
}
</style>
