<template>
  <div class="container mt-4">
    <h5 class="text-center">Manage Strand Curriculum</h5>

    <div class="d-flex justify-content-between mb-3">
      <!-- Search Bar -->
      <div class="input-group">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Search Strand Curriculum...">
      </div>

      <!-- Add Strand Curriculum Button -->
      <div>
        <button class="btn btn-outline-secondary" @click="openAddModal">
          <i class="bi bi-plus"></i> Add Strand Curriculum
        </button>
      </div>
    </div>

    <div>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>No.</th>
            <th>Strand Curriculum Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(strandCurriculum, index) in filteredList" :key="strandCurriculum.id">
            <td>{{ index + 1 }}</td>
            <td>{{ strandCurriculum.Namecuriculum }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-1" @click="openEditModal(strandCurriculum)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteStrandCurriculum(strandCurriculum.id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="strandCurriculums.length === 0">
            <td colspan="3" class="text-center">No Strand Curriculums Found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="strandCurriculumModal" tabindex="-1" ref="strandCurriculumModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Strand Curriculum' : 'Add Strand Curriculum' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newStrandCurriculum" class="form-control" placeholder="Strand Curriculum Name">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveStrandCurriculum">{{ isEdit ? 'Update' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Duplicate Error Modal -->
    <div class="modal fade" id="duplicateModal" tabindex="-1" ref="duplicateModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Duplicate Strand Curriculum</h5>
            <button type="button" class="btn-close" @click="closeDuplicateModal"></button>
          </div>
          <div class="modal-body">
            <p>{{ duplicateErrorMessage }}</p>
          </div>
          <div class="modal-footer">
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
  name: 'ManageCurricuminENHS',
  data() {
    return {
      searchQuery: '',
      strandCurriculums: [],
      newStrandCurriculum: '',
      isEdit: false,
      editStrandCurriculumId: null,
      error: null,
      duplicateErrorMessage: '',
    };
  },
  computed: {
    filteredList() {
      return this.strandCurriculums.filter(strandCurriculum =>
        strandCurriculum.Namecuriculum.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchStrandCurriculums() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewcuri', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.strandCurriculums = response.data.data;
        console.log("Fetched Strand Curriculums:", this.strandCurriculums); // Debugging log
      } catch (error) {
        console.error('Error fetching strand curriculums:', error);
        this.error = 'Failed to fetch strand curriculums.';
      }
    },

    async saveStrandCurriculum() {
      try {
        const token = localStorage.getItem('token');
        if (this.newStrandCurriculum) {
          if (this.isEdit) {
            await axios.put(`http://localhost:8000/api/updatecuri/${this.editStrandCurriculumId}`, {
              Namecuriculum: this.newStrandCurriculum
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          } else {
            await axios.post('http://localhost:8000/api/addcuri', {
              Namecuriculum: this.newStrandCurriculum
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          await this.fetchStrandCurriculums();
          this.resetForm();
          this.closeModal();
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.duplicateErrorMessage = error.response.data.message;
          this.showDuplicateModal();
        } else {
          console.error('Error saving strand curriculum:', error);
          this.error = 'Failed to save strand curriculum.';
        }
      }
    },

    async deleteStrandCurriculum(id) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/deletecuri/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await this.fetchStrandCurriculums();
      } catch (error) {
        console.error('Error deleting strand curriculum:', error);
        this.error = 'Failed to delete strand curriculum.';
      }
    },

    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      this.showModal();
    },

    openEditModal(strandCurriculum) {
      this.isEdit = true;
      this.editStrandCurriculumId = strandCurriculum.id;
      this.newStrandCurriculum = strandCurriculum.Namecuriculum;
      this.showModal();
    },

    showModal() {
      const modal = new Modal(this.$refs.strandCurriculumModal);
      modal.show();
    },

    closeModal() {
      const modal = Modal.getInstance(this.$refs.strandCurriculumModal);
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
      this.newStrandCurriculum = '';
      this.isEdit = false;
      this.editStrandCurriculumId = null;
    }
  },

  mounted() {
    this.fetchStrandCurriculums();
  }
};
</script>

<style scoped>
.container {
  max-width: 1050px;
  margin: 0 auto;
}

.table th, .table td {
  text-align: center;
}

.input-group {
  max-width: 1050px;
}
</style>
