<template>
  <div class="container-fluid">
    <!-- Display classes -->
    <div class="header-container">
      <h1><i class="bi bi-easel-fill"></i> My Classes</h1>
      <div class="form-group">
        <label for="semester">SORT BY SEMESTER:</label>
        <select v-model="selectedSemester" id="semester" class="form-select" required>
          <option value="">Select Semester</option>
          <option value="First">First Semester</option>
          <option value="Second">Second Semester</option>
        </select>
      </div>
    </div>
    <div class="row">
      <!-- Add Class Button -->
      <div class="col-md-3">
        <div class="card add-class-card" @click="openAddClassModal">
          <div class="card-body d-flex justify-content-center align-items-center">
            <div class="plus-icon">
              <i class="fa fa-plus fa-3x"></i>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(classItem, index) in filteredClasses" :key="index" class="col-md-3">
        <div class="card" @click="$router.push(`/teachercreateexam/${classItem.id}`)">
          <img
            v-if="classItem.profile_img"
            :src="getImageUrl(classItem.profile_img)"
            class="card-img"
            alt="Class Image"
            style="width: auto; height: max-content"
          />
          <div class="card-container">
            <p class="card-subject-name">
              <b>{{ classItem.subject?.subjectname || 'No Subject Name Available' }}</b>
            </p>
            <hr />
            <p class="card-text">
              <strong>STRAND: </strong>
              <b v-if="classItem.strand">{{ classItem.strand.addstrand }}</b>
              {{ classItem.strand ? classItem.strand.grade_level : '' }}
              {{ classItem.section ? classItem.section.section : '' }}
            </p>
            <p class="card-text">
              <strong>CLASS CODE:</strong> {{ classItem.gen_code }}
            </p>
            <p class="card-text">
              {{ classItem.semester }} semester S.Y.
              {{ classItem.year ? classItem.year.addyear : '' }}
            </p>
            <div class="action-buttons">
              <!-- <button
                class="btn btn-outline-warning btn-sm"
                @click.stop="openEditModal(classItem)"
              >
                <i class="bi bi-pencil"></i> Edit
              </button> -->
              <button
                class="btn btn-outline-danger btn-sm"
                @click.stop="archiveClass(classItem)"
              >
                <i class="bi bi-archive"></i> Archive
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </div>

    <!-- Modal for adding/editing a class -->
    <div class="modal fade" id="classModal" tabindex="-1" aria-labelledby="classModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Edit Class' : 'Add New Class' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Form for class details -->
            <div class="form-group">
              <label for="strand">Strand:</label>
              <select v-model="currentClass.strand_id" id="strand" class="form-select" required @change="filterSections">
                <option value="">Select Strand</option>
                <option v-for="strand in strands" :key="strand.id" :value="strand.id">
                  {{ strand.label }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="section">Section:</label>
              <select v-model="currentClass.section_id" id="section" class="form-select" required>
                <option value="">Select Section</option>
                <option v-for="section in filteredSections" :key="section.id" :value="section.id">
                  {{ section.label }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="semester">Semester:</label>
              <select v-model="currentClass.semester" id="semester" class="form-select" required>
                <option value="">Select Semester</option>
                <option value="First">First Semester</option>
                <option value="Second">Second Semester</option>
              </select>
            </div>
            <div class="form-group">
  <label for="subject">Subjects:</label>
  <select v-model="currentClass.subject_id" id="subject" class="form-select" required>
    <option value="">Select Subjects</option>
    <option v-for="subject in filteredSubjects" :key="subject.id" :value="subject.id">
      {{ subject.label }}
    </option>
  </select>
</div>

            <div class="form-group">
              <label for="year">Year:</label>
              <select v-model="currentClass.year_id" id="year" class="form-select" required>
                <option value="">Select Year</option>
                <option v-for="year in years" :key="year.id" :value="year.id">
                  {{ year.label }}
                </option>
              </select>
            </div>

            

            <div class="form-group">
              <label for="class_desc">Class Description:</label>
              <textarea v-model="currentClass.class_desc" class="form-control" id="class_desc"></textarea>
            </div>

            <!-- File upload for selecting/editing image -->
            <div class="form-group">
              <label for="picture">Upload Picture</label>
              <input
                type="file"
                class="form-control"
                id="picture"
                @change="onFileChange"
                ref="fileInput"
              />
              <!-- Show existing image if present -->
              <div v-if="currentClass.profile_img">
                <img
                  :src="currentClass.profile_img.startsWith('blob:') ? currentClass.profile_img : getImageUrl(currentClass.profile_img)"
                  class="card-img mt-2"
                  alt="Preview Image"
                  style="width: 100px; height: 100px"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="code">Generate Code</label>
              <div class="input-group">
                <input type="text" class="form-control" id="code" v-model="currentClass.gen_code" readonly />
                <button class="btn btn-secondary" @click="generateCode">Generate Code</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="saveClass">{{ isEditMode ? 'Save Changes' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import config from '@/config';

export default {
  name: "TeacherAddSubject",
  data() {
    return {
      currentClass: {
        strand_id: "",
        section_id: "",
        subject_id: "",
        year_id: "",
        semester: "",
        class_desc: "",
        profile_img: "",
        gen_code: "",
      },
      classes: [],
      strands: [],
      selectedSemester: "",  // This holds the selected semester
      sections: [],
      allSubjects: [],  // All subjects
      subjects: [],
      years: [],
      filteredSections: [],
      filteredSubjects: [],
      isEditMode: false,
      selectedFile: null, // Store the selected image file for upload
    };
  },
  mounted() {
    this.fetchSections();
    this.fetchStrands();
    this.fetchSubjects();
    this.fetchYear();
    this.fetchClasses();
  },
  computed: {
    filteredClasses() {
      if (this.selectedSemester) {
        return this.classes.filter(classItem => classItem.semester === this.selectedSemester);
      }
      return this.classes; // Return all classes if no semester is selected
    },
  },
  methods: {
    getImageUrl(imagePath) {
      const baseUrl = process.env.VUE_APP_BASE_URL || "http://10.0.0.9:1020";
      return `${baseUrl}${imagePath}?t=${new Date().getTime()}`;
    },
    openAddClassModal() {
      this.isEditMode = false;
      this.clearForm();
      const modalElement = document.getElementById("classModal");
      const modal = new Modal(modalElement);
      modal.show();
    },
    openEditModal(classItem) {
      this.isEditMode = true;
      this.currentClass = { ...classItem };
      this.filterSections();
      const modalElement = document.getElementById("classModal");
      const modal = new Modal(modalElement);
      modal.show();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.currentClass.profile_img = URL.createObjectURL(file); // Show image preview immediately
      }
    },
    generateCode() {
      this.currentClass.gen_code = Math.random().toString(36).substring(2, 8).toUpperCase();
    },
    async saveClass() {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append all currentClass data (text fields)
      Object.keys(this.currentClass).forEach((key) => {
        if (this.currentClass[key] !== null && this.currentClass[key] !== undefined) {
          formData.append(key, this.currentClass[key]);
        }
      });

      // Append the image file to the FormData
      if (this.selectedFile) {
        formData.append("profile_img", this.selectedFile); // Key must match backend's 'profile_img'
      }

      try {
        let response;

        // If editing mode, send a PUT request, otherwise POST
        if (this.isEditMode) {
          response = await axios.put(
            `${config.apiBaseURL}/updateaddclass/${this.currentClass.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          response = await axios.post(
            `${config.apiBaseURL}/addclass`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        if (response && (response.status === 200 || response.status === 201)) {
          const updatedClass = response.data.data;

          if (this.isEditMode) {
            const index = this.classes.findIndex((c) => c.id === updatedClass.id);
            this.classes[index] = updatedClass; // Update the class in the array
          } else {
            this.classes.unshift(updatedClass); // Add new class to the array
          }

          this.clearForm();
          const modalElement = document.getElementById("classModal");
          const modal = Modal.getInstance(modalElement);
          modal.hide();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: this.isEditMode ? "Class updated successfully!" : "Class added successfully!",
          });
          this.fetchClasses();
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        console.error("Error saving class:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "An error occurred.",
        });
      }
    },
    clearForm() {
      this.currentClass = {
        strand_id: "",
        section_id: "",
        subject_id: "",
        year_id: "",
        semester: "",
        class_desc: "",
        profile_img: "",
        gen_code: "",
      };
      this.selectedFile = null;
    },
    async archiveClass(classItem) {
      const token = localStorage.getItem("token");
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, archive it!",
        cancelButtonText: "No, cancel!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.put(
              `${config.apiBaseURL}/updateClassStatus/${classItem.id}`,
              { status: 0 },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.status === 200) {
              this.classes = this.classes.filter((c) => c.id !== classItem.id);
              Swal.fire("Archived!", "Your class has been archived.", "success");
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response?.data?.message || "An error occurred.",
            });
          }
        }
      });
    },
    fetchClasses() {
      const token = localStorage.getItem("token");
      axios .get(`${config.apiBaseURL}/viewAllClassDetails`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data && response.data.classes) {
            this.classes = response.data.classes.map((classItem) => ({
              ...classItem,
              subject: classItem.subject || {},
              profile_img: classItem.profile_img ? classItem.profile_img : null,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching classes:", error);
        });
    },
    fetchSections() {
      const token = localStorage.getItem("token");
      axios
        .get(`${config.apiBaseURL}/viewsection`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.sections && Array.isArray(response.data.sections)) {
            this.sections = response.data.sections.map((section) => ({
              id: section.id,
              strand_id: section.strand.id,
              label: section.section,
            }));
            this.filterSections();
          }
        })
        .catch((error) => {
          console.error("Error fetching sections:", error);
        });
    },
    fetchStrands() {
      const token = localStorage.getItem("token");
      axios.get(`${config.apiBaseURL}/viewstrand`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            this.strands = response.data.data.map((strand) => ({
              id: strand.id,
              label: `${strand.addstrand} ${strand.grade_level}`,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching strands:", error);
        });
    },
    fetchSubjects() {
    const token = localStorage.getItem("token");
    axios.get(`${config.apiBaseURL}/viewcuriculum2`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Fetched response data:", response.data);

        // Check if data exists
        if (response.data && response.data.data) {
          const groupedSubjects = response.data.data;

          // Flatten the data structure for dropdown display
          this.subjects = [];
          Object.entries(groupedSubjects).forEach(([strand, gradeLevels]) => {
            Object.entries(gradeLevels).forEach(([grade, subjects]) => {
              Object.entries(subjects).forEach(([subjectName, subjectDetails]) => {
                subjectDetails.forEach((subject) => {
                  this.subjects.push({
                    id: subject.subject_id,
                    strand_id: subject.strand_id, // Include strand_id
                    
                    label: `${strand} - ${grade} - ${subjectName}-- ${subject.semester}`, // Customize label as needed
                  });
                });
              });
            });
          });

          console.log("Formatted subjects for dropdown:", this.subjects);
        } else {
          console.warn("No valid data found in response.");
        }
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  },


    fetchYear() {
      const token = localStorage.getItem("token");
      axios.get(`${config.apiBaseURL}/viewyear`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            this.years = response.data.data.map((year) => ({
              id: year.id,
              label: year.addyear,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching years:", error);
        });
    },
    filterSections() {
    this.filteredSections = this.sections.filter(
      (section) => section.strand_id === this.currentClass.strand_id
    );
    this.filterSubjects(); // Call the method to filter subjects when strand is selected
  },

  filterSubjects() {
    this.filteredSubjects = this.subjects.filter(
      (subject) => subject.strand_id === this.currentClass.strand_id
    );
  },
  },
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
    transition: background-color 0.3s;
  }
  
  .add-class-card:hover {
    background-color: #e2e6ea;
  }

  .plus-icon {
    color: #007bff;
  }

  .upload-area {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s;
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
  height: 430px; /* Fixed height for uniformity */
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 85px;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-left: 43px;
}

  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }

  .card-img {
    width: fit-content;
    height: auto; /* Fixed height for uniformity */
 object-fit: cover; 
    overflow: hidden; /* Ensures the image covers the area without distortion */
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .card-body {
    padding: 15px;
    background-color: #f8f9fa;
    flex-grow: 1;
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
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn-primary {
    background-color: #007bff;
    color: #fff;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: #fff;
  }

  .btn-secondary:hover {
    background-color: #5a6268;
  }

  .has-error select,
  .has-error textarea,
  .has-error input {
    border-color: red;
  }
</style>

