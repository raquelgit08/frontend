<template>
  <div class="container mt-4">
    <h5 class="text-center">Set Up Curriculum</h5>

    <div class="row">
      <!-- Curriculum Dropdown -->
      <div class="col-md-6 mb-3">
        <label for="curriculum" class="form-label">Curriculum</label>
        <select v-model="selectedCurriculum" @change="fetchStrands" class="form-select" id="curriculum">
          <option value="" disabled>Select Curriculum</option>
          <option v-for="curriculum in curricula" :key="curriculum.id" :value="curriculum.id">{{ curriculum.Namecuriculum }}</option>
        </select>
      </div>

      <!-- Strand Dropdown -->
      <div class="col-md-6 mb-3">
        <label for="strand" class="form-label">Strand</label>
        <select v-model="selectedStrand" @change="setGradeLevel" class="form-select" id="strand" :disabled="!selectedCurriculum">
          <option value="" disabled>Select Strand</option>
          <option v-for="strand in strands" :key="strand.id" :value="strand.id">{{ strand.strand_name }}</option>
        </select>
      </div>

      <!-- Grade Level (auto-filled) -->
      <div class="col-md-6 mb-3">
        <label for="gradeLevel" class="form-label">Grade Level</label>
        <input type="text" v-model="gradeLevel" class="form-control" id="gradeLevel" disabled />
      </div>

      <!-- Semester Dropdown -->
      <div class="col-md-6 mb-3">
        <label for="semester" class="form-label">Semester</label>
        <select v-model="selectedSemester" class="form-select" id="semester">
          <option value="" disabled>Select Semester</option>
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
        </select>
      </div>

      <!-- Subject Dropdown -->
      <div class="col-md-6 mb-3">
        <label for="subject" class="form-label">Subject</label>
        <select v-model="selectedSubject" class="form-select" id="subject">
          <option value="" disabled>Select Subject</option>
          <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.subjectname }}</option>
        </select>
      </div>
    </div>

    <div class="text-center">
      <button class="btn btn-primary" @click="submitCurriculumSetup">Submit Curriculum Setup</button>
    </div>

    <!-- Success and Error Messages -->
    <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SemesterinENHS',
  data() {
    return {
      curricula: [],
      strands: [],
      subjects: [],
      selectedCurriculum: '',
      selectedStrand: '',
      gradeLevel: '',
      selectedSemester: '',
      selectedSubject: '',
      message: '',
      error: '',
    };
  },
  methods: {
    async fetchCurricula() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewcuri');
        this.curricula = response.data.data;
      } catch (error) {
        console.error('Error fetching curricula:', error);
        this.error = 'Failed to fetch curricula.';
      }
    },

    async fetchStrands() {
      if (this.selectedCurriculum) {
        try {
          const response = await axios.get('http://localhost:8000/api/viewstrands', {
            params: { curriculum_id: this.selectedCurriculum }
          });
          this.strands = response.data.data;
        } catch (error) {
          console.error('Error fetching strands:', error);
          this.error = 'Failed to fetch strands.';
        }
      }
    },

    async fetchSubjects() {
      try {
        const response = await axios.get('http://localhost:8000/api/viewsubject');
        this.subjects = response.data.data;
      } catch (error) {
        console.error('Error fetching subjects:', error);
        this.error = 'Failed to fetch subjects.';
      }
    },

    setGradeLevel() {
      if (this.selectedStrand) {
        // Set the grade level based on selected strand (example logic, adjust as needed)
        const strand = this.strands.find(s => s.id === this.selectedStrand);
        this.gradeLevel = strand ? strand.grade_level : '';
      }
    },

    async submitCurriculumSetup() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:8000/api/addcuriculum', {
          scuriculum_id: this.selectedCurriculum,
          subject_id: this.selectedSubject,
          strand_id: this.selectedStrand,
          semester: this.selectedSemester,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.message = response.data.message;
        this.resetForm();
      } catch (error) {
        console.error('Error submitting curriculum setup:', error);
        this.error = 'Failed to submit curriculum setup.';
      }
    },

    resetForm() {
      this.selectedCurriculum = '';
      this.selectedStrand = '';
      this.gradeLevel = '';
      this.selectedSemester = '';
      this.selectedSubject = '';
    }
  },

  mounted() {
    this.fetchCurricula();
    this.fetchSubjects();
  }
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
}

.row {
  margin-bottom: 15px;
}
</style>
