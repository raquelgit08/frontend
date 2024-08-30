<template>
  <div class="container-fluid">
    <h3 style="margin-top: 20px;">Enrolled Subjects</h3>
    <button class="bi bi-plus-circle add-button" @click="showModal = true"></button>

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

    <div v-if="subjects.length" class="mt-4" style="margin: 20px; align-items: center;">
      <div class="card-container">
        <div v-for="subject in subjects" :key="subject.id" class="card">
          <img :src="subject.imageUrl || require('@/assets/newlogo.png')" class="card-img" alt="Subject Image" />
          <div class="card-body">
            <h5 class="card-title">{{ subject.subject_name }}</h5>
            <p class="card-text">{{ subject.teacher_fname }} {{ subject.teacher_lname }}</p>
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
      subjects: [] // Ensure subjects is always an array
    };
  },
  methods: {
    async addSubject() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('http://localhost:8000/api/jcstudent2', 
          { gen_code: this.genCode },
          { headers: { 
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(response.data); // Log response to check if the subject was added
        this.message = response.data.success;
        this.success = true;
        this.genCode = '';
        this.showModal = false;
        this.fetchSubjects(); // Refresh subjects list
      } catch (error) {
        console.error('Error adding subject:', error);
        this.message = error.response ? error.response.data.error : 'An error occurred';
        this.success = false;
      }
    },
    async fetchSubjects() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/api/index4', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data); // Check the actual data structure
        this.subjects = response.data; // Adjust if necessary
      } catch (error) {
        console.error('Error fetching subjects:', error);
        this.subjects = [];
      }
    }
  },
  created() {
    this.fetchSubjects(); // Fetch subjects when component is created
  }
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
  background-color: #87ceeb; /* Sky blue background */
  border: none;
  color: #fff;
  cursor: pointer;
}

.add-button:hover {
  background-color: #00bfff; /* Deep sky blue on hover */
}

.modal-header {
  background-color: #87ceeb; /* Sky blue header background */
  color: #fff;
  border-bottom: 1px solid #ddd; /* Light border below header */
}

.modal-title {
  font-size: 1.25rem; /* Larger font size for the title */
  font-weight: bold;
}

.btn-close {
  filter: invert(1); /* White close button icon */
}

.modal-body {
  background-color: #f0f8ff; /* Alice blue background for form */
}

.form-control {
  border-radius: 5px; /* Rounded corners for input fields */
  border: 2px solid #87ceeb; /* Sky blue border around input fields */
}

.form-control:focus {
  border-color: #00bfff; /* Deep sky blue border on focus */
  box-shadow: 0 0 0 0.2rem rgba(0, 191, 255, 0.25); /* Deep sky blue shadow on focus */
}

.btn-primary {
  background-color: #87ceeb; /* Sky blue background for primary button */
  border: none;
}

.btn-primary:hover {
  background-color: #00bfff; /* Deep sky blue on hover */
}

.alert {
  margin-top: 10px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Space between cards */

}

.card {
  display: flex;
  flex-direction: column;
  border: 3px solid #2c71c190;
  border-radius: 8px;
  width: 20%; /* Responsive card width */
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


