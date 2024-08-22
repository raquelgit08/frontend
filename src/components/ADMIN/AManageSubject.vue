<template>
  <div class="container mt-4">
    <div class="title-container mb-4">
      <h5 class="text-center">Manage Subjects</h5>
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
            <th>Subject Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredList" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.subjectname }}</td>
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
            <h5 class="modal-title">{{ isEdit ? 'Edit' : 'Add' }} Subject</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" v-model="newSubjectName" class="form-control" placeholder="Subject Name">
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
  name: 'SubjectManagement',
  data() {
    return {
      searchQuery: '',
      items: [],
      newSubjectName: '',
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
          item.subjectname.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  },
  methods: {
    async fetchSubjects() {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://localhost:8000/api/viewsubject', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.items = response.data.data;
      } catch (error) {
        console.error('Error fetching subjects:', error);
        this.error = 'Failed to fetch subjects.';
      }
    },

    async saveItem() {
      try {
        const token = localStorage.getItem('token'); 
        if (this.isEdit) {
          await axios.put(`http://localhost:8000/api/updatesubject/${this.editItemId}`, {
            subjectname: this.newSubjectName
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          await axios.post('http://localhost:8000/api/addsubject', {
            subjectname: this.newSubjectName
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        await this.fetchSubjects();
        this.resetForm();
        this.closeModal();
      } catch (error) {
        console.error('Error saving subject:', error);
        this.error = 'Failed to save subject.';
      }
    },

    async deleteItem(id) {
      try {
        const token = localStorage.getItem('token'); 
        await axios.delete(`http://localhost:8000/api/deletesubject/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await this.fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
        this.error = 'Failed to delete subject.';
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
      this.newSubjectName = item.subjectname;
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
      this.newSubjectName = '';
      this.isEdit = false;
      this.editItemId = null;
    },
  },

  mounted() {
    this.fetchSubjects();
  }
};
</script>

<style scoped>
.container {
  max-width: 10000px;
  margin: 0 auto;
}
</style>
