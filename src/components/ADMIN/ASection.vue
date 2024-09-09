<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi bi-folder2-open"></i> Manage Sections</h3>
    </div>

    <!-- Search and Add Button -->
    <div class="row mb-4 justify-content-end align-items-center">
      <div class="col-md-9">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input type="text" v-model="searchQuery" class="form-control custom-select" placeholder="Search Subject...">
        </div>
      </div>
      
      <div class="col-md-3 d-flex align-items-center">
        <button class="btn btn-gradient" @click="openAddModal">
          <i class="bi bi-plus"></i> Add Section
        </button>
      </div>
    </div>
    
    <!-- Table for Sections -->
    <div class="table-wrapper">
      <table class="table table-hover table-custom">
        <thead>
          <tr>
            <th>#</th>
            <th>Strand</th>
            <th>Grade Level</th>
            <th>Section</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(section, index) in filteredList" :key="section.id">
            <td>{{ index + 1 }}</td>
            <td>{{ section.strand.addstrand }}</td>
            <td>{{ section.strand.grade_level }}</td>
            <td>{{ section.section }}</td>
            <td>
              <button class="btn edit btn-md me-2" @click="openEditModal(section)">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-danger btn-md" @click="confirmDeleteSection(section.id)">
                <i class="bi bi-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Section Modal -->
    <div class="modal fade" id="sectionModal" tabindex="-1" ref="sectionModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="modal-title"><i class="bi bi-folder2-open" style="padding-right: 10px;"></i>{{ isEdit ? 'Edit Section' : 'Add Section' }} </h5>
            <button type="button" class="btn-close ms-auto" @click="closeModal" aria-label="Close"></button>
          </div><br>
          
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newSection" class="form-control custom-select" placeholder="Section Name">
            </div>
            <div class="mb-3">
              <select v-model="selectedStrand" class="form-control custom-select" @change="onStrandChange">
                <option value="" disabled>Select Strand</option>
                <option v-for="strand in strands" :key="strand.id" :value="strand.id">
                  {{ strand.addstrand }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <select v-model="selectedGradeLevel" class="form-control custom-select" :disabled="!availableGradeLevels.length">
                <option value="" disabled>Select Grade Level</option>
                <option v-for="gradeLevel in availableGradeLevels" :key="gradeLevel" :value="gradeLevel">
                  {{ gradeLevel }}
                </option>
              </select>
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
  name: 'SectioninSHS',
  data() {
    return {
      searchQuery: '',
      sections: [],
      strands: [],
      availableGradeLevels: [],
      newSection: '',
      selectedStrand: '',
      selectedGradeLevel: '',
      isEdit: false,
      editSectionId: null,
      error: null,
      loading: false,
    };
  },
  computed: {
    filteredList() {
      return this.sections.filter(section => {
        return section.section.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    async fetchSections() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewsection', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.sections = response.data.sections;
      } catch (error) {
        console.error('Error fetching sections:', error);
        this.error = 'Failed to fetch sections.';
        Swal.fire('Error', this.error, 'error');
      } finally {
        this.loading = false;
      }
    },

    async fetchStrands() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewstrand', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.strands = response.data.data;
      } catch (error) {
        console.error('Error fetching strands:', error);
        this.error = 'Failed to fetch strands.';
        Swal.fire('Error', this.error, 'error');
      }
    },

    async checkForDuplicate() {
      const duplicate = this.sections.find(
        section =>
          section.section.toLowerCase() === this.newSection.toLowerCase() &&
          section.strand.id === this.selectedStrand &&
          section.strand.grade_level === this.selectedGradeLevel &&
          (!this.isEdit || section.id !== this.editSectionId)
      );

      if (duplicate) {
        this.closeModal();  // Close the Add/Edit modal before showing the SweetAlert
        Swal.fire('Duplicate Error', 'A section with this name, strand, and grade level already exists.', 'error');
      } else {
        this.saveSection();
      }
    },

    async saveSection() {
      try {
        const token = localStorage.getItem('token');
        if (this.newSection && this.selectedGradeLevel && this.selectedStrand) {
          if (this.isEdit) {
            await axios.put(`http://localhost:8000/api/updatesection/${this.editSectionId}`, {
              section: this.newSection,
              grade_level: this.selectedGradeLevel,
              strand_id: this.selectedStrand
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          } else {
            await axios.post('http://localhost:8000/api/addsection', {
              section: this.newSection,
              grade_level: this.selectedGradeLevel,
              strand_id: this.selectedStrand
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          await this.fetchSections();
          this.resetForm();
          this.closeModal();
        }
      } catch (error) {
        console.error('Error saving section:', error);
        this.error = 'Failed to save section.';
        Swal.fire('Error', this.error, 'error');
      }
    },

    async confirmDeleteSection(id) {
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
          await this.deleteSection(id);
          Swal.fire('Deleted!', 'Section has been deleted.', 'success');
        }
      });
    },

    async deleteSection(id) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/deletesection/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await this.fetchSections();
      } catch (error) {
        console.error('Error deleting section:', error);
        this.error = 'Failed to delete section.';
        Swal.fire('Error', this.error, 'error');
      }
    },

    onStrandChange() {
      const selectedStrand = this.strands.find(strand => strand.id === this.selectedStrand);
      if (selectedStrand) {
        this.availableGradeLevels = [selectedStrand.grade_level];
        this.selectedGradeLevel = selectedStrand.grade_level;
      } else {
        this.availableGradeLevels = [];
        this.selectedGradeLevel = '';
      }
    },

    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      this.showModal();
    },

    openEditModal(section) {
      this.isEdit = true;
      this.editSectionId = section.id;
      this.newSection = section.section;
      this.selectedStrand = section.strand.id;
      this.onStrandChange();
      this.selectedGradeLevel = section.grade_level;
      this.showModal();
    },

    showModal() {
      const modal = new Modal(this.$refs.sectionModal);
      modal.show();
    },

    closeModal() {
      const modal = Modal.getInstance(this.$refs.sectionModal);
      modal.hide();
      this.resetForm();
    },

    resetForm() {
      this.newSection = '';
      this.selectedStrand = '';
      this.selectedGradeLevel = '';
      this.editSectionId = null;
    }
  },

  mounted() {
    this.fetchSections();
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
