<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi bi-grid-fill"></i> Manage Strand Curriculum</h3>
    </div>

    <!-- Search and Add Button -->
    <div class="row mb-4 justify-content-end align-items-center">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input type="text" v-model="searchQuery" class="form-control custom-select" placeholder="Search Strand Curriculum...">
        </div>
      </div>
      <div class="col-md-3 d-flex align-items-center">
        <label for="semester">SORT BY SEMESTER:</label>
        <select v-model="selectedSemester" id="semester" class="form-select">
          <option value="">All Semesters</option>
          <option value="First">First Semester</option>
          <option value="Second">Second Semester</option>
        </select>
      </div>

      <div class="col-md-3 d-flex align-items-center">
        <button class="btn btn-gradient" @click="openAddModal">
          <i class="bi bi-plus"></i> Add Strand Curriculum
        </button>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center mb-3">
      <i class="bi bi-hourglass-split"></i> Loading...
    </div>

    <div class="table-wrapper">
    <table class="table table-bordered table-striped table-custom">
      <thead class="table-light">
        <tr>
          <th>No.</th>
          <th>Strand & Grade Level</th>
          <th>Subjects</th>
          <!-- <th>Action</th> -->
        </tr>
      </thead>
      <tbody>
        <template v-for="(gradeLevels, strand, strandIndex) in filteredCurriculums" :key="strandIndex">
          <template v-for="(subjects, gradeLevel, gradeIndex) in gradeLevels" :key="gradeLevel">
            <tr>
              <td style="text-align: center;">{{ (strandIndex * Object.keys(gradeLevels).length) + (gradeIndex + 1) }} .</td> <!-- Numbering -->
              <td class="strand"><b> {{ strand }} <small>{{ gradeLevel }}</small></b></td>
              <td>
                <ul>
                  <li v-for="(subjectArray, subjectName) in subjects" :key="subjectName">
                    <span v-if="subjectArray.length > 0">
                      <span v-for="subject in subjectArray" :key="subject.subject_id">
                        {{ subject.subjectname }}
                        <small class="text-muted"> ({{ subject.semester }}) <!-- Display semester -->
                        <button @click="confirmDeleteSubject(subject.curi_id, subject.subject_id)" class="btn btn-sm" style="color: red;">Delete</button></small>
                      </span>
                    </span>
                    <span v-else>No subjects available</span>
                  </li>
                </ul>
              </td>
              <!-- <td>
                <button 
            class="btn btn-primary btn-sm" 
            @click="openEditModal2(strand, gradeLevel, subjects, getCurriculumId(subjects))">
            Edit
          </button> -->

                <!-- <button class="btn btn-danger btn-sm" @click="confirmDeleteStrandCurriculum(subjects[0].subject_id)">Delete</button> -->
              <!-- </td> -->
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>



    <!-- Add/Edit Modal -->
    <div class="modal fade" id="strandCurriculumModal" tabindex="-1" ref="strandCurriculumModal" aria-hidden="false">
      <div class="modal-dialog custom-modal-dialog">
        <div class="modal-content">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="modal-title">
              <i class="bi bi-grid-fill" style="padding-right: 10px;"></i>{{ isEdit ? 'Edit Strand Curriculum' : 'Add Strand Curriculum' }}
            </h5>
            <button type="button" class="btn-close ms-auto" @click="closeModal" aria-label="Close"></button>
          </div><br>
         
          <div class="modal-body">
            <div class="col-md-12 mb-3">
              <label for="strand" class="form-label">Strand:</label>
              <select v-model="formData.strand_id" :class="{'is-invalid': !formData.strand_id && validationAttempted}" id="strand" class="form-select" required>
                <option value="">Select Strand</option>
                <option v-for="strand in strands" :key="strand.id" :value="strand.id">
                  {{ strand.label }}
                </option>
              </select>
            </div>
            
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="subjects" class="form-label me-2">Subjects:</label>
                <input type="text" 
                            v-model="subjectSearchQuery" 
                            class="form-control searchsub" 
                            placeholder="Search subjects..."
                        />
                    </div>
             
    <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ced4da; padding: 10px; border-radius: 5px;">
        <div v-for="subject in filteredSubjects" :key="subject.id" class="form-check">
            <input 
                type="checkbox" 
                :value="subject.id" 
                v-model="formData.subject_ids" 
                class="form-check-input" 
                :id="'subject_' + subject.id" 
            />
            <label :for="'subject_' + subject.id" class="form-check-label">
                {{ subject.subjectname }}
            </label>
        </div>
    </div>
