<template>
  <div class="container mt-4">
    <div class="title-container mb-4">
      <h5 class="text-center">Manage Grade Levels</h5>
    </div>

    <div class="search-container d-flex justify-content-between mb-3">
      <div class="input-group">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Search...">
        <button class="btn btn-outline-secondary" @click="openAddModal">
          <i class="bi bi-plus"></i>
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>No.</th>
            <th>Grade Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredList" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.glevel }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-1" @click="openEditModal(item)">
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

    <div class="modal fade" id="addEditModal" tabindex="-1" ref="addEditModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit' : 'Add' }} Grade Level</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newGradeLevel" class="form-control" placeholder="Grade Level">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveItem">{{ isEdit ? 'Update' : 'Save' }}</button>
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
  name: 'YearLevel',
  data() {
    return {
      searchQuery: '',
      items: [],
      newGradeLevel: '',
      isEdit: false,
      editItemId: null,
      error: null,
    };
  },
  computed: {
    filteredList() {
      return this.items.filter(item => {
        return (
          this.searchQuery === '' || 
          item.glevel.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  },
  methods: {
    async fetchGradeLevels() {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://localhost:8000/api/viewgradelevel', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.items = response.data.data;
      } catch (error) {
        console.error('Error fetching grade levels:', error);
        this.error = 'Failed to fetch grade levels.';
      }
    },

    async saveItem() {
      try {
        const token = localStorage.getItem('token'); 
        if (this.isEdit) {
          await axios.put(`http://localhost:8000/api/updategradelevel/${this.editItemId}`, {
            glevel: this.newGradeLevel
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          await axios.post('http://localhost:8000/api/addgradelevel', {
            glevel: this.newGradeLevel
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        await this.fetchGradeLevels(); // Ensure this is awaited to update items
        this.resetForm();
        this.closeModal();
      } catch (error) {
        console.error('Error saving grade level:', error);
        this.error = 'Failed to save grade level.';
      }
    },

    async deleteItem(id) {
      try {
        const token = localStorage.getItem('token'); 
        await axios.delete(`http://localhost:8000/api/deletegradelevel/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await this.fetchGradeLevels(); // Ensure this is awaited to update items
      } catch (error) {
        console.error('Error deleting grade level:', error);
        this.error = 'Failed to delete grade level.';
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
      this.newGradeLevel = item.glevel;
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
      this.newGradeLevel = '';
      this.isEdit = false;
      this.editItemId = null;
    },
  },

  mounted() {
    this.fetchGradeLevels();
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}
</style>
