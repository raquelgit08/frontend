<template>
  <div class="container">
    <h5 class="text-center mb-4">Manage Position</h5>

    <!-- Search and Add Button -->
    <div class="d-flex justify-content-between mb-4">
      <div class="search-bar-container">
        <div class="input-group search-bar">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search Positions...">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
        </div>
      </div>
      <button class="btn btn-primary btn-gradient" @click="openAddModal">
        <i class="bi bi-plus"></i> Add Position
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
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(position, index) in filteredList" :key="position.id" class="align-middle">
            <td>{{ index + 1 }}</td>
            <td>{{ position.teacher_postion }}</td>
            <td>
              <button class="btn btn-warning btn-md me-1" @click="openEditModal(position)">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-danger btn-md" @click="deletePosition(position.id)">
                <i class="bi bi-trash"></i>Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

   <!-- Add/Edit Modal -->
   <div class="modal fade" id="positionModal" tabindex="-1" ref="positionModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-center w-100">{{ isEdit ? 'Edit Position' : 'Add Position' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newPosition" class="form-control" placeholder="Position Name">
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="savePosition">{{ isEdit ? 'Update' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Duplicate Error Modal -->
    <div class="modal fade" id="duplicateModal" tabindex="-1" ref="duplicateModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-center w-100">Duplicate Position</h5>
            <button type="button" class="btn-close" @click="closeDuplicateModal"></button>
          </div>
          <div class="modal-body">
            <p>{{ duplicateErrorMessage }}</p>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button type="button" class="btn btn-secondary" @click="closeDuplicateModal">Close</button>
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
  name: 'ManageTeacherPosition',
  data() {
    return {
      searchQuery: '',
      positions: [],
      newPosition: '',
      isEdit: false,
      editPositionId: null,
      error: null,
      duplicateErrorMessage: '',
      loading: false,
    };
  },
  computed: {
    filteredList() {
      return this.positions.filter(position =>
        position.teacher_postion.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchPositions() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewposition', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.positions = response.data.data;
      } catch (error) {
        console.error('Error fetching positions:', error);
        this.error = 'Failed to fetch positions.';
      }
      this.loading = false;
    },

    async savePosition() {
      try {
        const token = localStorage.getItem('token');
        if (this.newPosition) {
          if (this.isEdit) {
            await axios.put(`http://localhost:8000/api/updateposition/${this.editPositionId}`, {
              teacher_postion: this.newPosition
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          } else {
            await axios.post('http://localhost:8000/api/addposition', {
              teacher_postion: this.newPosition
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          await this.fetchPositions();
          this.resetForm();
          this.closeModal();
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.duplicateErrorMessage = error.response.data.message;
          this.showDuplicateModal();
        } else {
          console.error('Error saving position:', error);
          this.error = 'Failed to save position.';
        }
      }
    },

    async deletePosition(id) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/deleteposition/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await this.fetchPositions();
      } catch (error) {
        console.error('Error deleting position:', error);
        this.error = 'Failed to delete position.';
      }
    },

    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      this.showModal();
    },

    openEditModal(position) {
      this.isEdit = true;
      this.editPositionId = position.id;
      this.newPosition = position.teacher_postion;
      this.showModal();
    },

    showModal() {
      const modal = new Modal(this.$refs.positionModal);
      modal.show();
    },

    closeModal() {
      const modal = Modal.getInstance(this.$refs.positionModal);
      if (modal) modal.hide();
      this.resetForm();
    },

    showDuplicateModal() {
      const modal = new Modal(this.$refs.duplicateModal);
      modal.show();
    },

    closeDuplicateModal() {
      const modal = Modal.getInstance(this.$refs.duplicateModal);
      if (modal) modal.hide();
      this.resetForm();
    },

    resetForm() {
      this.newPosition = '';
      this.isEdit = false;
      this.editPositionId = null;
    }
  },

  mounted() {
    this.fetchPositions();
  }
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

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}
</style>
