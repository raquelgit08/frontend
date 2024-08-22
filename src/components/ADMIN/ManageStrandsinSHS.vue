<template>
    <div class="container mt-4">
      <div class="title-container mb-4">
        <h5 class="text-center">Manage Strands</h5>
      </div>
  
      <div class="search-container d-flex justify-content-between mb-3">
        <div class="input-group">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search...">
          <button class="btn btn-outline-secondary" @click="openAddModal">
            <i class="bi bi-plus"></i>
          </button>
        </div>
      </div>
  
      <div class="table-container">
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>No.</th>
              <th>Strand</th>
              <th>Grade Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredList" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.addstrand }}</td>
              <td>{{ item.grade_level }}</td>
              <td>
                <button class="btn btn-warning btn-sm me-1" @click="openEditModal(item)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteItem(item.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div class="modal fade" id="addEditModal" tabindex="-1" ref="addEditModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEdit ? 'Edit' : 'Add' }} Strand</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <input type="text" v-model="newStrand" class="form-control" placeholder="Strand">
              </div>
              <div class="mb-3">
                <input type="text" v-model="newGradeLevel" class="form-control" placeholder="Grade Level">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button type="button" class="btn btn-primary" @click="saveItem">{{ isEdit ? 'Update' : 'Save' }}</button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="modal fade" id="errorModal" tabindex="-1" ref="errorModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Error</h5>
              <button type="button" class="btn-close" @click="closeErrorModal"></button>
            </div>
            <div class="modal-body">
              <p>{{ error }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" @click="closeErrorModal">OK</button>
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
    name: 'ManageStrandsinENHS',
    data() {
      return {
        searchQuery: '',
        items: [],
        newStrand: '',
        newGradeLevel: '',
        isEdit: false,
        editItemId: null,
        error: null,
      };
    },
    computed: {
      filteredList() {
        return this.items.filter(item => {
          return (
            this.searchQuery === '' || 
            item.addstrand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.grade_level.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        });
      }
    },
    methods: {
      async fetchStrands() {
        try {
          const token = localStorage.getItem('token'); 
          const response = await axios.get('http://localhost:8000/api/viewstrand', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.items = response.data.data;
        } catch (error) {
          console.error('Error fetching strands:', error);
          this.error = 'Failed to fetch strands.';
        }
      },
  
      async saveItem() {
        try {
          const token = localStorage.getItem('token'); 
  
          // Check for duplicate strand and grade level
          const isDuplicate = this.items.some(item => 
            item.addstrand.toLowerCase() === this.newStrand.toLowerCase() && 
            item.grade_level.toLowerCase() === this.newGradeLevel.toLowerCase()
          );
  
          if (isDuplicate) {
            this.error = 'This strand and grade level combination already exists.';
            this.closeModal();  // Close the Add/Edit Modal
            this.showErrorModal();  // Show the Error Modal
            return;
          }
  
          if (this.isEdit) {
            await axios.put(`http://localhost:8000/api/strands/${this.editItemId}`, {
              addstrand: this.newStrand,
              grade_level: this.newGradeLevel
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          } else {
            await axios.post('http://localhost:8000/api/addstrand', {
              addstrand: this.newStrand,
              grade_level: this.newGradeLevel
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          }
  
          await this.fetchStrands();
          this.resetForm();
          this.closeModal();
        } catch (error) {
          console.error('Error saving strand:', error);
          this.error = 'Failed to save strand.';
          this.showErrorModal();  // Show the Error Modal
        }
      },
  
      async deleteItem(id) {
        try {
          const token = localStorage.getItem('token'); 
          await axios.delete(`http://localhost:8000/api/strands/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          await this.fetchStrands();
        } catch (error) {
          console.error('Error deleting strand:', error);
          this.error = 'Failed to delete strand.';
          this.showErrorModal();  // Show the Error Modal
        }
      },
  
      openAddModal() {
        this.isEdit = false;
        this.resetForm();
        this.showModal();
      },
  
      openEditModal(item) {
        this.isEdit = true;
        this.editItemId = item.id;
        this.newStrand = item.addstrand;
        this.newGradeLevel = item.grade_level;
        this.showModal();
      },
  
      showModal() {
        const modal = new Modal(this.$refs.addEditModal);
        modal.show();
      },
  
      closeModal() {
        const modal = Modal.getInstance(this.$refs.addEditModal);
        modal.hide();
        this.resetForm();
      },
  
      showErrorModal() {
        const modal = new Modal(this.$refs.errorModal);
        modal.show();
      },
  
      closeErrorModal() {
        const modal = Modal.getInstance(this.$refs.errorModal);
        modal.hide();
      },
  
      resetForm() {
        this.newStrand = '';
        this.newGradeLevel = '';
        this.isEdit = false;
        this.editItemId = null;
      },
    },
  
    mounted() {
      this.fetchStrands();
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 10000px;
  }
  
  .title-container {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0.375rem;
  }
  
  .search-container {
    margin-bottom: 1rem;
  }
  
  .table-container {
    margin-bottom: 1rem;
  }
  
  .table {
    background-color: #ffffff;
  }
  
  .table th, .table td {
    text-align: center;
    vertical-align: middle;
  }
  
  .table td {
    color: #000;
  }
  
  .modal-backdrop.show {
    opacity: 0.5;
  }
  
  .modal-content {
    background-color: #fff;
    color: #000;
  }
  </style>
  