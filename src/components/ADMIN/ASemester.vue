<template>
    <div class="container mt-4">
      <h5 class="text-center">Manage Semester</h5>
  
      <div class="d-flex justify-content-between mb-3">
        <div class="input-group">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search Semesters...">
          <button class="btn btn-outline-secondary" @click="openAddModal">
            <i class="bi bi-plus"></i>
          </button>
        </div>
      </div>
  
      <div>
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>No.</th>
              <th>Semester</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(semester, index) in filteredList" :key="semester.id">
              <td>{{ index + 1 }}</td>
              <td>{{ semester.sem }}</td>
              <td>{{ semester.status ? 'Active' : 'Inactive' }}</td>
              <td>
                <button class="btn btn-warning btn-sm me-1" @click="openEditModal(semester)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteSemester(semester.id)">
                  <i class="bi bi-trash"></i>
                </button>
                <button class="btn btn-secondary btn-sm" @click="toggleStatus(semester)">
                  <i class="bi bi-toggle-{{ semester.status ? 'on' : 'off' }}"></i> 
                  {{ semester.status ? 'Set Inactive' : 'Set Active' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Add/Edit Modal -->
      <div class="modal fade" id="semesterModal" tabindex="-1" ref="semesterModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEdit ? 'Edit Semester' : 'Add Semester' }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <input type="text" v-model="newSemester" class="form-control" placeholder="Semester Name">
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="newSemesterStatus">
                <label class="form-check-label">Is Active?</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button type="button" class="btn btn-primary" @click="saveSemester">{{ isEdit ? 'Update' : 'Save' }}</button>
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
    name: 'SemesterinENHS',
    data() {
      return {
        searchQuery: '',
        semesters: [],
        newSemester: '',
        newSemesterStatus: true,
        isEdit: false,
        editSemesterId: null,
        error: null,
      };
    },
    computed: {
      filteredList() {
        return this.semesters.filter(semester => {
          return semester.sem.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      }
    },
    methods: {
      async fetchSemesters() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:8000/api/viewsemester', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.semesters = response.data.data;
        } catch (error) {
          console.error('Error fetching semesters:', error);
          this.error = 'Failed to fetch semesters.';
        }
      },
  
      async saveSemester() {
        try {
          const token = localStorage.getItem('token');
          if (this.newSemester) {
            const payload = {
              sem: this.newSemester,
              status: this.newSemesterStatus
            };
  
            if (this.isEdit) {
              await axios.put(`http://localhost:8000/api/updatesemester/${this.editSemesterId}`, payload, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            } else {
              await axios.post('http://localhost:8000/api/addsemester', payload, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            }
  
            await this.fetchSemesters();
            this.resetForm();
            this.closeModal();
          }
        } catch (error) {
          console.error('Error saving semester:', error);
        }
      },
  
      async deleteSemester(id) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:8000/api/deletesemester/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          await this.fetchSemesters();
        } catch (error) {
          console.error('Error deleting semester:', error);
        }
      },
  
      async toggleStatus(semester) {
        try {
          const token = localStorage.getItem('token');
          const newStatus = !semester.status;
          await axios.put(`http://localhost:8000/api/togglesemesterstatus/${semester.id}`, { status: newStatus }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          await this.fetchSemesters();
        } catch (error) {
          console.error('Error updating status:', error);
        }
      },
  
      openAddModal() {
        this.isEdit = false;
        this.resetForm();
        this.showModal();
      },
  
      openEditModal(semester) {
        this.isEdit = true;
        this.editSemesterId = semester.id;
        this.newSemester = semester.sem;
        this.newSemesterStatus = semester.status;
        this.showModal();
      },
  
      showModal() {
        const modal = new Modal(this.$refs.semesterModal);
        modal.show();
      },
  
      closeModal() {
        const modal = Modal.getInstance(this.$refs.semesterModal);
        modal.hide();
        this.resetForm();
      },
  
      resetForm() {
        this.newSemester = '';
        this.newSemesterStatus = true;
        this.isEdit = false;
        this.editSemesterId = null;
      }
    },
  
    mounted() {
      this.fetchSemesters();
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
  }
  .table th, .table td {
    text-align: center;
  }
  </style>
  