<template>
  <div>
    <h1>My Classes</h1>
    <div class="row">
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
              <select class="form-control" id="curriculum" v-model="newClass.curriculum" @change="filterSubjects">
                <option v-for="curriculum in curriculums" :key="curriculum.id" :value="curriculum.id">
                  {{ curriculum.Namecuriculum }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="strand">Strand</label>
              <select class="form-control" id="strand" v-model="newClass.strand" @change="filterGradeLevels">
                <option v-for="strand in strands" :key="strand.id" :value="strand.id">
                  {{ strand.addstrand }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="gradeLevel">Grade Level</label>
              <select v-model="newClass.gradeLevel" class="form-control">
                <option v-for="level in filteredGradeLevels" :key="level" :value="level">
                  {{ level }}
                </option>
              </select> 
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <select class="form-control" id="subject" v-model="newClass.subject">
                <option v-for="subject in filteredSubjects" :key="subject.id" :value="subject.id">
                  {{ subject.subjectname }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="section">Section</label>
              <input type="text" class="form-control" id="section" v-model="newClass.section">
            </div>

            <div class="form-group">
              <label for="semester">Semester</label>
              <select class="form-control" id="semester" v-model="newClass.semester">
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
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

            <div class="form-group">
              <label for="picture">Upload Picture</label>
              <div class="upload-area" @dragover.prevent @dragenter.prevent @dragleave.prevent @drop.prevent="onFileDrop">
                <input type="file" class="custom-file-input" id="picture" @change="onFileChange" ref="fileInput">
                <div class="upload-message" v-if="!newClass.image">Drag and drop an image here, or click to select one</div>
                <img v-if="newClass.image" :src="newClass.image" class="img-thumbnail" alt="Preview Image" />
              </div>
            </div>

            <div class="form-group">
              <label for="code">Generate Code</label>
              <div class="input-group">
                <input type="text" class="form-control" id="code" v-model="newClass.code" readonly>
                <div class="input-group-append">
                  <button class="btn btn-secondary" @click="generateCode">Generate Code</button>
                </div>
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
      newClass: this.getEmptyClass(),
      classes: [],
      curriculums: [],
      strands: [],
      subjects: [],
      gradeLevels: [],
      filteredGradeLevels: [],
      filteredSubjects: [],
    };
  },
  methods: {
    getEmptyClass() {
      return {
        curriculum: '',
        subject: '',
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
    async fetchCurriculums() {
      try {
        const response = await axios.get('http://localhost:8000/api/getCurriculums', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.curriculums = response.data;
        console.log('Curriculums fetched:', this.curriculums);
      } catch (error) {
        console.error('Error fetching curriculums:', error);
      }
    },
    async fetchStrands() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewstrand', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.strands = response.data.data;
        this.gradeLevels = this.strands.map(strand => strand.grade_level);
        console.log('Strands fetched:', this.strands);
      } catch (error) {
        console.error('Error fetching strands:', error);
      }
    },
    async fetchSubjects() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewsubject', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.subjects = response.data.data;
        console.log('Subjects fetched:', this.subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    },
    filterGradeLevels() {
      const selectedStrand = this.strands.find(strand => strand.id === this.newClass.strand);
      if (selectedStrand) {
        this.filteredGradeLevels = [selectedStrand.grade_level];
      } else {
        this.filteredGradeLevels = [];
      }
      console.log('Filtered grade levels:', this.filteredGradeLevels);
    },
    filterSubjects() {
      const selectedCurriculum = this.curriculums.find(curriculum => curriculum.id === this.newClass.curriculum);
      if (selectedCurriculum) {
        this.filteredSubjects = selectedCurriculum.subjects;
      } else {
        this.filteredSubjects = [];
      }
      console.log('Filtered subjects:', this.filteredSubjects);
    },
    openModal() {
      this.newClass = this.getEmptyClass();
      this.filterSubjects(); // Ensure subjects are filtered on modal open
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
      this.newClass.code = Math.random().toString(36).substring(2, 8);
    },
    async addClass() {
      try {
        const response = await axios.post('http://localhost:8000/api/addclass', this.newClass, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.classes.push({ ...response.data.data });
        const modalElement = document.getElementById('addClassModal');
        const modalInstance = Modal.getInstance(modalElement);
        modalInstance.hide();
      } catch (error) {
        console.error('Error adding class:', error);
      }
    }
  },
  async mounted() {
    await this.fetchCurriculums();
    await this.fetchStrands();
    await this.fetchSubjects();
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