</div>


            <div class="form-group">
              <label for="semester">Semester:</label>
              <select v-model="formData.semester" id="semester" class="form-select" required>
                <option value="">Select Semester</option>
                <option value="First">First Semester</option>
                <option value="Second">Second Semester</option>
              </select>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn " style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);" @click="closeModal">Cancel</button>
            <button type="button" class="btn " style="background-color: antiquewhite;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);" @click="saveStrandCurriculum">SAve</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import config from '@/config';

export default {
  name: 'ManageStrandCurriculum',
  data() {
    return {
      searchQuery: '',
      subjectSearchQuery: '',
      strandCurriculums: [], 
      curriculums: {}, 
      
      items: [],
      strands: [],
      selectedSemester: '', 
      formData: {
        strand_id: '',  // Selected strand ID from the dropdown
        subject_ids: [], // Array of selected subject IDs
        semester: '',    // Selected semester (First or Second)
      },

      isEdit: false,
      editStrandCurriculumId: null,
      loading: false,
      validationAttempted: false,
    };
  },

  computed: {
    filteredSubjects() {
        const query = this.subjectSearchQuery.toLowerCase();
        return this.items.filter(subject => 
            subject.subjectname.toLowerCase().includes(query)
        );
    },
    filteredCurriculums() {
    const result = {};
    const query = this.searchQuery.toLowerCase();
    const selectedSemester = this.selectedSemester;

    // Iterate over each Strand in curriculums
    for (let strand in this.curriculums) {
      const gradeLevels = this.curriculums[strand];
      const filteredGradeLevels = {};

      // Check if Strand matches the search query
      const strandMatches = strand.toLowerCase().includes(query);

      // Iterate over each Grade Level within the Strand
      for (let gradeLevel in gradeLevels) {
        const subjects = gradeLevels[gradeLevel];
        const filteredSubjects = {};

        // Check each subject within the grade level
        for (let subjectName in subjects) {
          const subjectArray = subjects[subjectName];
          const matchedSubjects = [];

          // Check individual subjects for both search query and semester filter
          for (let i = 0; i < subjectArray.length; i++) {
            const subject = subjectArray[i];

            // Ensure that both the search query and selected semester match
            const semesterMatches = !selectedSemester || subject.semester === selectedSemester;
            const subjectMatches = subject.subjectname.toLowerCase().includes(query);

            // If both match, include the subject
            if (semesterMatches && subjectMatches) {
              matchedSubjects.push(subject);
            }
          }

          // If any subjects match, add them to the filtered subjects list
          if (matchedSubjects.length > 0) {
            filteredSubjects[subjectName] = matchedSubjects;
          }
        }

        // If any subjects match within the Grade Level, include the Grade Level
        if (Object.keys(filteredSubjects).length > 0) {
          filteredGradeLevels[gradeLevel] = filteredSubjects;
        }
      }

      // If Strand matches or any Grade Levels have matching subjects, include the Strand
      if (strandMatches || Object.keys(filteredGradeLevels).length > 0) {
        result[strand] = filteredGradeLevels;
      }
    }

    return result;
  }
  },
  methods: {
    async fetchStrands() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiBaseURL}/viewstrand`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && Array.isArray(response.data.data)) {
          this.strands = response.data.data.map(strand => ({
            id: strand.id,
            label: `${strand.addstrand} ${strand.grade_level}`
          }));
        }
      } catch (error) {
        console.error('Error fetching strands:', error);
      }
    },
    async fetchSubjects() {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${config.apiBaseURL}/viewsubject`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.items = response.data.data;
      } catch (error) {
        console.error('Error fetching subjects:', error);
        Swal.fire('Error', 'Failed to fetch subjects.', 'error');
      } finally {
        this.loading = false;
      }
    },
  
    async fetchStrandCurriculums() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiBaseURL}/viewcuriculum2`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Log the response
          console.log('Response curriculumdata:', response.data);

      // Set the fetched data to the `curriculums` data property
      this.curriculums = response.data.data;

      // Optionally log the curriculums to see the structure
      console.log('Curriculums data:', this.curriculums);
      } catch (error) {
        console.error('Error fetching strand curriculums:', error);
      }
    },
  

    async saveStrandCurriculum() {
      try {
          const token = localStorage.getItem('token');
          const data = {
              strand_id: this.formData.strand_id,
              subject_ids: this.formData.subject_ids,
              semester: this.formData.semester
          };
          console.log('Sending data:', data); 

          let response;  // Keep this declaration

          if (this.isEdit && this.editStrandCurriculumId) {
              // PUT request to update an existing curriculum
              response = await axios.put(`${config.apiBaseURL}/updateCurriculum/${this.editStrandCurriculumId}`, data, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              console.log('Updated sssData Response:', response.data); 
              Swal.fire('Success', 'Strand curriculum updated successfully!', 'success');
          } else {
              // POST request to add a new curriculum
              response = await axios.post(`${config.apiBaseURL}/addcuriculum`, data, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              console.log('Updated Data:', response.data); 
              Swal.fire('Success', 'Strand curriculum added successfully!', 'success');
          }

          // Refresh the curriculum list after saving
          await this.fetchStrandCurriculums();
          this.closeModal();
      } catch (error) {
          if (error.response && error.response.status === 422) {
              const errorMessage = error.response.data.message || 'Strand, grade level, and subject already exist';
              Swal.fire('Error', errorMessage, 'error');
          } else {
              Swal.fire('Error', 'Failed to save strand curriculum.', 'error');
          }
      }

    },

    async confirmDeleteSubject(curi_id, subject_id) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      });

      if (result.isConfirmed) {
        try {
          // Make an API request to delete the subject curriculum
          const token = localStorage.getItem('token');
          await axios.delete(`${config.apiBaseURL}/deleteCurriculum/${curi_id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            data: {
              subject_id: subject_id // Send the subject ID if required by your API
            }
          });

          // Update the local state to reflect the deletion
          // Find the strand and grade level and remove the subject from the state
          for (const strand in this.curriculums) {
            for (const gradeLevel in this.curriculums[strand]) {
              const subjects = this.curriculums[strand][gradeLevel];
              for (const subjectName in subjects) {
                subjects[subjectName] = subjects[subjectName].filter(subj => subj.subject_id !== subject_id);
                // Remove the subject array if it becomes empty
                if (subjects[subjectName].length === 0) {
                  delete subjects[subjectName];
                }
              }
            }
          }

          Swal.fire('Deleted!', 'Your curriculum has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting subject:', error);
          Swal.fire('Error!', 'There was a problem deleting the curriculum.', 'error');
        }
      }
    },

    openAddModal() {
      this.isEdit = false;
      this.editStrandCurriculumId = null;
      this.formData = {
        strand_id: '',
        subject_ids: [],
        semester: "",
      };
      this.showModal();
    },
    getCurriculumId(subjects) {
    // Iterate through the subjects to find a valid curi_id
    for (const subjectCategory in subjects) {
      if (Array.isArray(subjects[subjectCategory]) && subjects[subjectCategory].length > 0) {
        const curriculumId = subjects[subjectCategory][0].curi_id;
        if (curriculumId) {
          return curriculumId;
        }
      }
    }
    return null; // Return null if no curriculumId is found
  },

  openEditModal2(strand, gradeLevel, subjects, curriculumId) {
    console.log('Opening edit modal...');
    console.log('Strand:', strand);
    console.log('Grade Level:', gradeLevel);
    console.log('Subjects:', subjects); // Debug structure of subjects
    console.log('Curriculum ID:', curriculumId); // Debug curriculum ID

    // Check if the curriculumId is defined
    if (!curriculumId) {
        Swal.fire('Error', 'Curriculum ID is undefined!', 'error');
        return;
    }

    // Set the component state to "edit mode"
    this.isEdit = true;
    this.editStrandCurriculumId = curriculumId;

    // Collect subject IDs for the form
    const subjectIds = [];
    for (const subjectCategory in subjects) {
        if (Array.isArray(subjects[subjectCategory])) {
            subjectIds.push(...subjects[subjectCategory].map(subject => subject.subject_id));
        }
    }

    // Assuming all subjects in the group share the same semester
    const firstSubject = subjects[Object.keys(subjects)[0]][0];
    const semester = firstSubject ? firstSubject.semester : '';

    // Populate the formData with the extracted values
    this.formData = {
        strand_id: this.strands.find(s => s.label.includes(strand))?.id || '',  // Convert strand name back to ID
        subject_ids: subjectIds,  // Set the selected subject IDs
        semester: semester,  // Set the semester
    };

    // Show the modal
    this.showModal();
},

    showModal() {
      const modalElement = this.$refs.strandCurriculumModal;
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    },
    closeModal() {
      this.modalInstance.hide();
    },
  },

  mounted() {
    this.fetchStrandCurriculums();
    this.fetchStrands();
    this.fetchSubjects();
  }
};
</script>


