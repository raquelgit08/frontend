<template>
  <div class="container mt-4">
    <div class="title-container mb-4">
      <h5 class="text-center">Manage Subjects</h5>
    </div>

    <div class="search-container d-flex justify-content-between mb-3 align-items-center">
      <div class="input-group">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Search...">
      </div>

      <div>
        <button class="btn btn-primary" @click="openAddModal">
          <i class="bi bi-plus"></i> Add Subject
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="table table-hover table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>No.</th>
            <th>Subject Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredList" :key="item.id" class="align-middle">
            <td>{{ index + 1 }}</td>
            <td>{{ item.subjectname }}</td>
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

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="addEditModal" tabindex="-1" ref="addEditModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit' : 'Add' }} Subject</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newSubjectName" class="form-control" placeholder="Subject Name">
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveItem">{{ isEdit ? 'Update' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Duplicate Error Modal -->
    <div class="modal fade" id="duplicateModal" tabindex="-1" ref="duplicateModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Duplicate Subject</h5>
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
  name: 'SubjectManagement',
  data() {
    return {
      searchQuery: '',
      items: [],
      newSubjectName: '',
      isEdit: false,
      editItemId: null,
      error: null,
      duplicateErrorMessage: '',
    };
  },
  computed: {
    filteredList() {
      return this.items.filter(item => {
        return (
          this.searchQuery === '' || 
          item.subjectname.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  },
  methods: {
    async fetchSubjects() {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://localhost:8000/api/viewsubject', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.items = response.data.data;
      } catch (error) {
        console.error('Error fetching subjects:', error);
        this.error = 'Failed to fetch subjects.';
      }
    },

    async saveItem() {
      try {
        const token = localStorage.getItem('token'); 
        if (this.isEdit) {
          await axios.put(`http://localhost:8000/api/updatesubject/${this.editItemId}`, {
            subjectname: this.newSubjectName
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          await axios.post('http://localhost:8000/api/addsubject', {
            subjectname: this.newSubjectName
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        await this.fetchSubjects();
        this.resetForm();
        this.closeModal();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.duplicateErrorMessage = error.response.data.message;
          this.closeModal();
          this.showDuplicateModal();
        } else {
          console.error('Error saving subject:', error);
          this.error = 'Failed to save subject.';
        }
      }
    },

    async deleteItem(id) {
      try {
        const token = localStorage.getItem('token'); 
        await axios.delete(`http://localhost:8000/api/deletesubject/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await this.fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
        this.error = 'Failed to delete subject.';
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
      this.newSubjectName = item.subjectname;
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

    showDuplicateModal() {
      const modal = new Modal(this.$refs.duplicateModal);
      modal.show();
    },

    closeDuplicateModal() {
      const modal = Modal.getInstance(this.$refs.duplicateModal);
      modal.hide();
      this.resetForm();
    },

    resetForm() {
      this.newSubjectName = '';
      this.isEdit = false;
      this.editItemId = null;
    },
  },

  mounted() {
    this.fetchSubjects();
  }
};
</script>

<style scoped>
.container {
  max-width: 1000px;
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
