<template>
  <div class="container">
    <h5 class="text-center mb-4">Manage School Year</h5>

    <!-- Search and Add Button -->
    <div class="d-flex justify-content-between mb-4">
      <div class="search-bar-container">
        <div class="input-group search-bar">
          <input type="text" v-model="searchQuery" class="form-control"   placeholder="Search Years..."/>
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
        </div>
      </div>
      <button class="btn btn-primary btn-gradient" @click="openAddModal">
        <i class="bi bi-plus"></i> Add School Year
      </button>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(year, index) in filteredList" :key="year.id">
            <td>{{ index + 1 }}</td>
            <td>{{ year.addyear }}</td>
            <td>
              <button class="btn btn-md btn-warning me-2" @click="openEditModal(year)">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-md btn-danger" @click="deleteYear(year.id)">
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
          <div class="modal-header">
            <h5 class="modal-title" id="yearModalLabel">{{ isEdit ? 'Edit Year' : 'Add Year' }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveYear">
              <div class="mb-3">
                <label for="yearInput" class="form-label">School Year</label>
                <input
                  type="text"
                  id="yearInput"
                  v-model="newYear"
                  class="form-control"
                  required
                />
                <div v-if="error" class="text-danger mt-2">{{ error }}</div>
                <div v-if="duplicateErrorMessage" class="text-danger mt-2">{{ duplicateErrorMessage }}</div>
              </div>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Add' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Duplicate Error Modal -->
    <div class="modal fade" ref="duplicateModal" tabindex="-1" aria-labelledby="duplicateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="duplicateModalLabel">Duplicate Error</h5>
            <button type="button" class="btn-close" @click="closeDuplicateModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>{{ duplicateErrorMessage }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

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
      duplicateErrorMessage: '',
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

    async saveYear() {
      try {
        const token = localStorage.getItem('token');
        const url = this.isEdit
          ? `http://localhost:8000/api/updateyear/${this.editYearId}`
          : 'http://localhost:8000/api/addyear';
        const method = this.isEdit ? 'put' : 'post';
        
        await axios({ method, url, data: { addyear: this.newYear }, headers: { Authorization: `Bearer ${token}` } });
        await this.fetchYears();
        this.resetForm();
        this.closeModal();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.duplicateErrorMessage = error.response.data.message;
          this.closeModal();
          this.showDuplicateModal();
        } else {
          this.error = 'Failed to save year.';
        }
      }
    },

    async deleteYear(id) {
      try {
        const token = localStorage.getItem('token');
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

    showDuplicateModal() {
      const modal = new Modal(this.$refs.duplicateModal);
      modal.show();
    },

    closeDuplicateModal() {
      const modal = Modal.getInstance(this.$refs.duplicateModal);
      modal.hide();
    },

    resetForm() {
      this.newYear = '';
      this.isEdit = false;
      this.editYearId = null;
      this.error = null;
      this.duplicateErrorMessage = '';
    },
  },
  mounted() {
    this.fetchYears();
  },
};
</script>

<style scoped>
/* Container */
.container {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  background-color: #eaeaea; /* Gray background */
  min-height: 100vh; /* Ensure container spans full viewport height */
}

/* Search Bar Container */
.search-bar-container {
  flex-grow: 1;
  margin-right: 15px; /* Space between search bar and add button */
}

/* Search Bar Styles */
.search-bar .form-control {
  border-radius: 5px;
  border: 1px solid #ced4da;
}

.search-bar .input-group-text {
  background-color: #ffffff;
  border-left: none;
  border-radius: 5px;
}

/* Button Styles */
.btn-gradient {
  background: linear-gradient(45deg, #007bff, #00bfff);
  border: none;
  color: #fff;
  transition: background 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #0056b3, #0080ff);
}


/* Table Wrapper */
.table-wrapper {
  margin: 0 auto;
  padding: 0 15px;
  max-width: 100%;
  overflow-x: auto;
}

/* Table Styles */
.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #d0d0d0;
  overflow: hidden;
}

.table-custom th {
  background-color: #f8f9fa;
  color: #333;
  text-align: left;
  padding: 12px;
  padding-left: 50px;
  font-weight: 600;
}
.table th, .table td {
  text-align: center;
  vertical-align: middle;
}
.table-custom td {
  padding: 12px;
  padding-left: 50px;
  vertical-align: middle;
  color: #555;
}

.table-custom tbody tr:hover {
  background-color: #f1f3f5;
}

.table-custom tbody tr {
  transition: background-color 0.3s ease;
}

/* Modal Styles */
.modal-content {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
</style>
