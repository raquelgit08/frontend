<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi bi-calendar-month-fill"></i> Manage School Year</h3>
    </div>

    <!-- Search and Add Button -->
    <div class="row mb-4 justify-content-end align-items-center">
      <div class="col-md-9">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input type="text" v-model="searchQuery" class="form-control custom-select" placeholder="Search...">
        </div>
      </div>
     
      <div class="col-md-3 d-flex align-items-center">
        <button class="btn btn-gradient" @click="openAddModal">
          <i class="bi bi-plus"></i> Add School Year
        </button>
      </div>
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center mb-3">
      <i class="bi bi-hourglass-split"></i> Loading...
    </div>

    <!-- Table for School Years -->
    <div class="table-wrapper">
      <table class="table table-hover table-custom">
        <thead>
          <tr>
            <th>#</th>
            <th>School Year</th>
            <th>Status</th> <!-- Add Status Column -->
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(year, index) in filteredList" :key="year.id">
            <td>{{ index + 1 }}</td>
            <td>{{ year.addyear }}</td>
            <td>
              <!-- Display the active status -->
              <span v-if="year.is_active" class="badge bg-success">Active</span>
              <span v-else class="badge bg-secondary">Inactive</span>
            </td>
            <td>
              <button class="btn btn-md btn-info me-2" @click="toggleActive(year.id)">
                <i class="bi bi-toggle-on"></i> Toggle Active
              </button>
              <button class="btn btn-md edit me-2" @click="openEditModal(year)">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-md btn-danger" @click="confirmDeleteYear(year.id)">
                <i class="bi bi-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Year Modal -->
    <div class="modal fade" ref="yearModal" tabindex="-1" aria-labelledby="yearModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="modal-title" id="yearModalLabel"><i class="bi bi-calendar-month-fill" style="padding-right: 10px;"></i>{{ isEdit ? 'Edit Year' : 'Add Year' }}</h5>
            <button type="button" class="btn-close ms-auto" @click="closeModal" aria-label="Close"></button>
          </div><br>
       
          <div class="modal-body">
            <form @submit.prevent="saveYear">
              <div class="mb-3">
                <label for="yearInput" class="form-label">School Year</label>
                <input type="text" id="yearInput" v-model="newYear" class="form-control custom-select" required />
                <div v-if="error" class="text-danger mt-2">{{ error }}</div>
              </div>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Add' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

export default {
  name: 'SchoolYear',
  data() {
    return {
      searchQuery: '',
      years: [],
      newYear: '',
      isEdit: false,
      editYearId: null,
      error: null,
      loading: false,
    };
  },
  computed: {
    filteredList() {
      const query = this.searchQuery.toLowerCase();
      return this.years.filter(year => year.addyear.toLowerCase().includes(query));
    },
  },
  methods: {
    // Fetch all years from the API
    async fetchYears() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewyear', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.years = response.data.data;
      } catch (error) {
        this.error = 'Failed to fetch years.';
      } finally {
        this.loading = false;
      }
    },

    // Toggle active status of a year
    async toggleActive(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.put(`http://localhost:8000/api/year/toggle-active/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await this.fetchYears(); // Refresh the list after toggling
      } catch (error) {
        this.error = 'Failed to toggle activation status.';
      }
    },

    // Save a new or edited year
    async saveYear() {
      try {
        const token = localStorage.getItem('token');
        const url = this.isEdit
          ? `http://localhost:8000/api/updateyear/${this.editYearId}`
          : 'http://localhost:8000/api/addyear';
        const method = this.isEdit ? 'put' : 'post';
        
        await axios({ method, url, data: { addyear: this.newYear, is_active: false }, headers: { Authorization: `Bearer ${token}` } });
        await this.fetchYears();
        this.closeModal();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.closeModal(); // Close modal before showing SweetAlert
          this.showDuplicateError(error.response.data.message);
        } else {
          this.error = 'Failed to save year.';
        }
      }
    },

    async deleteYear(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:8000/api/deleteyear/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await this.fetchYears();
      } catch (error) {
        this.error = 'Failed to delete year.';
      }
    },

    // Confirm before deleting
    confirmDeleteYear(id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteYear(id);
          Swal.fire(
            'Deleted!',
            'Your data has been deleted.',
            'success'
          );
        }
      });
    },

    showDuplicateError(message) {
      Swal.fire({
        icon: 'error',
        title: 'Duplicate Error',
        text: message,
      });
    },

    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      this.showModal();
    },

    openEditModal(year) {
      this.isEdit = true;
      this.editYearId = year.id;
      this.newYear = year.addyear;
      this.showModal();
    },

    showModal() {
      const modal = new Modal(this.$refs.yearModal);
      modal.show();
    },

    closeModal() {
      const modal = Modal.getInstance(this.$refs.yearModal);
      modal.hide();
      this.resetForm();
    },

    resetForm() {
      this.newYear = '';
      this.isEdit = false;
      this.editYearId = null;
      this.error = null;
    },
  },
  mounted() {
    this.fetchYears();
  },
};
</script>

<style scoped>
/* Container */
.container-fluid {
  background-color: #ffffff;
  border-radius: 10px;
}
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  padding-top: 20px;
}
.form-select {
  width: 200px;
}
/* Table Wrapper */
.table-wrapper {
  margin: 10px;
  padding: 0 15px;
  max-width: 100%;
  overflow-x: auto;
}

/* Table Styles */
.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(5, 4, 4, 0.1);
  border: 1px solid #200909;
  overflow: hidden;
  margin-bottom: 120px;
}

.table-custom th {
  background-color: #0d8eead7;
  color: #000000;
  font-weight: 700;
  font-size: 20px;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.td {
  font-size: 18px;
}

.table-custom tbody tr:hover {
  background-color: #f1f3f5;
}

.table-custom tbody tr {
  transition: background-color 0.3s ease;
}

.edit {
  background-color: rgb(12, 170, 12);
  color: #ffffff;
  width: 90px;
}

.btn-danger, .edit {
  font-size: 17px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-gradient {
  background: linear-gradient(45deg, #007bff, #00bfff);
  color: #120808;
  transition: background 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px ;
  margin: 20px;
  padding: 5px;
  width: 300px;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
}

.edit:hover {
  background-color: green;
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #0056b3, #0080ff);
}

.custom-select {
  height: 45px;
  border-radius: 8px;
  border: 1px solid #ced4da;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-family: Arial, sans-serif;
  color: #495057;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.custom-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
  outline: none;
}

.custom-select::placeholder {
  color: #6c757d;
}

/* Search Bar Styles */
.input-group {
  padding-left: 32px;
}

.modal-dialog {
  width: 40%;
}

/* Modal Styles */
.modal-content {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
</style>
