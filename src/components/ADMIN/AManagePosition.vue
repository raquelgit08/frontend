<template>
  <div class="container mt-4">
    <h5 class="text-center">Manage Positions</h5>

    <div class="d-flex justify-content-between mb-3 align-items-center">
      <!-- Search Bar -->
      <div class="input-group">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Search Positions...">
      </div>

      <!-- Add Position Button -->
      <div>
        <button class="btn btn-primary" @click="openAddModal">
          <i class="bi bi-plus"></i> Add Position
        </button>
      </div>
    </div>

    <div>
      <table class="table table-hover table-bordered">
        <thead class="table-dark">
          <tr>
            <th>No.</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(position, index) in filteredList" :key="position.id" class="align-middle">
            <td>{{ index + 1 }}</td>
            <td>{{ position.teacher_postion }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-1" @click="openEditModal(position)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-danger btn-sm" @click="deletePosition(position.id)">
                <i class="bi bi-trash"></i>
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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h5 {
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

.input-group {
  max-width: 400px;
  flex-grow: 1;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.table {
  margin-top: 20px;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
}

.btn-close {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
}

.btn-close:hover {
  color: #000;
  text-decoration: none;
  opacity: 0.75;
}

.modal-content {
  border-radius: 8px;
}

.modal-title {
  font-weight: bold;
}

@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    align-items: stretch;
  }

  .input-group, .btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .table {
    font-size: 14px;
  }
}
</style>