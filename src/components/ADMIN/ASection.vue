<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi bi-folder2-open"></i>Manage Sections</h3>
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
          <button class="btn  btn-gradient" @click="openAddModal">
            <i class="bi bi-plus"></i> Add Section
          </button>
        </div>
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

              <button class="btn edit btn-md me-2" @click="openEditModal(section)">
    <i class="bi bi-pencil"></i> Edit
</button>
<button class="btn btn-danger btn-md" @click="confirmDeleteItem(section.id)">
    <i class="bi bi-trash"></i> Delete
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
                  {{ strand.label }}
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
import Swal from 'sweetalert2';

import config from '@/config';

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
        const response = await axios.get(`${config.apiBaseURL}/viewsection`, {
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
        const response = await axios.get(`${config.apiBaseURL}/viewstrand`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && Array.isArray(response.data.data)) {
          this.strands = response.data.data.map(strand => ({
            id: strand.id,
            value: `${strand.addstrand} ${strand.grade_level}`,
            label: `${strand.addstrand} ${strand.grade_level}`
          }));
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching strands:', error);
      }
      this.loading = false;
    },
    async checkForDuplicate() {
  const duplicate = this.sections.find(
    section =>
      section.section.toLowerCase() === this.newSection.toLowerCase() &&
      section.strand_id === this.selectedStrand &&
      (!this.isEdit || section.id !== this.editSectionId)
  );

  if (duplicate) {
    this.closeModal();  // Close the Add/Edit modal before showing the duplicate modal
    this.showDuplicateModal();
  } else {
    this.saveSection();
  }
},
  
async saveSection() {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: this.isEdit ? 'You are about to update this section.' : 'You are about to add a new section.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, proceed!'
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('token');
      if (this.newSection && this.selectedStrand) {
        if (this.isEdit) {
          await axios.put(`${config.apiBaseURL}/updatesection/${this.editSectionId}`, {
            section: this.newSection,
            grade_level: this.selectedGradeLevel,
            strand_id: this.selectedStrand
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          await axios.post(`${config.apiBaseURL}/addsection`, {
            section: this.newSection,
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
        Swal.fire('Success!', 'The section has been saved.', 'success');
      }
    } catch (error) {
      console.error('Error saving section:', error);
      this.error = 'Failed to save section.';
      Swal.fire('Error!', 'There was an error saving the section.', 'error');
    }
  }
},
    async confirmDeleteItem(id) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this section!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      await this.deleteSection(id);
      Swal.fire('Deleted!', 'Your section has been deleted.', 'success');
    }
  },

  async deleteSection(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiBaseURL}/deletesection/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await this.fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      this.error = 'Failed to delete section.';
      Swal.fire('Error!', 'Failed to delete the section.', 'error');
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