<template>
    <div class="container mt-4">
      <h5 class="text-center">Manage Curriculum</h5>
  
      <div class="d-flex justify-content-between mb-3">
        <!-- Search Bar -->
        <div class="input-group">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search Curriculum...">
        </div>
  
        <!-- Add Curriculum Button -->
        <div>
          <button class="btn btn-outline-secondary" @click="openAddModal">
            <i class="bi bi-plus"></i> Add Curriculum
          </button>
        </div>
      </div>
  
      <div>
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>No.</th>
              <th>Curriculum Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(curriculum, index) in filteredList" :key="curriculum.id">
              <td>{{ index + 1 }}</td>
              <td>{{ curriculum.Namecuriculum }}</td>
              <td>
                <button class="btn btn-warning btn-sm me-1" @click="openEditModal(curriculum)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteCurriculum(curriculum.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Add/Edit Modal -->
      <div class="modal fade" id="curriculumModal" tabindex="-1" ref="curriculumModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEdit ? 'Edit Curriculum' : 'Add Curriculum' }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <input type="text" v-model="newCurriculum" class="form-control" placeholder="Curriculum Name">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button type="button" class="btn btn-primary" @click="saveCurriculum">{{ isEdit ? 'Update' : 'Save' }}</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Duplicate Error Modal -->
      <div class="modal fade" id="duplicateModal" tabindex="-1" ref="duplicateModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Duplicate Curriculum</h5>
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
        curriculums: [],
        newCurriculum: '',
        isEdit: false,
        editCurriculumId: null,
        error: null,
        duplicateErrorMessage: '',
      };
    },
    computed: {
      filteredList() {
        return this.curriculums.filter(curriculum =>
          curriculum.Namecuriculum.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },
    methods: {
      async fetchCurriculums() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:8000/api/viewcuri', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.curriculums = response.data.data;
        } catch (error) {
          console.error('Error fetching curriculums:', error);
          this.error = 'Failed to fetch curriculums.';
        }
      },
  
      async saveCurriculum() {
        try {
          const token = localStorage.getItem('token');
          if (this.newCurriculum) {
            if (this.isEdit) {
              await axios.put(`http://localhost:8000/api/updatecuri/${this.editCurriculumId}`, {
                Namecuriculum: this.newCurriculum
              }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            } else {
              await axios.post('http://localhost:8000/api/addcuri', {
                Namecuriculum: this.newCurriculum
              }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            }
            await this.fetchCurriculums();
            this.resetForm();
            this.closeModal();
          }
        } catch (error) {
          if (error.response && error.response.status === 409) {
            this.duplicateErrorMessage = error.response.data.message;
            this.showDuplicateModal();
          } else {
            console.error('Error saving curriculum:', error);
            this.error = 'Failed to save curriculum.';
          }
        }
      },
  
      async deleteCurriculum(id) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:8000/api/deletecuri/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          await this.fetchCurriculums();
        } catch (error) {
          console.error('Error deleting curriculum:', error);
          this.error = 'Failed to delete curriculum.';
        }
      },
  
      openAddModal() {
        this.isEdit = false;
        this.resetForm();
        this.showModal();
      },
  
      openEditModal(curriculum) {
        this.isEdit = true;
        this.editCurriculumId = curriculum.id;
        this.newCurriculum = curriculum.Namecuriculum;
        this.showModal();
      },
  
      showModal() {
        const modal = new Modal(this.$refs.curriculumModal);
        modal.show();
      },
  
      closeModal() {
        const modal = Modal.getInstance(this.$refs.curriculumModal);
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
        this.newCurriculum = '';
        this.isEdit = false;
        this.editCurriculumId = null;
      }
    },
  
    mounted() {
      this.fetchCurriculums();
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 10000px;
    margin: 0 auto;
  }
  
  .table th, .table td {
    text-align: center;
  }
  
  .input-group {
    max-width: 1050px;
  }
  </style>
  