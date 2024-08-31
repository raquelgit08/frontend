<template>
  <div class="container">
    <h5 class="text-center mb-4">Manage Section</h5>

    <!-- Search and Add Button -->
    <div class="d-flex justify-content-between mb-4">
      <div class="search-bar-container">
        <div class="input-group search-bar">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search Section...">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
        </div>
      </div>
      <button class="btn btn-primary btn-gradient" @click="openAddModal">
        <i class="bi bi-plus"></i> Add Section
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
              <button class="btn btn-warning btn-md me-1" @click="openEditModal(section)">
                <i class="bi bi-pencil"></i>Edit
              </button>
              <button class="btn btn-danger btn-md" @click="deleteSection(section.id)">
                <i class="bi bi-trash"></i>Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit -->
    <div class="modal fade" id="sectionModal" tabindex="-1" ref="sectionModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Section' : 'Add Section' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newSection" class="form-control" placeholder="Section Name">
            </div>
            <div class="mb-3">
              <select v-model="selectedStrand" class="form-control" @change="onStrandChange">
                <option value="" disabled>Select Strand</option>
                <option v-for="strand in strands" :key="strand.id" :value="strand.id">
                  {{ strand.addstrand }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <select v-model="selectedGradeLevel" class="form-control" :disabled="!availableGradeLevels.length">
                <option value="" disabled>Select Grade Level</option>
                <option v-for="gradeLevel in availableGradeLevels" :key="gradeLevel" :value="gradeLevel">
                  {{ gradeLevel }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="checkForDuplicate">{{ isEdit ? 'Update' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </div>


    <!-- Duplicate Error Modal -->
    <div class="modal fade" id="duplicateModal" tabindex="-1" ref="duplicateModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Duplicate Section</h5>
            <button type="button" class="btn-close" @click="closeDuplicateModal"></button>
          </div>
          <div class="modal-body">
            <p>A section with this name, strand, and grade level already exists.</p>
          </div>
          <div class="modal-footer">
            <button type="button"  class="btn btn-danger" @click="closeDuplicateModal">OK</button>
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
      }
      this.loading = false;
    },

    async checkForDuplicate() {
      const duplicate = this.sections.find(
        section =>
          section.section.toLowerCase() === this.newSection.toLowerCase() &&
          section.strand.id === this.selectedStrand &&
          section.strand.grade_level === this.selectedGradeLevel
      );

      if (duplicate) {
        this.closeModal();  // Close the Add/Edit modal before showing the duplicate modal
        this.showDuplicateModal();
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
      }
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
    },

    showDuplicateModal() {
      const modal = new Modal(this.$refs.duplicateModal);
      modal.show();
    },

    closeDuplicateModal() {
      const modal = Modal.getInstance(this.$refs.duplicateModal);
      modal.hide();
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
