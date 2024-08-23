<template>
  <div class="container mt-4">
    <h5 class="text-center">Manage Curriculum</h5>

    <div class="d-flex justify-content-between mb-3">
      <!-- Search Bar -->
      <div class="input-group">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Search Curriculum...">
      </div>

      <!-- Add Curriculum Button -->
      <div>
        <button class="btn btn-outline-secondary" @click="openAddModal">
          <i class="bi bi-plus"></i> Add Curriculum
        </button>
      </div>
    </div>

    <div>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>No.</th>
            <th>Curriculum Name</th>
            <th>Strand</th>
            <th>Subject</th>
            <th>Semester</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(curriculum, index) in filteredList" :key="curriculum.id">
            <td>{{ index + 1 }}</td>
            <td>{{ getCurriculumName(curriculum.scuriculum_id) }}</td>
            <td>{{ getStrandName(curriculum.strand_id) }}</td>
            <td>{{ getSubjectName(curriculum.subject_id) }}</td>
            <td>{{ curriculum.semester }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-1" @click="openEditModal(curriculum)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteCurriculum(curriculum.id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="curriculumModal" tabindex="-1" ref="curriculumModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Curriculum' : 'Add Curriculum' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="scuriculum">Curriculum:</label>
              <select v-model="selectedCurriculum" class="form-control">
                <option v-for="curriculum in curriculums" :key="curriculum.id" :value="curriculum.id">
                  {{ curriculum.Namecuriculum }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="strand">Strand:</label>
              <select v-model="selectedStrand" class="form-control" @change="filterGradeLevel">
                <option v-for="strand in strands" :key="strand.id" :value="strand.id">
                  {{ strand.addstrand }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="gradeLevel">Grade Level:</label>
              <select v-model="selectedGradeLevel" class="form-control">
                <option v-for="level in filteredGradeLevels" :key="level" :value="level">
                  {{ level }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="subject">Subject:</label>
              <select v-model="selectedSubject" class="form-control">
                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                  {{ subject.subjectname }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="semester">Semester:</label>
              <input type="text" v-model="newSemester" class="form-control" placeholder="Semester">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveCurriculum">{{ isEdit ? 'Update' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Duplicate Error Modal -->
    <div class="modal fade" id="duplicateModal" tabindex="-1" ref="duplicateModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Duplicate Entry</h5>
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
  name: 'SemesterinENHS',
  data() {
    return {
      searchQuery: '',
      curriculums: [],  // Store the curriculum names
      curriculumEntries: [],  // Store the full curriculum details
      strands: [],
      subjects: [],
      newSemester: '',
      selectedCurriculum: null,
      selectedStrand: null,
      selectedGradeLevel: null,
      selectedSubject: null,
      filteredGradeLevels: [],
      isEdit: false,
      editCurriculumId: null,
      error: null,
      duplicateErrorMessage: '',
    };
  },
  computed: {
    filteredList() {
      if (!Array.isArray(this.curriculumEntries)) {
        return [];
      }

      return this.curriculumEntries.filter(entry => {
        const name = entry?.strandcurriculum?.Namecuriculum || '';
        return name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    async fetchCurriculums() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewcuri', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.curriculums = response.data.data;
      } catch (error) {
        console.error('Error fetching curriculums:', error);
        this.error = 'Failed to fetch curriculums.';
      }
    },

    async fetchCurriculumEntries() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewcuriculum', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Curriculum Entries:', response.data.data); // Log the data to check the structure
        this.curriculumEntries = response.data.data;
      } catch (error) {
        console.error('Error fetching curriculum entries:', error);
        this.error = 'Failed to fetch curriculum entries.';
      }
    },
    getCurriculumName(id) {
      const curriculum = this.curriculums.find(c => c.id === id);
      return curriculum ? curriculum.Namecuriculum : '';
    },
    getStrandName(id) {
      const strand = this.strands.find(s => s.id === id);
      return strand ? strand.addstrand : '';
    },
    getSubjectName(id) {
      const subject = this.subjects.find(s => s.id === id);
      return subject ? subject.subjectname : '';
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

    async fetchSubjects() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewsubject', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.subjects = response.data.data;
      } catch (error) {
        console.error('Error fetching subjects:', error);
        this.error = 'Failed to fetch subjects.';
      }
    },

    filterGradeLevel() {
      const selectedStrand = this.strands.find(strand => strand.id === this.selectedStrand);
      if (selectedStrand) {
        this.filteredGradeLevels = [selectedStrand.grade_level];
      } else {
        this.filteredGradeLevels = [];
      }
    },

    async saveCurriculum() {
      try {
        const token = localStorage.getItem('token');
        const data = {
          scuriculum_id: this.selectedCurriculum,
          strand_id: this.selectedStrand,
          subject_id: this.selectedSubject,
          semester: this.newSemester,
        };

        if (this.isEdit) {
          await axios.put(`http://localhost:8000/api/updatecuri/${this.editCurriculumId}`, data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          await axios.post('http://localhost:8000/api/addcuriculum', data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        await this.fetchCurriculumEntries(); // Fetch the updated list after saving
        this.resetForm();
        this.closeModal();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.duplicateErrorMessage = error.response.data.message;
          this.showDuplicateModal();
        } else {
          console.error('Error saving curriculum:', error);
          this.error = 'Failed to save curriculum.';
        }
      }
    },

    async deleteCurriculum(id) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/deletecuri/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await this.fetchCurriculumEntries(); // Fetch the updated list after deletion
      } catch (error) {
        console.error('Error deleting curriculum:', error);
        this.error = 'Failed to delete curriculum.';
      }
    },

    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      this.showModal();
    },

    openEditModal(curriculum) {
      this.isEdit = true;
      this.editCurriculumId = curriculum.id;
      this.selectedCurriculum = curriculum.scuriculum_id;
      this.selectedStrand = curriculum.strand_id;
      this.selectedSubject = curriculum.subject_id;
      this.newSemester = curriculum.semester;
      this.showModal();
    },

    showModal() {
      const modal = new Modal(this.$refs.curriculumModal);
      modal.show();
    },

    closeModal() {
      const modal = Modal.getInstance(this.$refs.curriculumModal);
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
      this.selectedCurriculum = null;
      this.selectedStrand = null;
      this.selectedGradeLevel = null;
      this.selectedSubject = null;
      this.newSemester = '';
      this.isEdit = false;
      this.editCurriculumId = null;
      this.filteredGradeLevels = [];
    }
  },

  async mounted() {
    await this.fetchCurriculums(); // Fetch curriculum names
    await this.fetchCurriculumEntries(); // Fetch full curriculum details
    await this.fetchStrands(); // Fetch strands
    await this.fetchSubjects(); // Fetch subjects
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

.input-group {
  max-width: 1050px;
}
</style>
