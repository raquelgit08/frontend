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
              <i class="fa fa-plus fa-3x"></i>
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
            <label for="curriculum">Curriculum</label>
            <select class="form-control" id="curriculum" v-model="selectedCurriculumId" @change="fetchCurriculumDetails">
              <option value="">Select Curriculum</option>
              <option v-for="curriculum in curriculums" :key="curriculum.id" :value="curriculum.id">
                <!-- {{ curriculum.Namecuriculum }} -->
                {{ curriculum.scuriculum_id }}
              </option>
            </select>
          </div>


            <div v-if="curriculumDetails.strand">
              <div class="form-group">
                <label for="strand">Strand</label>
                <input type="text" class="form-control" id="strand" v-model="curriculumDetails.strand.addstrand" readonly>
              </div>

              <div class="form-group">
                <label for="gradeLevel">Grade Level</label>
                <input type="text" class="form-control" id="gradeLevel" v-model="curriculumDetails.gradeLevel" readonly>
              </div>

              <div class="form-group">
                <label for="semester">Semester</label>
                <input type="text" class="form-control" id="semester" v-model="curriculumDetails.semester" readonly>
              </div>

              <div class="form-group">
                <label for="subject">Subjects</label>
                <ul>
                  <li v-for="subject in curriculumDetails.subjects" :key="subject.id">
                    {{ subject.subjectname }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="form-group">
              <label for="section">Section</label>
              <select v-model="newClass.section" id="section" class="form-select" required>
                <option value="">Select Section</option>
                <option v-for="section in sections" :key="section.id" :value="section.id">
                  {{ section.label }}
                </option>
              </select>
            </div>


            <div class="form-group">
              <label for="year">Year</label>
              <input type="text" class="form-control" id="year" v-model="newClass.year">
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
import { Modal } from 'bootstrap';

export default {
  name: 'TeacherAddSubject',
  data() {
    return {
      selectedCurriculumId: '',
      curriculumDetails: {
        gradeLevel: '',
        strand: {
          addstrand: ''
        },
        subjects: [],
        semester: '',
        Namecuriculum:''
      },
      sections: [],
      classes: [], // To hold the list of classes
      curriculums: [], // To hold the list of available curriculums
      newClass: this.getEmptyClass(),
    };
  },
  mounted() {
    this.fetchCurriculums();
    this.fetchSections();
  },
  methods: {
    getEmptyClass() {
      return {
        curriculum: '',
        strand: '',
        gradeLevel: '',
        section: '',
        semester: '',
        year: '',
        description: '',
        image: '',
        code: '',
        progress: 0
      };
    },
    openModal() {
      this.newClass = this.getEmptyClass(); // Reset form
      this.curriculumDetails = { strand: { addstrand: '' }, gradeLevel: '', subjects: [], semester: '' }; // Reset details
      const modalElement = document.getElementById('addClassModal');
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newClass.image = URL.createObjectURL(file); // Preview image
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
    async addClass() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:8000/api/addclass', this.newClass, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Class created:', response.data);
        this.classes.push({ ...this.newClass });
        const modalElement = document.getElementById('addClassModal');
        const modalInstance = Modal.getInstance(modalElement);
        modalInstance.hide();
      } catch (error) {
        console.error('Error creating class:', error);
      }
    },
    async fetchCurriculumDetails() {
      if (this.selectedCurriculumId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8000/api/viewcuriculum/${this.selectedCurriculumId}/details`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.curriculumDetails = response.data.data;
        } catch (error) {
          console.error('Error fetching curriculum details:', error);
        }
      } else {
        this.curriculumDetails = { strand: { addstrand: '' }, gradeLevel: '', subjects: [], semester: '' }; // Reset details
      }
    },
    async fetchCurriculums() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewcuriculum', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.curriculums = response.data.data;
        console.log(this.curriculums); // Log the data to verify
      } catch (error) {
        console.error('Error fetching curriculums:', error);
      }
    },
    async fetchSections() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/viewsection', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.sections = response.data.data;
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    }
  }
};
</script>


<style scoped>
.add-class-card {
  border: 2px dashed #ccc;
  height: 200px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border-color 0.3s ease;
}
.add-class-card:hover {
  border-color: #007bff;
}
.plus-icon {
  color: #007bff;
}
.upload-area {
  border: 2px dashed #007bff;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
  position: relative;
  height: 150px;
  background-color: #f8f9fa;
}
.upload-area:hover {
  border-color: #0056b3;
}
.upload-area .custom-file-input {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}
.upload-message {
  color: #007bff;
  font-size: 16px;
  font-weight: bold;
  line-height: 150px;
}
.img-thumbnail {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
