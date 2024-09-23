<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi bi-file-person"></i> Manage Positions</h3>
    </div>

    <!-- Search and Add Button -->
    <div class="row mb-4 justify-content-end align-items-center">
      <div class="col-md-9">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input type="text" v-model="searchQuery" class="form-control custom-select" placeholder="Search Positions...">
        </div>
      </div>
     
      <div class="col-md-3 d-flex align-items-center">
        <button class="btn btn-gradient" @click="openAddModal">
          <i class="bi bi-plus"></i> Add Position
        </button>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center mb-3">
      <i class="bi bi-hourglass-split"></i> Loading...
    </div>

    <!-- Table for Positions -->
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

               <button class="btn btn-warning btn-md me-2" @click="openEditModal(item)">
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
    <div class="modal fade" id="positionModal" tabindex="-1" ref="positionModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="modal-title"><i class="bi bi-file-person" style="padding-right: 10px;"></i>{{ isEdit ? 'Edit Position' : 'Add Position' }}</h5>
            <button type="button" class="btn-close ms-auto" @click="closeModal" aria-label="Close"></button>
          </div><br>
         
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newPosition" class="form-control custom-select" placeholder="Position Name">
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
  name: 'ManageTeacherPosition',
  data() {
    return {
      searchQuery: '',
      positions: [],
      newPosition: '',
      isEdit: false,
      editPositionId: null,
      error: null,
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
        Swal.fire('Error', this.error, 'error');
      } finally {
        this.loading = false;
      }
    },

    async checkForDuplicate() {
      const duplicate = this.positions.find(
        position =>
          position.teacher_postion.toLowerCase() === this.newPosition.toLowerCase() &&
          (!this.isEdit || position.id !== this.editPositionId)
      );

      if (duplicate) {
        this.closeModal(); // Close the modal before showing SweetAlert
        Swal.fire('Duplicate Error', 'A position with this name already exists.', 'error');
      } else {
        this.savePosition();
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
        console.error('Error saving position:', error);
        Swal.fire('Error', 'Failed to save position.', 'error');
      }
    },

    async confirmDeletePosition(id) {
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
          await this.deletePosition(id);
          Swal.fire('Deleted!', 'The position has been deleted.', 'success');
        }
      });
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
        Swal.fire('Error', 'Failed to delete position.', 'error');
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
      modal.hide();
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
