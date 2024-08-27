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
              <label for="curriculum" class="form-label">Curriculum:</label>
              <select v-model="formData.curriculum_id" id="curriculum" class="form-select" @change="onCurriculumChange" required>
                <option value="">Select Curriculum</option>
                <option v-for="curriculum in curriculums" :key="curriculum.id" :value="curriculum.id">
                  {{ curriculum.Namecuriculum }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="strand">Strand:</label>
              <input type="text" class="form-control" id="strand" v-model="curriculumDetails.strands" readonly>
            </div>

            <div class="form-group">
              <label for="section" class="form-label">Section:</label>
              <select v-model="formData.section_id" id="section" class="form-select" required>
                <option value="">Select Section</option>
                    <option v-for="section in sections" :key="section.id" :value="section.id">
                      {{ section.label }}
                    </option>
              </select>
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
              <select v-model="formData.subject_id" id="subjects" class="form-select" required>
                <option value="">Select Subjects</option>
                <option v-for="subject in curriculumDetails.subjects" :key="subject.id" :value="subject.id">
                  {{curriculumDetails.subjects }}
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
      formData: {
        curriculum_id: '',
        strand_id: '',
        section_id: '',
        subject_id: ''
      },
      curriculumDetails: {
        gradeLevel: '',
        strands: [], // Ensure this is always an array
        semester: '',
        subjectname: '',
        subjects: []
      },
      sections: [],
      curriculums: [], // List of available curriculums
      newClass: {
        curriculum_id: '',
        strand_id: '',
        section_id: '',
        gradeLevel: '',
        subjects:'',
        semester: '',
        year: '',
        description: '',
        image: '',
        code: '',
        progress: 0
      },
      filteredSections: [] // Ensure this is defined
    };
  },
  mounted() {
    this.fetchCurriculums();
    this.fetchSections(); // Fetch sections initially if needed
  },
  methods: {
    openModal() {
      this.newClass = {
        curriculum_id: '',
        strand_id: '',
        section_id: '',
        gradeLevel: '',
        semester: '',
        year: '',
        description: '',
        image: '',
        code: '',
        progress: 0
      };
      this.curriculumDetails = { gradeLevel: '', strands: [], semester: '', subjects: [] };
      const modalElement = document.getElementById('addClassModal');
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
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
      axios.get('http://localhost:8000/api/viewcuriculum3', {
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
    onCurriculumChange() {
      const selectedCurriculum = this.curriculums.find(curriculum => curriculum.id === this.formData.curriculum_id);
      if (selectedCurriculum) {
        this.curriculumDetails.gradeLevel = selectedCurriculum.grade_level;
        this.curriculumDetails.semester = selectedCurriculum.semester;
        this.curriculumDetails.subjects = selectedCurriculum.subjectname || [];
        this.curriculumDetails.strands = selectedCurriculum.addstrand || []; // Ensure it's an array
        this.formData.strand_id = ''; // Reset strand id
        this.filteredSections = [];
        this.fetchSections(); // Fetch sections for the selected curriculum
        console.log(this.curriculumDetails);

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
            value: section.section,
            label: `${section.section}`
          }));
          // this.filterSections(); // Initialize filtered sections
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    },
    // filterSections() {
    //   if (this.formData.strand_id) {
    //     this.filteredSections = this.sections.filter(section => section.strand_id === this.formData.strand_id);
    //   } else {
    //     this.filteredSections = [];
    //   }
    // },
    addClass() {
      // Add class logic here
    }
  },
  watch: {
    'formData.strand_id': function() {
      this.filterSections(); // Filter sections whenever the strand id changes
    }
  }
};
</script>


<style scoped>
.upload-area {
  border: 2px dashed #ccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}
.upload-message {
  font-size: 1.2em;
  color: #999;
}
.plus-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-class-card {
  border: 2px dashed #007bff;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
}
.add-class-card:hover {
  background-color: #f8f9fa;
}
.card-img-top {
  height: 150px;
  object-fit: cover;
}
</style>
