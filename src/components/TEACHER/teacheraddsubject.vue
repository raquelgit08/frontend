<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi bi-easel-fill"></i> My Classes</h3>
    </div>
    <div class="row">
      <!-- Display classes fetched from the backend -->
      <div v-for="(classItem, index) in classes" :key="index" class="col-md-3">
        <div class="card" @click="$router.push(`/subject/${classItem.id}`)">
          <!-- Display user-selected image -->
          <img
            v-if="classItem.profile_img"
            :src="getImageUrl(classItem.profile_img)"
            class="card-img"
            alt="Class Image"
            style="width: 250px; height: 143px; margin-left: auto;"
          >
          <div class="card-container">
            <p class="card-subject-name">
  <b>{{ classItem.subject?.subjectname || 'No Subject Name Available' }}</b>
</p>
            <hr>
            <p class="card-text">
  <b v-if="classItem.strand">{{ classItem.strand.addstrand }}</b> 
  {{ classItem.strand ? classItem.strand.grade_level : '' }} 
  {{ classItem.section ? classItem.section.section : '' }}
</p>
<p class="card-text">
  <strong>CODE:</strong> {{ classItem.gen_code }}
</p>
<p class="card-text">
  {{ classItem.semester }} semester S.Y. {{ classItem.year ? classItem.year.addyear : '' }}
</p>
            
            <!-- Added Edit and Archive buttons -->
            <div class="action-buttons">
              <button class="btn btn-outline-secondary btn-sm" @click="editClass(classItem)">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="archiveClass(classItem)">
                <i class="bi bi-archive"></i> Archive
              </button>
            </div>
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
            <!-- Form for adding a new class -->
            <div class="form-group" :class="{'has-error': !newClass.strand_id && isFormSubmitted}">
              <label for="strand">Strand:</label>
              <select v-model="newClass.strand_id" id="strand" class="form-select" required>
                <option value="">Select Strand</option>
                <option v-for="strand in strands" :key="strand.id" :value="strand.id">
                  {{ strand.label }}
                </option>
              </select>
            </div>

            <div class="form-group" :class="{'has-error': !newClass.section_id && isFormSubmitted}">
              <label for="section" class="form-label">Section:</label>
              <select v-model="newClass.section_id" id="section" class="form-select" required>
                <option value="">Select Section</option>
                <option v-for="section in filteredSections" :key="section.id" :value="section.id">
                  {{ section.label }}
                </option>
              </select>
            </div>

            <div class="form-group" :class="{'has-error': !newClass.semester && isFormSubmitted}">
              <label for="semester">Semester</label>
              <select v-model="newClass.semester" id="semester" class="form-select" required>
                <option value="">Select Semester</option>
                <option value="first">First Semester</option>
                <option value="second">Second Semester</option>
              </select>
            </div>

            <div class="form-group" :class="{'has-error': !newClass.subject_id && isFormSubmitted}">
              <label for="subject">Subjects</label>
              <select v-model="newClass.subject_id" id="subjects" class="form-select" required>
                <option value="">Select Subjects</option>
                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                  {{ subject.label }}
                </option>
              </select>
            </div>

            <div class="form-group" :class="{'has-error': !newClass.year_id && isFormSubmitted}">
              <label for="year">Year</label>
              <select v-model="newClass.year_id" id="year" class="form-select" required>
                <option value="">Select Year</option>
                <option v-for="year in years" :key="year.id" :value="year.id">
                  {{ year.label }}
                </option>
              </select>
            </div>

            <div class="form-group" :class="{'has-error': !newClass.class_desc && isFormSubmitted}">
              <label for="description">Class Description</label>
              <textarea class="form-control" id="description" v-model="newClass.class_desc"></textarea>
            </div>

            <!-- File upload for selecting image -->
            <div class="form-group" :class="{'has-error': !newClass.profile_img && isFormSubmitted}">
              <label for="picture">Upload Picture (Required)</label>
              <div class="upload-area" @dragover.prevent @dragenter.prevent @dragleave.prevent @drop.prevent="onFileDrop">
                <input type="file" class="custom-file-input" id="picture" @change="onFileChange" ref="fileInput" required>
                <div class="upload-message" v-if="!newClass.profile_img">Drag and drop an image here, or click to select one</div>
                <img v-if="newClass.profile_img" :src="newClass.profile_img" class="img-thumbnail" alt="Preview Image" />
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
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