<style scoped>
/* Container */
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

/* Search Bar Styles */
.input-group {
    padding-left: 32px;
}

.form-select {
    width: 200px;
}

.table-wrapper {
  margin: 10px;
  padding: 0 15px;
  max-width: 100%;
  overflow-x: auto;
}
.searchsub {
    border: none; /* Remove all borders */
    border-bottom: 2px solid #818486; /* Add a bottom border */
    border-radius: 0; /* Remove border radius */
    outline: none; /* Remove outline on focus */
    box-shadow: none; /* Remove box shadow */
    margin-bottom: 10px;
}

.searchsub:focus {
    border-bottom: 2px solid #525353; /* Change color on focus */
}


/* Table Styles */
.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border: 1px solid #200909;
  overflow: hidden;
  margin-bottom: 120px;
}

.table-custom th {
  background-color: #c1c1c1d7;
  color: #000000;
  font-weight: 700;
  font-size: 20px;
}

.table th , .strand {
  text-align: center;
  vertical-align: middle;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.td {
  font-size: 18px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.table-custom tbody tr:hover {
  background-color: #f1f3f5;
}

.table-custom tbody tr {
  transition: background-color 0.3s ease;
}

.edit {
    background-color: rgb(12, 170, 12);
    color: #ffffff;
    width: 90px;
}

.btn-danger, .edit {
    font-size: 17px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-gradient {
  background: linear-gradient(45deg, #c4c5c5, #9fa0a0);
    color: #120808;
    transition: background 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin: 20px;
    padding: 5px;
    width: 300px;
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 20px;
}



.btn-gradient:hover {
  background: linear-gradient(45deg, #b2b3b4, #eff0f0);
}

.custom-select {
    height: 45px;
    border-radius: 8px;
    border: 1px solid #ced4da;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    font-family: Arial, sans-serif;
    color: #495057;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.custom-select:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
    outline: none;
}

.custom-select::placeholder {
    color: #6c757d;
}

.modal-dialog {
    width: 60%;
}
.custom-modal-dialog {
    max-width: 600px; /* Set your desired max width */
    width: 80%; /* Set your desired default width */
}

.btn-sm {
    padding-top: 0; 
    padding-bottom: 0; 
    margin: 0; /* Optional: Remove margin if needed */
    line-height: 1; /* Ensure the button's line height is set to avoid excess space */
}

.modal-content {
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
</style>