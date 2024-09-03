<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi bi-grid-fill"></i> Manage Strand Curriculum</h3>
    </div>
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
            <i class="bi bi-plus"></i> Add Strand Curriculum
          </button>
        </div>
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
            <th>Strand Curriculum Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(strandCurriculum, index) in filteredList" :key="strandCurriculum.id">
            <td>{{ index + 1 }}</td>
            <td>{{ strandCurriculum.Namecuriculum }}</td>
            <td>
              <button class="btn edit btn-md me-2" @click="openEditModal(strandCurriculum)">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-danger btn-md" @click="deleteStrandCurriculum(strandCurriculum.id)">
                <i class="bi bi-trash"></i> Delete
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
        <div class="modal-content ">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="modal-title"><i class="bi bi-grid-fill " style="padding-right: 10px;"></i>{{ isEdit ? 'Edit Strand Curriculum' : 'Add Strand Curriculum' }}</h5>
              <button type="button" class="btn-close ms-auto" @click="closeModal" aria-label="Close"></button>
          </div><br>
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newStrandCurriculum" class="form-control custom-select" placeholder="Strand Curriculum Name">
            </div>
          </div>
        
          <div class="d-flex justify-content-end gap-2 mt-3">
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
      loading:false,
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
      this.loading = true;
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
      this.loading = false;
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
  .td{
    font-size: 18px;
  }

  .table-custom tbody tr:hover {
    background-color: #f1f3f5;
  }

  .table-custom tbody tr {
    transition: background-color 0.3s ease;
  }
  .edit{
    background-color: rgb(12, 170, 12);
    color: #ffffff;
    width: 90px;
  }
  .btn-danger, .edit{
    font-size: 17px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .btn-gradient {
  background: linear-gradient(45deg, #007bff, #00bfff);
  color: #120808;
  transition: background 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px ;
  margin: 20px;
  padding: 5px;
  width: 300px;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
}
.edit:hover{
  background-color: green;
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #0056b3, #0080ff);
}

.custom-select {
  height: 45px;
  border-radius: 8px; /* Rounded corners */
  border: 1px solid #ced4da; /* Light border color */
  background-color: #ffffff; /* White background */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  font-size: 16px; /* Font size for better readability */
  font-family: Arial, sans-serif; /* Font family */
  color: #495057; /* Text color */
  transition: border-color 0.3s, box-shadow 0.3s; /* Smooth transition for focus */
}

.custom-select:focus {
  border-color: #007bff; /* Border color on focus */
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25); /* Shadow on focus */
  outline: none; /* Remove default outline */
}

.custom-select::placeholder {
  color: #6c757d; /* Placeholder text color */
}
/* Search Bar Styles */
.input-group{
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
