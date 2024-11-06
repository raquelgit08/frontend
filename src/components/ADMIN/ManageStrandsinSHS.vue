<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi-book-half"></i> Manage Strand</h3>
    </div>
      
    <!-- Search and Add Button -->
    <div class="row mb-4 justify-content-end align-items-center">
      <div class="col-md-9">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input type="text" v-model="searchQuery" class="form-control custom-select" placeholder="Search Strand Curriculum...">
        </div>
      </div>
     
      <div class="col-md-3 d-flex align-items-center">
        <button class="btn  btn-gradient" @click="openAddModal">
          <i class="bi bi-plus"></i> Add Strand
        </button>
      </div>
    </div>

    <!-- Loading Indicator --> 
    <div v-if="loading" class="text-center mb-3">
      <i class="bi bi-hourglass-split"></i> Loading...
    </div>

    <div class="table-wrapper">
      <table class="table table-hover table-custom">
        <thead>
          <tr>
            <th>#</th>
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

    <!-- Add/Edit Strand Modal -->
    <div class="modal fade" id="addEditModal" tabindex="-1" ref="addEditModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="modal-title"><i class="bi-book-half" style="padding-right: 10px;"></i>{{ isEdit ? 'Edit' : 'Add' }} Strand</h5>
            <button type="button" class="btn-close ms-auto" @click="closeModal" aria-label="Close"></button>
          </div><br>
            
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newStrand" class="form-control custom-select" placeholder="Strand">
            </div>
            <div class="mb-3">
              <input type="text" v-model="newGradeLevel" class="form-control custom-select" placeholder="Grade Level">
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn " style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);" @click="closeModal">Cancel</button>
            <button type="button" class="btn " style="background-color: antiquewhite;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);" @click="saveItem">{{ isEdit ? 'Update' : 'Save' }}</button>
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
import config from '@/config';

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
      loading: false,
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
      this.loading = true;
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${config.apiBaseURL}/viewstrand`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.items = response.data.data;
      } catch (error) {
        console.error('Error fetching strands:', error);
        this.error = 'Failed to fetch strands.';
        Swal.fire('Error', this.error, 'error');
      } finally {
        this.loading = false;
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
          Swal.fire('Duplicate Error', this.error, 'error');  // Show SweetAlert for error
          return;
        }

        if (this.isEdit) {
          await axios.put(`${config.apiBaseURL}/strands/${this.editItemId}`, {
            addstrand: this.newStrand,
            grade_level: this.newGradeLevel
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          await axios.post(`${config.apiBaseURL}/addstrand`, {
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
        Swal.fire('Error', this.error, 'error');  // Show SweetAlert for error
      }
    },
  
    async deleteItem(id) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${config.apiBaseURL}/strands/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await this.fetchStrands();
      } catch (error) {
        console.error('Error deleting strand:', error);
        this.error = 'Failed to delete strand.';
        Swal.fire('Error', this.error, 'error');  // Show SweetAlert for error
      }
    },

    confirmDeleteItem(id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteItem(id);
          Swal.fire('Deleted!', 'Your strand has been deleted.', 'success');
        }
      });
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
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border: 1px solid #200909;
  overflow: hidden;
  margin-bottom: 120px;
}

.table-custom th {
  background-color: #c1c1c1d7;
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
  background-color: #FFEE63;
  color: #000000;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  width: 90px;
}

.btn-danger, .edit {
  font-size: 17px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.btn-gradient {
  background: linear-gradient(45deg, #c4c5c5, #9fa0a0);
  color: #120808;
  transition: background 0.3s ease;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px ;
  margin: 20px;
  padding: 5px;
  width: 300px;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
}

.edit:hover {
  background-color: rgb(163, 155, 4);
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #b2b3b4, #eff0f0);
  
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
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
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