export default {
  name: 'TeacherAddSubject',
  data() {
    return {
      newClass: {
        strand_id: '',
        section_id: '',
        subject_id: '',
        year_id: '',
        semester: '',
        class_desc: '',
        profile_img: '', // Image for preview and upload
        gen_code: '',
      },
      classes: [], // List of classes fetched from the backend
      strands: [],
      sections: [],
      subjects: [],
      years: [],
      filteredSections: [],
      isFormSubmitted: false,
    };
  },
  mounted() {
    this.fetchSections();
    this.fetchStrands();
    this.fetchSubjects();
    this.fetchYear();
    this.fetchClasses();
  },
  watch: {
    'newClass.strand_id': 'filterSections', // Watch for changes to strand_id
  },
  methods: {
    getImageUrl(imagePath) {
      const baseUrl = process.env.VUE_APP_BASE_URL || 'http://localhost:8000';
      return `${baseUrl}${imagePath}?t=${new Date().getTime()}`;  // Appends a timestamp to bypass cache
    },
    openModal() {
      const modalElement = document.getElementById('addClassModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newClass.profile_img = URL.createObjectURL(file); // Preview the selected image
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
    async addClass() {
  this.isFormSubmitted = true;

  if (!this.validateForm()) {
    Swal.fire({
      icon: 'error',
      title: 'Missing Fields',
      text: 'Please fill out all required fields.',
    });
    return;
  }

  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('strand_id', this.newClass.strand_id);
  formData.append('section_id', this.newClass.section_id);
  formData.append('subject_id', this.newClass.subject_id);
  formData.append('year_id', this.newClass.year_id);
  formData.append('semester', this.newClass.semester);
  formData.append('class_desc', this.newClass.class_desc);
  formData.append('gen_code', this.newClass.gen_code);

  const file = this.$refs.fileInput.files[0];
  if (file) {
    formData.append('profile_img', file);  // Ensure the image file is appended to the form data
  }

  try {
    const response = await axios.post('http://localhost:8000/api/addclass', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 201) {
      const newClass = response.data.data;
      this.classes.push(newClass);
      this.clearForm();
      this.isFormSubmitted = false;

      const modalElement = document.getElementById('addClassModal');
      const modal = Modal.getInstance(modalElement);
      modal.hide();

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Class added successfully!',
      });
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      Swal.fire({
        icon: 'error',
        title: 'Duplicate Class',
        text: 'This subject already exists for the selected strand, section, semester, and year.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred while adding the class.',
      });
    }
  }
},
    validateForm() {
      const { strand_id, section_id, subject_id, year_id, semester, class_desc, profile_img } = this.newClass;
      return strand_id && section_id && subject_id && year_id && semester && class_desc && profile_img;
    },
    
    clearForm() {
      this.newClass = {
        strand_id: '',
        section_id: '',
        subject_id: '',
        year_id: '',
        semester: '',
        class_desc: '',
        profile_img: '',
        gen_code: ''
      };
    },

    fetchClasses() {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:8000/api/viewAllClassDetails', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        if (response.data && response.data.classes) {
          this.classes = response.data.classes.map(classItem => {
            return {
              ...classItem,
              subject: classItem.subject || {},  // Ensure subject is at least an empty object
              profile_img: classItem.profile_img ? classItem.profile_img : null
            };
          });
        }
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
      });
    },

    fetchSections() {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:8000/api/viewsection', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data.sections && Array.isArray(response.data.sections)) {
          this.sections = response.data.sections.map(section => ({
            id: section.id,
            strand_id: section.strand.id,
            label: section.section
          }));
          this.filterSections();
        }
      })
      .catch(error => {
        console.error('Error fetching sections:', error);
      });
    },
    fetchStrands() {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:8000/api/viewstrand', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          this.strands = response.data.data.map(strand => ({
            id: strand.id,
            label: `${strand.addstrand} ${strand.grade_level}`
          }));
        }
      })
      .catch(error => {
        console.error('Error fetching strands:', error);
      });
    },
    fetchSubjects() {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:8000/api/viewsubject', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          this.subjects = response.data.data.map(subject => ({
            id: subject.id,
            label: subject.subjectname
          }));
        }
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
      });
    },
    fetchYear() {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:8000/api/viewyear', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          this.years = response.data.data.map(year => ({
            id: year.id,
            label: year.addyear
          }));
        }
      })
      .catch(error => {
        console.error('Error fetching years:', error);
      });
    },
    filterSections() {
      this.filteredSections = this.sections.filter(
        section => section.strand_id === this.newClass.strand_id
      );
    },
    editClass() {
      Swal.fire({
        icon: 'info',
        title: 'Edit Class',
        text: 'Editing class is under development!',
      });
    },
    archiveClass(classItem) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, archive it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          // Archive class logic here
          console.log('Archiving class:', classItem);
          Swal.fire('Archived!', 'Your class has been archived.', 'success');
        }
      });
    },
  }
};
</script>

<style scoped>
  .container-fluid {
    background-color: #ffffff;
    border-radius: 10px;
  }
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    padding-top: 20px;
  }
  .row {
    padding: 40px;
  }
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
    border: 2px solid #ebedf0;
    border-radius: 8px;
    width: 100%;
    max-width: 350px;
    height: 400px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
  }
  .card-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  .card-body {
    padding: 15px;
    background-color: #f8f9fa;
  }
  .card-subject-name {
    font-size: 18px;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .card-text {
    margin: 5px 0;
    font-size: 15px;
  }
  .card-container {
    padding: 20px;
  }
  .action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }
  .btn {
    margin-right: 10px;
  }
  .has-error select,
  .has-error textarea,
  .has-error input {
    border-color: red;
  }
</style>
