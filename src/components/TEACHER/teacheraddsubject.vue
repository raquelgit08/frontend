<template>
  <div>
    <h1>My Classes</h1>
    <div class="row">
      <!-- Display classes fetched from the backend -->
      <div v-for="(classItem, index) in classes" :key="index" class="col-md-3">
        <div class="card">
          
          <img :src="require('@/assets/back1.jpg')" class="card-img" alt="Class Image">
          <div class="card-container">
            <p class="card-text"><strong>Subject:</strong> {{ classItem.subject.subjectname }}</p>
            <p class="card-text">{{ classItem.class_desc }}</p>
            <p class="card-text"><strong>Strand:</strong> {{ classItem.strand.addstrand }} {{ classItem.strand.grade_level }}</p>
            <p class="card-text"><strong>Section:</strong> {{ classItem.section.section }}</p>
            <p class="card-text"><strong>Year:</strong> {{ classItem.year.addyear }}</p>
            <p class="card-text"><strong>CODE:</strong> {{ classItem.gen_code }}</p>
            <p class="card-text"> {{ classItem.semester }} <a>semester</a></p>
            <p class="card-text"><strong>Curriculum:</strong> {{ classItem.curriculum.Namecuriculum }}</p>
            <center>
              <router-link :to="`/subject/${classItem.id}`" class="btn btn-primary"> Go to Room</router-link></center>

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
              <select v-model="newClass.curiculum_id" id="curriculum" class="form-select" @change="onCurriculumChange" required>
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
              <textarea class="form-control" id="description" v-model="newClass.class_desc"></textarea>
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
                <input type="text" class="form-control" id="code" v-model="newClass.gen_code" readonly>
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
        curiculum_id: '',
        strand_id: '',
        section_id: '',
        gradeLevel: '',
        subject_id: '',
        year_id: '',
        semester: '',
        year: '',
        class_desc: '',
        image: '',
        gen_code: '',
        progress: 0
      },
      classes:[],
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
    this.fetchClasses();
    
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
      this.newClass.gen_code = Math.random().toString(36).substring(2, 8).toUpperCase();
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
            value: `${strand.addstrand} ${strand.grade_level}`,
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
            value: section.section,
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
            value: `${subject.subjectname} `,
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
            value: `${year.addyear} `,
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
      const formData = new FormData();
      formData.append('curiculum_id', this.newClass.curiculum_id);
      formData.append('strand_id', this.newClass.strand_id);
      formData.append('section_id', this.newClass.section_id);
      formData.append('subject_id', this.newClass.subject_id);
      formData.append('year_id', this.newClass.year_id);
      formData.append('semester', this.newClass.semester);
      formData.append('class_desc', this.newClass.class_desc);
      formData.append('gen_code', this.newClass.gen_code);
      formData.append('progress', this.newClass.progress); ////.sppends the name of the field in the form data
      
      // Check if there's a file
      const file = this.$refs.fileInput.files[0];
      if (file) {
        formData.append('image', file);
      }

      try {
        const response = await axios.post('http://localhost:8000/api/addclass', formData, {
          headers: {
            // 'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response:', response.data);

        if (response.status === 201) {
          console.log('Class created successfully:', response.data);
          this.fetchClasses(); // Refresh classes list
          this.clearForm();
          const modalElement = document.getElementById('addClassModal');
          const modal = Modal.getInstance(modalElement);
          modal.hide();
        } else {
          console.error('Error creating class:', response.data);
        }
      } catch (error) {
        console.error('Error adding class:', error);
        alert('ERROR: Class is already created in this section with this subject.');
      }
    },

  clearForm() {
    this.newClass = {
      curiculum_id: '',
      strand_id: '',
      section_id: '',
      gradeLevel: '',
      subject_id: '',
      year_id: '',
      semester: '',
      year: '',
      class_desc: '',
      image: '',
      gen_code: '',
      progress: 0
    };
  },
    fetchClasses() {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:8000/api/viewAllClassDetails', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        if (response.data && response.data.classes) {
          this.classes = response.data.classes.map(classItem => ({
            id: classItem.id,
            class_desc: classItem.class_desc,
            strand: classItem.strand ||  {},
            section: classItem.section || {},
            subject: classItem.subject || {},
            year: classItem.year || {},
            gen_code: classItem.gen_code,
            semester: classItem.semester,
            curriculum: classItem.curriculum || {},
          }));
        } else {
          console.error('Unexpected response format:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
      });
    },

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
.card {
  display: flex;
  flex-direction: column;
  border: 2px solid #2c71c1;
  border-radius: 8px;
  width: 100%; /* Card width set to fill container */
  max-width: 350px; /* Maximum width of the card */
  background-color: #abd5f767;
  margin-bottom: 20px; /* Space between cards */
  
}

.card-img {
  width: 100%;
  height: 180px; /* Adjusted height for a wider card */
  object-fit: cover;
}

.card-body {
  padding: 15px;
  background-color: #f8f9fa;
}

.card-title {
  font-size: 1.2rem; /* Increased title font size */
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.9rem; /* Slightly smaller text size */
  margin-bottom: 0.5rem; /* Space between text items */
}
.card-container{
  padding: 20px;
}
</style>
