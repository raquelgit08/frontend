<template>
  <div>
    <!-- Conditional rendering based on user type -->
    <HomePageAdmin v-if="isAdmin" @logout="handleLogout" />
    <Teacher_homepage v-else-if="isTeacher" @logout="handleLogout" />
    <Student_homepage v-else-if="isStudent" @logout="handleLogout" />

    <!-- Login and forgot password layout -->
    <div v-else class="login-page">
      <!-- Left side with image and curve (always visible) -->
      <div class="login-left">
        <img src="./assets/i12.png" alt="Illustration" class="illustration" />
      </div>

      <!-- Right side with dynamic content based on the current step -->
      <div class="login-right">
        <div class="login-form-container">
          <!-- Conditional rendering of forms -->
          <template v-if="forgotPasswordStep === 0">
            <h1 class="greeting">Hello Again!</h1>
            <p class="welcome-message">Welcome back, you've been missed!</p>

            <!-- Login form -->
            <form @submit.prevent="handleSubmit" class="login-form">
              <input
                type="text"
                v-model="email"
                placeholder="Enter username"
                class="form-control"
                required
              />
              <div class="password-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Password"
                  class="form-control"
                  required
                />
                <i :class="passwordFieldIcon" class="password-toggle" @click="togglePassword"></i>
              </div>
              <div class="form-options">
                <a
                  href="#"
                  class="recovery-password"
                  :style="{ color: recoveryPasswordColor }"
                  @click="startForgotPassword"
                >Forgot Password</a>
              </div>
              <button type="submit" class="btn-signin" :style="{ backgroundColor: signInButtonColor }">Sign In</button>
            </form>
          </template>

          <!-- Forgot Password Step 1: Enter email -->
          <template v-else-if="forgotPasswordStep === 1">
            <h1 class="greeting">Forgot Password</h1>
            <p class="welcome-message">Enter your email to receive a verification code.</p>

            <form @submit.prevent="sendVerificationCode" class="login-form">
              <input
                type="email"
                v-model="email"
                placeholder="Enter your email"
                class="form-control"
                required
              />
              <button type="submit" class="btn-signin">Send Verification Code</button>
            </form>
          </template>

          <!-- Forgot Password Step 2: Enter verification code and reset password -->
          <template v-else-if="forgotPasswordStep === 2">
            <h1 class="greeting">Reset Password</h1>
            <p class="welcome-message">Enter the verification code and your new password.</p>

            <form @submit.prevent="resetPassword" class="login-form">
              <input
                type="text"
                v-model="verificationCode"
                placeholder="Enter verification code"
                class="form-control"
                required
              />
              <input
                type="password"
                v-model="newPassword"
                placeholder="Enter new password"
                class="form-control"
                required
              />
              <input
                type="password"
                v-model="confirmPassword"
                placeholder="Confirm new password"
                class="form-control"
                required
              />
              <button type="submit" class="btn-signin">Reset Password</button>
            </form>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config';
import axios from 'axios';
import router from '@/router';
import Swal from 'sweetalert2';

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
      recoveryPasswordColor: '#007bff',
      signInButtonColor: '#ff5252',
      attempts: 0,
      remainingTime: 60,
      lockoutTimer: null,
      countdownInterval: null,
      forgotPasswordStep: 0, // Step 0: login, Step 1: forgot password, Step 2: reset password
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
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
        this.startCountdownAlert();
        return;
      }

      if (!navigator.onLine) {
        Swal.fire({
          icon: 'error',
          title: 'Offline',
          text: 'You are currently offline. Please check your internet connection and try again.'
        });
        return;
      }

      try {
        const response = await axios.post(`${config.apiBaseURL}/login`, {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usertype', response.data.usertype);
        localStorage.setItem('savedRoute', this.$route.fullPath);

        this.updateUserType(response.data.usertype);

        if (response.data.usertype === 'admin') {
          router.push('/adminpage');
        } else if (response.data.usertype === 'teacher') {
          router.push('/teacher');
        } else if (response.data.usertype === 'student') {
          router.push('/student');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid user type.'
          });
        }

        this.attempts = 0;
        clearInterval(this.lockoutTimer);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid credentials. Please try again.'
        });

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
    startForgotPassword() {
      this.forgotPasswordStep = 1;
    },
    async sendVerificationCode() {
      try {
        const response = await axios.post(`${config.apiBaseURL}/sendVerificationCode`, { email: this.email });
        Swal.fire('Success', response.data.message, 'success');
        this.forgotPasswordStep = 2;
      } catch (error) {
        Swal.fire('Error', error.response.data.message, 'error');
      }
    },
    async resetPassword() {
      if (this.newPassword !== this.confirmPassword) {
        Swal.fire('Error', 'Passwords do not match', 'error');
        return;
      }

      try {
        const response = await axios.post(`${config.apiBaseURL}/updatePassword`, {
          email: this.email,
          verification_code: this.verificationCode,
          new_password: this.newPassword,
          new_password_confirmation: this.confirmPassword,
        });
        Swal.fire('Success', response.data.message, 'success');
        this.forgotPasswordStep = 0;
      } catch (error) {
        Swal.fire('Error', error.response.data.message, 'error');
      }
    },
    startLockoutTimer() {
      this.remainingTime = 60;
      this.lockoutTimer = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime <= 0) {
          clearInterval(this.lockoutTimer);
          this.attempts = 0;
        }
      }, 1000);
    },
    startCountdownAlert() {
      let countdown = this.remainingTime;

      Swal.fire({
        icon: 'warning',
        title: 'Too many attempts!',
        html: `Please wait <b>${countdown}</b> seconds before trying again.`,
        timer: countdown * 1000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          const content = Swal.getHtmlContainer().querySelector('b');
          this.countdownInterval = setInterval(() => {
            countdown--;
            content.textContent = countdown;
            if (countdown <= 0) {
              clearInterval(this.countdownInterval);
            }
          }, 1000);
        },
        willClose: () => {
          clearInterval(this.countdownInterval);
          this.attempts = 0;
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
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Roboto:wght@300;400;700&display=swap');

/* Recovery password styles */
.recovery-password {
  color: #007bff;
}

.recovery-password:hover {
  text-decoration: underline;
}

/* Sign In button styles */
.btn-signin {
  background-color: #ff5252;
  border: none;
  border-radius: 50px;
  color: #fff;
  padding: 15px;
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-signin:hover {
  background-color: #e04848;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.btn-signin:active {
  background-color: #d03d3d;
  transform: translateY(1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
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
