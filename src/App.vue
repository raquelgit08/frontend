<template>
  <div>
    <HomePageAdmin v-if="isAdmin" @logout="handleLogout" />
    <Teacher_homepage v-else-if="isTeacher" @logout="handleLogout" />
    <Student_homepage v-else-if="isStudent" @logout="handleLogout" />
    <div v-else class="d-flex vh-100">
      <div class="left-side d-flex align-items-center justify-content-center">
        <img src="./assets/i12.png" class="img-fluid logo" alt="Your Image">
      </div>
      <div class="right-side d-flex align-items-center justify-content-center">
        <form class="login-form d-flex flex-column justify-content-center" @submit.prevent="handleSubmit">
          <h3 class="form-title text-center">WISE-SHS</h3>
          <p class="welcome-message text-center">Welcome! Please login to your account.</p>

          <div class="form-group position-relative">
            <label for="email">Email:</label>
            <input type="email" class="form-control" id="email" placeholder="Enter email" v-model="email" required>
          </div>

          <div class="form-group position-relative">
            <label for="password">Password:</label>
            <input :type="showPassword ? 'text' : 'password'" class="form-control" id="password" placeholder="Enter password" v-model="password" required>
            <i :class="passwordFieldIcon" class="password-toggle position-absolute" @click="togglePassword"></i>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="rememberMe">
              <label class="form-check-label" for="rememberMe">Remember Me</label>
            </div>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-custom-width">Log In</button>
        </form>
      </div>
    </div>

    <!-- Modal for loading spinner -->
    <div class="modal fade" id="loadingModal" tabindex="-1" aria-labelledby="loadingModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Verifying user, please wait...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import { Modal } from 'bootstrap';

import HomePageAdmin from './components/ADMIN/homepageadmin.vue';
import Teacher_homepage from './components/TEACHER/teacherhomepage.vue';
import Student_homepage from './components/STUDENT/studenthomepage.vue';

export default {
  name: 'App',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      isAdmin: false,
      isTeacher: false,
      isStudent: false,
      errorMessage: ''
    };
  },
  computed: {
    passwordFieldIcon() {
      return this.showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill';
    },
  },
  methods: {
    async handleSubmit() {
      try {
        // Show loading modal
        const modalElement = document.getElementById('loadingModal');
        const modal = new Modal(modalElement);
        modal.show();

        const response = await axios.post('http://127.0.0.1:8000/api/login', {
          email: this.email,
          password: this.password
        });
        console.log(response.data);
  
        // Save the token and user type to local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usertype', response.data.usertype);

        // Save the current route to local storage
        localStorage.setItem('savedRoute', this.$route.fullPath);
        
        // Set state based on user type
        this.updateUserType(response.data.usertype);

        // Route based on user type
        if (response.data.usertype === 'admin') {
          router.push('/adminpage'); // Route to admin page
        } else if (response.data.usertype === 'teacher') {
          router.push('/teacher'); // Route to teacher page
        } else if (response.data.usertype === 'student') {
          router.push('/student'); // Route to student page
        } else {
          this.errorMessage = 'Invalid user type.';
        }
      } catch (error) {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed. Please check your credentials.';
      } finally {
        // Hide loading modal
        const modalElement = document.getElementById('loadingModal');
        const modal = Modal.getInstance(modalElement);
        modal.hide();
      }
    },
    updateUserType(usertype) {
      this.isAdmin = usertype === 'admin';
      this.isTeacher = usertype === 'teacher';
      this.isStudent = usertype === 'student';
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('usertype');
      localStorage.removeItem('savedRoute');
      this.isAdmin = false;
      this.isTeacher = false;
      this.isStudent = false;
      this.email = '';
      this.password = '';
      this.$router.push('/');
    },
  },
  components: {
    HomePageAdmin,
    Teacher_homepage,
    Student_homepage,
  },
  created() {
    const token = localStorage.getItem('token');
    const usertype = localStorage.getItem('usertype');
    const savedRoute = localStorage.getItem('savedRoute');

    if (token && usertype) {
      this.updateUserType(usertype);
      if (savedRoute) {
        this.$router.push(savedRoute);
      } else {
        this.$router.push('/');
      }
    }
  }
};
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  font-family: Arial, sans-serif;
}

.d-flex {
  display: flex;
}

.left-side {
  width: 50%;
  background-image: url('./assets/back1.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.right-side {
  width: 50%;
  background-color: #ffffff;
}

.logo {
  max-width: 500px; /* Adjusted size of the logo */
}

.login-form {
  width: 90%;
  max-width: 600px;
  padding: 50px;
}

.form-title {
  font-family: fantasy;
  font-size: 36px;
  font-weight: 300;
  margin-bottom: 20px;
}

.welcome-message {
  font-family: 'Nunito', sans-serif;
  font-size: 18px;
  font-weight: 300;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  border-radius: 0.25rem;
  border-color: #ced4da;
  padding: 0.75rem 1.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
}

.password-toggle {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 68%;
  transform: translateY(-50%);
}

.forgot-password {
  color: #007bff;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
  color: #0056b3;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  border-radius: 0.25rem;
  padding: 0.75rem 1.25rem;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.btn-custom-width {
  width: 100%;
}
</style>
