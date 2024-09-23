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
              <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" class="form-control" required />
              <i :class="passwordFieldIcon" class="password-toggle" @click="togglePassword"></i>
            </div>

            <div class="form-options">
              <a href="#" class="recovery-password" :style="{color: recoveryPasswordColor}" @click="handleRecoveryPassword">Forgot Password</a>
            </div>

            <!-- Sign In button -->
            <button type="submit" class="btn-signin" :style="{ backgroundColor: signInButtonColor }">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import Swal from 'sweetalert2'; // Import SweetAlert

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
      errorMessage: '',
      recoveryPasswordColor: '#007bff', // Initial color for recovery password link
      signInButtonColor: '#ff5252', // Initial color for the sign in button
      attempts: 0, // Track login attempts
      remainingTime: 60, // Time to wait before retrying
      lockoutTimer: null, // Timer for handling lockout period
      countdownInterval: null // Interval for countdown in SweetAlert
    };
  },
  computed: {
    passwordFieldIcon() {
      return this.showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill';
    },
  },
  methods: {
    async handleSubmit() {
      if (this.attempts >= 3) {
        // Start the countdown and show alert with dynamic timer
        this.startCountdownAlert();
        return;
      }

      // Check if the app is offline
      if (!navigator.onLine) {
        Swal.fire({
          icon: 'error',
          title: 'Offline',
          text: 'You are currently offline. Please check your internet connection and try again.'
        });
        return;
      }

      try {
        const response = await axios.post('http://localhost:8000/api/login', {
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
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid user type.'
          });
        }

        // Reset attempts on successful login
        this.attempts = 0;
        clearInterval(this.lockoutTimer);

      } catch (error) {
        console.error('Login failed:', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid credentials. Please try again.'
        });

        // Increment login attempts on failure
        this.attempts++;
        if (this.attempts >= 3) {
          this.startLockoutTimer();
        }
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
    handleRecoveryPassword() {
      // Change the color of the "Recovery Password" link to blue
      this.recoveryPasswordColor = 'blue';

      // Display SweetAlert message
      Swal.fire({
        icon: 'info',
        title: 'Inform your teacher',
        text: 'Inform your teacher about the recover password',
      });
    },
    startLockoutTimer() {
      this.remainingTime = 60; // Set wait time to 60 seconds
      this.lockoutTimer = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime <= 0) {
          clearInterval(this.lockoutTimer);
          this.attempts = 0; // Reset attempts after lockout
        }
      }, 1000);
    },
    startCountdownAlert() {
      let countdown = this.remainingTime;
      
      // Initial SweetAlert popup
      Swal.fire({
        icon: 'warning',
        title: 'Too many attempts!',
        html: `Please wait <b>${countdown}</b> seconds before trying again.`,
        timer: countdown * 1000, // Automatically close after countdown finishes
        timerProgressBar: true,
        allowOutsideClick: false, // Prevent clicking outside to close
        didOpen: () => {
          const content = Swal.getHtmlContainer().querySelector('b');
          this.countdownInterval = setInterval(() => {
            countdown--;
            content.textContent = countdown;
            if (countdown <= 0) {
              clearInterval(this.countdownInterval); // Stop countdown
            }
          }, 1000);
        },
        willClose: () => {
          clearInterval(this.countdownInterval); // Clear interval when the alert closes
          this.attempts = 0; // Reset login attempts after countdown
        }
      });
    }
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

/* Recovery password styles */
.recovery-password {
  color: #007bff; /* Initial color */
}

.recovery-password:hover {
  text-decoration: underline;
}

/* Sign In button styles */
.btn-signin {
  background-color: #ff5252; /* Initial color */
  border: none;
  border-radius: 50px;
  color: #fff;
  padding: 15px;
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease; /* Smooth transition on hover and click */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Added shadow effect */
}

.btn-signin:hover {
  background-color: #e04848; /* Hover effect */
  transform: translateY(-2px); /* Slight lift on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Increased shadow on hover */
}

.btn-signin:active {
  background-color: #d03d3d; /* Darker color when clicked */
  transform: translateY(1px); /* Button sinks slightly when clicked */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2); /* Reduced shadow when clicked */
}

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
  background-color: #e0e0f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
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
  max-width: 500px;
  width: 100%;
  text-align: center;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
}

.greeting {
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.welcome-message {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 40px;
  color: #666;
}

.login-form .form-control {
  font-size: 18px;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
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

.register-link {
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
