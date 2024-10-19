<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi bi-person-lines-fill"></i> Register New Teacher's Account </h3>
    </div>
    <div class="register-form">
      <div class="row mb-3 Row">
        <div class="col-md-3">
          <label for="idnumber" class="form-label">Employee Number:</label>
          <input v-model="formData.idnumber" :class="{'is-invalid': !formData.idnumber && validationAttempted}" type="text" id="idnumber" class="form-control" required>
        </div>

        <div class="col-md-3">
          <label for="lname" class="form-label">Last Name:</label>
          <input v-model="formData.lname" :class="{'is-invalid': !formData.lname && validationAttempted}" type="text" id="lname" class="form-control" required>
        </div>

        <div class="col-md-3">
          <label for="fname" class="form-label">First Name:</label>
          <input v-model="formData.fname" :class="{'is-invalid': !formData.fname && validationAttempted}" type="text" id="fname" class="form-control" required>
        </div>

        <div class="col-md-3">
          <label for="mname" class="form-label">Middle Name:</label>
          <input v-model="formData.mname" :class="{'is-invalid': !formData.mname && validationAttempted}" type="text" id="mname" class="form-control" required>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-3">
          <label class="form-label d-block">Gender:</label>
          <div class="form-check form-check-inline">
            <input v-model="formData.sex" class="form-check-input" type="radio" name="sex" id="male" value="male" required>
            <label class="form-check-label" for="male">Male</label>
          </div>
          <div class="form-check form-check-inline">
            <input v-model="formData.sex" class="form-check-input" type="radio" name="sex" id="female" value="female" required>
            <label class="form-check-label" for="female">Female</label>
          </div>
          <div v-if="!formData.sex && validationAttempted" class="text-danger">Please select a gender.</div>
        </div>


        <div class="col-md-5">
          <label for="password" class="form-label">Password:</label>
          <div class="input-group">
            <input v-model="formData.password" :class="{'is-invalid': !formData.password && validationAttempted}" :type="passwordFieldType" id="password" class="form-control" required>
            <span class="input-group-text" @click="togglePasswordVisibility">
              <i :class="passwordIcon"></i>
            </span>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label for="position" class="form-label">Position:</label>
          <select v-model="formData.position_id" :class="{'is-invalid': !formData.position_id && validationAttempted}" id="position" class="form-select" required>
            <option value="">Select Position</option>
            <option v-for="position in positions" :key="position.id" :value="position.value">
              {{ position.label }}
            </option>
          </select>
        </div>

        <div class="col-md-6">
          <label for="strand" class="form-label">Strand:</label>
          <select v-model="formData.strand_id" :class="{'is-invalid': !formData.strand_id && validationAttempted}" id="strand" class="form-select">
            <option value="">Select Strand</option>
            <option v-for="strand in strands" :key="strand.id" :value="strand.id">
              {{ strand.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="text-center mt-4">
        <button type="button" class="btn-gradient" @click="addUser">
          <i class="bi bi-person-plus-fill"></i>
          <span class="ms-2"><b>SAVE RECORD</b></span>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalVisible" class="modal fade show d-block" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Details</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><strong>Employee Number:</strong> {{ formData.idnumber }}</p>
            <p><strong>Gender:</strong> {{ formData.sex }}</p>
            <p><strong>Last Name:</strong> {{ formData.lname }}</p>
            <p><strong>First Name:</strong> {{ formData.fname }}</p>
            <p><strong>Middle Name:</strong> {{ formData.mname }}</p>
            <p><strong>Position:</strong> {{ formData.position_id }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveUser">Register Now</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '@/config';

export default {
  name: 'RegisterTeacher',
  data() {
    return {
      formData: {
        idnumber: '',
        lname: '',
        fname: '',
        mname: '',
        sex: '',
        email: '',
        password: '',
        position_id: '',
        strand_id: '',
      },
      positions: [],
      strands: [],
      passwordFieldType: 'password',
      passwordIcon: 'bi bi-eye',
      isModalVisible: false,
      validationAttempted: false, // Track validation attempts
    };
  },
  mounted() {
    this.fetchPositions();
    this.fetchStrands();
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
      this.passwordIcon = this.passwordIcon === 'bi bi-eye' ? 'bi bi-eye-slash' : 'bi bi-eye';
    },
    addUser() {
      this.validationAttempted = true; // Mark validation attempt
      if (this.validateForm()) {
        this.isModalVisible = true;
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Fields',
          text: 'Please fill in all required fields before submitting.',
          confirmButtonColor: '#007bff',
        });
      }
    },
    validateForm() {
      const requiredFields = ['idnumber', 'lname', 'fname', 'mname', 'sex', 'password', 'position_id'];
      for (const field of requiredFields) {
        if (!this.formData[field]) {
          return false;
        }
      }
      return true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    async fetchStrands() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiBaseURL}/viewstrand`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && Array.isArray(response.data.data)) {
          this.strands = response.data.data.map(strand => ({
            id: strand.id,
            label: `${strand.addstrand} ${strand.grade_level}`
          }));
        }
      } catch (error) {
        console.error('Error fetching strands:', error);
      }
    },
    async fetchPositions() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiBaseURL}/viewposition`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && Array.isArray(response.data.data)) {
          this.positions = response.data.data.map(position => ({
            id: position.id,
            value: position.id,
            label: position.teacher_postion
          }));
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    },
    async saveUser() {
      try {
        await axios.post(`${config.apiBaseURL}/registerTeacher`, this.formData);
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'User registered successfully!',
          confirmButtonColor: '#007bff',
        });
        this.isModalVisible = false;
        this.resetForm();
        this.$router.push('/manage_teachers');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Error registering user: ' + error.message,
          confirmButtonColor: '#007bff',
        });
      }
    },
    resetForm() {
      this.formData = {
        idnumber: '',
        lname: '',
        fname: '',
        mname: '',
        sex: '',
        email: '',
        password: '',
        position_id: '',
        strand_id: '',
      };
      this.validationAttempted = false; // Reset validation attempts
    }
  }
};
</script>

<style scoped>
.container-fluid {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.register-form {
  padding: 20px;
}

.form-label {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #05080b;
  font-weight: 500;
}

.form-control, .form-select {
  border-radius: 5px;
  height: 50px;
  margin-bottom: 20px;
}

/* Highlight invalid fields with red border */
.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.text-danger {
  color: #dc3545;
}

.btn-gradient {
  background: linear-gradient(45deg, #007bff, #00bfff);
  color: #120808;
  transition: background 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin: 20px;
  padding: 5px;
  width: 300px;
  text-align: center;
  font-size: 20px;
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #0056b3, #0080ff);
}

.modal.show.d-block {
  display: block;
}
</style>
