<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi bi-file-earmark-text-fill"></i> Manage Subjects</h3>
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
          <i class="bi bi-plus"></i> Add Subject
        </button>
      </div>
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center mb-3">
      <i class="bi bi-hourglass-split"></i> Loading...
    </div>

    <!-- Table for Subjects -->
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
              <button class="btn edit btn-md me-2" @click="openEditModal(item)">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-danger btn-md" @click="confirmDeleteItem(item.id)">
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
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="modal-title">
              <i class="bi bi-file-earmark-text-fill" style="padding-right: 10px;"></i>
              {{ isEdit ? 'Edit' : 'Add' }} Subject
            </h5>
            <button type="button" class="btn-close ms-auto" @click="closeModal" aria-label="Close"></button>
          </div><br>
         
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newSubjectName" class="form-control custom-select" placeholder="Subject Name">
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="checkForDuplicate">{{ isEdit ? 'Update' : 'Save' }}</button>
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
  name: 'SubjectManagement',
  data() {
    return {
      searchQuery: '',
      items: [],
      newSubjectName: '',
      isEdit: false,
      editItemId: null,
      error: null,
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
        Swal.fire('Error', this.error, 'error');
      } finally {
        this.loading = false;
      }
    },

    async checkForDuplicate() {
      const duplicate = this.items.find(
        item =>
          item.subjectname.toLowerCase() === this.newSubjectName.toLowerCase() &&
          (!this.isEdit || item.id !== this.editItemId)
      );

      if (duplicate) {
        this.closeModal(); // Close the modal before showing the SweetAlert
        Swal.fire('Duplicate Error', 'A subject with this name already exists.', 'error');
      } else {
        this.saveItem();
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
        console.error('Error saving subject:', error);
        Swal.fire('Error', 'Failed to save subject.', 'error'); 
      }
    },

    async confirmDeleteItem(id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.deleteItem(id);
          Swal.fire('Deleted!', 'Your subject has been deleted.', 'success');
        }
      });
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
        Swal.fire('Error', 'Failed to delete subject.', 'error');
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
    background-color: #FF0060;
}
.btn-gradient {
    background: linear-gradient(45deg, #007bff, #00bfff);
    color: #120808;
    transition: background 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
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
