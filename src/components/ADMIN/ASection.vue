<template>
  <div class="container mt-4">
    <h5 class="text-center">Manage Sections</h5>

    <div class="d-flex justify-content-between mb-3">
      <div class="input-group">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Search Sections...">
        <button class="btn btn-outline-secondary" @click="openAddModal">
          <i class="bi bi-plus"></i>
        </button>
      </div>
    </div>

    <div>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>No.</th>
            <th>Section</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(section, index) in filteredList" :key="section.id">
            <td>{{ index + 1 }}</td>
            <td>{{ section.section }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-1" @click="openEditModal(section)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteSection(section.id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveSection">{{ isEdit ? 'Update' : 'Save' }}</button>
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
      newSection: '',
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
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await axios.get('http://localhost:8000/api/viewsection', {
        headers: {
          Authorization: `Bearer ${token}` // Attach the token to the Authorization header
        }
      });
      this.sections = response.data.data;
    } catch (error) {
      console.error('Error fetching sections:', error);
      this.error = 'Failed to fetch sections.';
    }
  },

  async saveSection() {
    try {
      const token = localStorage.getItem('token');
      if (this.newSection) {
        if (this.isEdit) {
          await axios.put(`http://localhost:8000/api/updatesection/${this.editSectionId}`, {
            section: this.newSection
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          await axios.post('http://localhost:8000/api/addsection', {
            section: this.newSection
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


    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      this.showModal();
    },

    openEditModal(section) {
      this.isEdit = true;
      this.editSectionId = section.id;
      this.newSection = section.section;
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
      this.isEdit = false;
      this.editSectionId = null;
    }
  },

  mounted() {
    this.fetchSections();
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
.table th, .table td {
  text-align: center;
}
</style>