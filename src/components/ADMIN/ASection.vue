<template>
  <div class="container mt-4">
    <div class="title-container mb-4">
      <h5 class="text-center">Manage Strands</h5>
    </div>

    <div class="search-container d-flex justify-content-between mb-3">
      <div class="input-group search-bar">
        <input
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Search..."
        />
        <button class="btn btn-outline-secondary" @click="openAddModal">
          <i class="bi bi-plus"></i>
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="table table-bordered table-striped shadow-sm">
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
              <button
                class="btn btn-warning btn-sm me-1"
                @click="openEditModal(item)"
              >
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
            <h5 class="modal-title">{{ isEdit ? 'Edit' : 'Add' }} Strand</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input
                type="text"
                v-model="newStrand"
                class="form-control rounded-pill"
                placeholder="Strand"
              />
            </div>
            <div class="mb-3">
              <input
                type="text"
                v-model="newGradeLevel"
                class="form-control rounded-pill"
                placeholder="Grade Level"
              />
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary btn-gradient"
              @click="saveItem"
            >
              {{ isEdit ? 'Update' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
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
          <div class="modal-footer d-flex justify-content-center">
            <button type="button" class="btn btn-danger" @click="closeErrorModal">
              OK
            </button>
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
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

h5 {
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: "Arial", sans-serif;
  text-align: center;
}

.search-bar .input-group-text {
  background-color: #fff;
  border-left: none;
}

.input-group {
  max-width: 100%;
  flex-grow: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.btn-gradient {
  background: linear-gradient(45deg, #007bff, #00bfff);
  border: none;
  color: #fff;
  transition: background 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #0056b3, #0080ff);
}

.table {
  margin-top: 20px;
  width: 100%; /* Ensure the table fits within its container */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  table-layout: fixed; /* Prevents columns from stretching excessively */
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
  overflow-wrap: break-word; /* Ensure long words break appropriately */
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
  background-color: #f9f9f9;
}

.modal-title {
  font-weight: bold;
}

@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    align-items: stretch;
  }

  .input-group,
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .table {
    font-size: 14px;
    width: 100%; /* Ensure the table adapts to smaller screens */
  }

  .table th,
  .table td {
    padding: 10px 5px; /* Adjust padding for smaller screens */
  }
}
</style>
