<template>
  <div class="container-fluid">
    <div class="header-container">
      <h3><i class="bi bi-grid-fill"></i> Manage Strand Curriculum</h3>
    </div>

    <!-- Search and Add Button -->
    <div class="row mb-4 justify-content-end align-items-center">
      <div class="col-md-9">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input type="text" v-model="searchQuery" class="form-control custom-select" placeholder="Search Strand Curriculum...">
        </div>
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
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>No.</th>
            <th>Strand & Grade Level</th>
            <th>Subjects</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(gradeLevels, strand, strandIndex) in filteredCurriculums" :key="strandIndex">
            <template v-for="(subjects, gradeLevel, gradeIndex) in gradeLevels" :key="gradeLevel">
              <tr>
                <td>{{ (strandIndex * Object.keys(gradeLevels).length) + (gradeIndex + 1) }}</td> <!-- Numbering -->
                <td>{{ strand }} <small>{{ gradeLevel }}</small></td>
                <td>
                  <ul>
                    <li v-for="(subjectArray, subjectName) in subjects" :key="subjectName">
                      <span v-if="subjectArray.length > 0">
                        <span v-for="subject in subjectArray" :key="subject.subject_id" >{{ subject.subjectname }}</span>
                      </span>
                      <span v-else>No subjects available</span>
                    </li>
                  </ul>
                </td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="openEditModal(strand, gradeLevel, subjects)">Edit</button>
                  <!-- <button class="btn btn-danger btn-sm" @click="confirmDeleteStrandCurriculum(subjects[0].subject_id)">Delete</button> -->
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>

    </div>


    <!-- Add/Edit Modal -->
    <div class="modal fade" id="strandCurriculumModal" tabindex="-1" ref="strandCurriculumModal">
      <div class="modal-dialog">
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
              <label for="subjects" class="form-label">Subjects:</label>
              <div>
                <div v-for="subject in items" :key="subject.id" class="form-check">
                  <input  type="checkbox"  :value="subject.id"  v-model="formData.subject_ids"  class="form-check-input"  :id="'subject_' + subject.id" />
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
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveStrandCurriculum">SAve</button>
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
      strandCurriculums: [], 
      curriculums: {}, 
      items: [],
      strands: [],
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
    filteredCurriculums() {
      if (!this.searchQuery) {
        return this.curriculums;
      }

      const query = this.searchQuery.toLowerCase();
      const result = {};

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

          // If Strand matches, include all grade levels and subjects
          if (strandMatches) {
            filteredGradeLevels[gradeLevel] = subjects;
            continue;
          }

          // Iterate over each Subject Category within the Grade Level
          for (let subjectName in subjects) {
            const subjectArray = subjects[subjectName];
            const subjectNameMatches = subjectName.toLowerCase().includes(query);
            const matchedSubjects = [];

            // Check if Subject Name matches the search query
            if (subjectNameMatches) {
              filteredSubjects[subjectName] = subjectArray;
              continue; // If Subject Name matches, include all subjects under this category
            }

            // Otherwise, check individual subjects within the category
            for (let i = 0; i < subjectArray.length; i++) {
              const subject = subjectArray[i];
              if (subject.subjectname.toLowerCase().includes(query)) {
                matchedSubjects.push(subject);
              }
            }

            // If any subjects match, include them under the subject category
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
          result[strand] = strandMatches ? gradeLevels : filteredGradeLevels;
        }
      }

      return result;
    },
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
          console.log('Response data:', response.data);

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
          subject_ids: this.formData.subject_ids,  // Sending multiple subject IDs
          semester: this.formData.semester
        };

        if (this.isEdit) {
          await axios.put(`${config.apiBaseURL}/updatecuri/${this.editStrandCurriculumId}`, data, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post(`${config.apiBaseURL}/addcuriculum`, data, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        this.fetchStrandCurriculums();
        this.closeModal();
        Swal.fire('Success', `Strand curriculum ${this.isEdit ? 'updated' : 'added'} successfully!`, 'success');
      } catch (error) {
        console.error('Error saving strand curriculum:', error);
        Swal.fire('Error', 'Failed to save strand curriculum.', 'error');
      }
    },
    

    confirmDeleteStrandCurriculum(id) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this strand curriculum?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then(async result => {
        if (result.isConfirmed) {
          this.deleteStrandCurriculum(id);
        }
      });
    },
    async deleteStrandCurriculum(id) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${config.apiBaseURL}/deletecuriculum/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchStrandCurriculums();
        Swal.fire('Deleted!', 'Strand curriculum has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting strand curriculum:', error);
        Swal.fire('Error', 'Failed to delete strand curriculum.', 'error');
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
    openEditModal(strand, gradeLevel, subjects) {
      console.log('Opening edit modal...');
  console.log('Strand:', strand);
  console.log('Grade Level:', gradeLevel);
  console.log('Subjects:', subjects); // To debug the structure of subjects

  this.isEdit = true;

  // Assuming subjects is an object, map through its values to collect subject IDs
  const subjectIds = [];
  for (const subjectCategory in subjects) {
    if (Array.isArray(subjects[subjectCategory])) {
      subjectIds.push(...subjects[subjectCategory].map(subject => subject.subject_id));
    }
  }

  this.formData = {
    strand_id: strand,  // Assuming strand is the ID
    subject_ids: subjectIds,  // Collected subject IDs
    semester: subjects[Object.keys(subjects)[0]][0]?.semester || '',  // Assuming the first subject has the semester data
  };

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

/* Table Wrapper */
.table-wrapper {
    margin: 10px;
    padding: 0 15px;
    max-width: 100%;
    overflow-x: auto;
}

/* Table Styles */
.table-custom {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(5, 4, 4, 0.1);
    border: 1px solid #200909;
    overflow: hidden;
    margin-bottom: 120px;
}

.table-custom th {
    background-color: #0d8eead7;
    color: #000000;
    
    font-weight: 700;
    font-size: 20px;
}

.table td {
    /* text-align: center; */
    vertical-align: middle;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.table th {
   text-align: center; 
    vertical-align: middle;
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
    background: linear-gradient(45deg, #007bff, #00bfff);
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

.edit:hover {
    background-color: green;
}

.btn-gradient:hover {
    background: linear-gradient(45deg, #0056b3, #0080ff);
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
    width: 40%;
}

.modal-content {
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
</style>