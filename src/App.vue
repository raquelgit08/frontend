<template>
  <div>
    <!-- Conditional rendering based on user type -->
    <HomePageAdmin v-if="isAdmin" @logout="handleLogout" />
    <Teacher_homepage v-else-if="isTeacher" @logout="handleLogout" />
    <Student_homepage v-else-if="isStudent" @logout="handleLogout" />

    <!-- Login page layout -->
    <div v-else class="login-page">
      <!-- Left side with image and curve -->
      <div class="login-left">
        <img src="./assets/i12.png" alt="Illustration" class="illustration">
      </div>

      <!-- Right side with login form -->
      <div class="login-right">
        <div class="login-form-container">
          <h1 class="greeting">Hello Again!</h1>
          <p class="welcome-message">Welcome back, you've been missed!</p>

          <form @submit.prevent="handleSubmit" class="login-form">
            <input type="text" v-model="email" placeholder="Enter username" class="form-control" required />
            <div class="password-group">
              <input :type="showPassword ? 'text' : 'password'"  v-model="password" placeholder="Password"  class="form-control" required/>
              <i :class="passwordFieldIcon" class="password-toggle" @click="togglePassword"></i>
            </div>

            <div class="form-options">
              <a href="#" class="recovery-password">Recovery Password</a>
            </div>

            <button type="submit" class="btn-signin">Sign In</button>
          </form>

          <p class="register-link">Not a member? <router-link to="/register">Register now</router-link></p>
        </div>
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Roboto:wght@300;400;700&display=swap');

html, body {
  height: 100%;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #f0f2f5;
}

.login-page {
  display: flex;
  height: 100vh;
}

.login-left {
  width: 45%;
  background-color: #e0e0f8; /* A similar color to match the image's background */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-top-right-radius: 50px; /* Curve effect */
  border-bottom-right-radius: 50px; /* Curve effect */
}

.illustration {
  max-width: 80%;
  height: auto;
}

.login-right {
  width: 55%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-form-container {
  max-width: 500px; /* Increased width */
  width: 100%;
  text-align: center;
  padding: 30px; /* Added padding for better look */
  border-radius: 10px; /* Added border radius for softer edges */
  background-color: #fff; /* Ensure background is white for contrast */
}

.greeting {
  font-size: 38px; /* Increased font size */
  font-weight: 700; /* Make font bolder */
  margin-bottom: 20px;
  color: #333;
}

.welcome-message {
  font-size: 20px; /* Increased font size */
  font-weight: 500; /* Make font bolder */
  margin-bottom: 40px;
  color: #666;
}

.login-form .form-control {
  font-size: 18px; /* Increased font size */
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 20px; /* Increased padding */
  margin-bottom: 20px;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15); /* Added shadow effect */
}

.password-group {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.form-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.recovery-password {
  color: #007bff;
  font-size: 16px; /* Increased font size */
  font-weight: 500; /* Make font bolder */
  text-decoration: none;
}

.recovery-password:hover {
  text-decoration: underline;
}

.btn-signin {
  background-color: #ff5252;
  border: none;
  border-radius: 50px;
  color: #fff;
  padding: 15px;
  width: 100%;
  font-size: 18px; /* Increased font size */
  font-weight: 600; /* Make font bolder */
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Added shadow effect */
}

.btn-signin:hover {
  background-color: #e04848;
}

.register-link {
  margin-top: 30px;
  font-size: 16px; /* Increased font size */
  font-weight: 500; /* Make font bolder */
}

.register-link a {
  color: #007bff; /* Add color to the link */
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
