<template>
  <div class="container mt-4">
    <h5 class="text-center">Create Class</h5>

    <div class="row">
      <!-- Existing classes -->
      <div v-for="(classItem, index) in classes" :key="index" class="col-md-3">
        <div class="card">
          <img :src="classItem.image" class="card-img-top" alt="Class Image">
          <div class="card-body">
            <h5 class="card-title">{{ classItem.name }}</h5>
            <p class="card-text">{{ classItem.description }}</p>
            <p class="card-text"><strong>Completed:</strong> {{ classItem.progress }}%</p>
          </div>
        </div>
      </div>

      <!-- Add class card -->
      <div class="col-md-3">
        <div class="card add-class-card" @click="openModal">
          <div class="card-body d-flex justify-content-center align-items-center">
            <div class="plus-icon">
              <i class="fa fa-plus fa-3x" @click="openModal"></i> <!-- Ensure this triggers modal -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for creating a new class -->
    <div class="modal fade" id="addClassModal" tabindex="-1" aria-labelledby="addClassModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addClassModalLabel">Add New Class</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label for="curriculum" class="form-label">Curriculum:</label>
              <select v-model="newClass.curriculum_id" id="curriculum" class="form-select" @change="onCurriculumChange" required>
                <option value="">Select Curriculum</option>
                <option v-for="curriculum in curriculums" :key="curriculum.id" :value="curriculum.id">
                  {{ curriculum.Namecuriculum }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="strand">Strand:</label>
              <select v-model="newClass.strand_id" id="strand" class="form-select" required>
                <option value="">Select Strand</option>
                <option v-for="strand in strands" :key="strand.id" :value="strand.id">
                  {{ strand.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="section" class="form-label">Section:</label>
              <select v-model="newClass.section_id" id="section" class="form-select" required>
                <option value="">Select Section</option>
                <option v-for="section in filteredSections" :key="section.id" :value="section.id">
                      {{ section.label }}
                    </option>
              </select>
            </div>

            <div class="form-group">
              <label for="semester">Semester</label>
              <select v-model="newClass.semester" id="semester" class="form-select" required>
                <option value="">Select Semester</option>
                <option value="first">First Semester</option>
                <option value="second">Second Semester</option>
              </select>
            </div>

            <div class="form-group">
              <label for="subject">Subjects</label>
              <select v-model="newClass.subject_id" id="subjects" class="form-select" required>
                <option value="">Select Subjects</option>
                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                      {{ subject.label }}
                    </option>
              </select>
              
            </div>

            <div class="form-group">
              <label for="year">Year</label>
              <select v-model="newClass.year_id" id="subjects" class="form-select" required>
                <option value="">Select Subjects</option>
                <option v-for="year in years" :key="year.id" :value="year.id">
                      {{ year.label }}
                    </option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">Class Description</label>
              <textarea class="form-control" id="description" v-model="newClass.description"></textarea>
            </div>

            <!-- Upload Picture -->
            <div class="form-group">
              <label for="picture">Upload Picture</label>
              <div class="upload-area" @dragover.prevent @drop.prevent="onFileDrop">
                <input type="file" class="custom-file-input" id="picture" @change="onFileChange" ref="fileInput">
                <div v-if="!newClass.image" class="upload-message">Drag and drop an image here, or click to select one</div>
                <img v-if="newClass.image" :src="newClass.image" class="img-thumbnail" alt="Preview Image" />
              </div>
            </div>

            <div class="form-group">
              <label for="code">Generate Code</label>
              <div class="input-group">
                <input type="text" class="form-control" id="code" v-model="newClass.code" readonly>
                <button class="btn btn-secondary" @click="generateCode">Generate Code</button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="addClass">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap'; // Make sure you have Bootstrap JavaScript imported

export default {
  name: 'TeacherAddSubject',
  data() {
    return {
      
      newClass: {
        curriculum_id: '',
        strand_id: '',
        section_id: '',
        gradeLevel: '',
        subject_id: '',
        year_id: '',
        semester: '',
        year: '',
        description: '',
        image: '',
        code: '',
        progress: 0
      },
      strands: [],
      sections: [],
      curriculums: [],
      subjects:[],
      years: [],
      filteredSections: []
    };
  },
  mounted() {
    this.fetchCurriculums();
    this.fetchSections();
    this.fetchStrands();
    this.fetchSubjects();
    this.fetchYear();
  },
  watch: {
    'newClass.strand_id': 'filterSections' // Watch for changes to strand_id
  },
  methods: {
    openModal() {
      const modalElement = document.getElementById('addClassModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newClass.image = URL.createObjectURL(file);
      }
    },
    onFileDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file) {
        this.$refs.fileInput.files = event.dataTransfer.files;
        this.onFileChange({ target: { files: [file] } });
      }
    },
    generateCode() {
      this.newClass.code = Math.random().toString(36).substring(2, 8).toUpperCase();
    },
    fetchCurriculums() {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:8000/api/viewcuri', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          this.curriculums = response.data.data;
        } else {
          console.error('Unexpected response format:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching curriculums:', error);
      });
    },
    async fetchStrands() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewstrand', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && Array.isArray(response.data.data)) {
          this.strands = response.data.data.map(strand => ({
            id: strand.id,
            value: `${strand.id} ${strand.grade_level}`,
            label: `${strand.addstrand} ${strand.grade_level}`
          }));
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching strands:', error);
      }
    },
    async fetchSections() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewsection', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.sections && Array.isArray(response.data.sections)) {
          this.sections = response.data.sections.map(section => ({
            id: section.id,
            strand_id: section.strand.id,
            value: section.id,
            label: `${section.section}`
          }));
          this.filterSections();
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    },
    filterSections() {
      this.filteredSections = this.sections.filter(
        section => section.strand_id === this.newClass.strand_id
      );
    },
    async fetchSubjects() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewsubject', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && Array.isArray(response.data.data)) {
          this.subjects = response.data.data.map(subject => ({
            id: subject.id,
            value: `${subject.id} `,
            label: `${subject.subjectname} `
          }));
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching strands:', error);
      }
    },
    async fetchYear() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewyear', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && Array.isArray(response.data.data)) {
          this.years = response.data.data.map(year => ({
            id: year.id,
            value: `${year.id} `,
            label: `${year.addyear} `
          }));
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching strands:', error);
      }
    },
    async addClass() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('http://localhost:8000/api/addclass', {
          curriculum: this.newClass.curriculum_id,
          strand_id: this.newClass.strand_id,
          section_id: this.newClass.section_id,
          subject_id: this.newClass.subject_id,
          year_id: this.newClass.year_id,
          semester: this.newClass.semester,
          description: this.newClass.description,
          image: this.newClass.image,
          gen_code: this.newClass.code
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          console.log('Class created successfully:', response.data);
          // Handle successful creation (e.g., close the modal, clear form, refresh class list)
          const modalElement = document.getElementById('addClassModal');
          const modal = Modal.getInstance(modalElement);
          modal.hide();
        } else {
          console.error('Error creating class:', response.data);
        }
      } catch (error) {
        console.error('Error adding class:', error);
      }
    }
  }
};
</script>

<style scoped>
.add-class-card {
  cursor: pointer;
  border: 2px dashed #ccc;
  background-color: #f8f9fa;
}

.plus-icon {
  color: #007bff;
}

.upload-area {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.upload-area:hover {
  background-color: #f8f9fa;
}

.upload-message {
  color: #888;
  margin-top: 10px;
}
</style>
