<template>
  <div class="container">
    <h5 class="text-center mb-4">Manage Subject</h5>

    <!-- Search and Add Button -->
    <div class="d-flex justify-content-between mb-4">
      <div class="search-bar-container">
        <div class="input-group search-bar">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search...">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
        </div>
      </div>
      <button class="btn btn-primary btn-gradient" @click="openAddModal">
        <i class="bi bi-plus"></i> Add Subject 
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
            <th>Subject Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredList" :key="item.id" class="align-middle">
            <td>{{ index + 1 }}</td>
            <td>{{ item.subjectname }}</td>
            <td>
              <button class="btn btn-warning btn-md me-1" @click="openEditModal(item)">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-danger btn-md" @click="deleteItem(item.id)">
                <i class="bi bi-trash"></i> Delete
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
      loading: false,
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
      this.loading = true;
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
      this.loading = false;
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
