<template>
  <div class="container mt-4">
    <h5 class="text-center">Manage School Year</h5>

    <div class="d-flex justify-content-between mb-3">
      <!-- Search Bar -->
      <div class="input-group">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Search Years...">
      </div>

      <!-- Add School Year Button -->
      <div>
        <button class="btn btn-outline-secondary" @click="openAddModal">
          <i class="bi bi-plus"></i> Add School Year
        </button>
      </div>
    </div>

    <div>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>No.</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(year, index) in filteredList" :key="year.id">
            <td>{{ index + 1 }}</td>
            <td>{{ year.addyear }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-1" @click="openEditModal(year)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteYear(year.id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="yearModal" tabindex="-1" ref="yearModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Year' : 'Add Year' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newYear" class="form-control" placeholder="Year Name">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveYear">{{ isEdit ? 'Update' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Duplicate Error Modal -->
    <div class="modal fade" id="duplicateModal" tabindex="-1" ref="duplicateModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Duplicate Year</h5>
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
  name: 'SchoolYear',
  data() {
    return {
      searchQuery: '',
      years: [],
      newYear: '',
      isEdit: false,
      editYearId: null,
      error: null,
      duplicateErrorMessage: '',
    };
  },
  computed: {
    filteredList() {
      return this.years.filter(year => {
        return year.addyear.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    async fetchYears() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewyear', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.years = response.data.data;
      } catch (error) {
        console.error('Error fetching years:', error);
        this.error = 'Failed to fetch years.';
      }
    },

    async saveYear() {
      try {
        const token = localStorage.getItem('token');
        if (this.newYear) {
          if (this.isEdit) {
            await axios.put(`http://localhost:8000/api/updateyear/${this.editYearId}`, {
              addyear: this.newYear
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          } else {
            await axios.post('http://localhost:8000/api/addyear', {
              addyear: this.newYear
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          await this.fetchYears();
          this.resetForm();
          this.closeModal();
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.duplicateErrorMessage = error.response.data.message;
          this.closeModal();
          this.showDuplicateModal();
        } else {
          console.error('Error saving year:', error);
          this.error = 'Failed to save year.';
        }
      }
    },

    async deleteYear(id) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/deleteyear/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await this.fetchYears();
      } catch (error) {
        console.error('Error deleting year:', error);
        this.error = 'Failed to delete year.';
      }
    },

    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      this.showModal();
    },

    openEditModal(year) {
      this.isEdit = true;
      this.editYearId = year.id;
      this.newYear = year.addyear;
      this.showModal();
    },

    showModal() {
      const modal = new Modal(this.$refs.yearModal);
      modal.show();
    },

    closeModal() {
      const modal = Modal.getInstance(this.$refs.yearModal);
      modal.hide();
      this.resetForm();
    },

    showDuplicateModal() {
      const modal = new Modal(this.$refs.duplicateModal);
      modal.show();
    },

    closeDuplicateModal() {
      const modal = Modal.getInstance(this.$refs.duplicateModal);
      modal.hide();
      this.resetForm();
    },

    resetForm() {
      this.newYear = '';
      this.isEdit = false;
      this.editYearId = null;
    }
  },

  mounted() {
    this.fetchYears();
  }
};
</script>

<style scoped>
.container {
  max-width: 10000px;
  margin: 0 auto;
}

.table th, .table td {
  text-align: center;
}

.input-group{
  max-width: 1050px;

}
</style>
