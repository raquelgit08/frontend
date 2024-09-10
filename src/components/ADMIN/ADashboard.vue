<template>
  <div class="container-fluid">
    <!-- Statistics Section -->
    <div class="row">
      <div class="col-12 col-sm-6 col-md-3 mb-3">
        <div class="boxes box1 d-flex align-items-center p-3" @click="navigateTo('/manage_teachers')">
          <i class="bi bi-person-lines-fill icon icon1"></i>
          <div class="content">
            <h4>{{ counts.teacher_count }}</h4>
            <span class="label">Total Number Of Teachers</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3 mb-3">
        <div class="boxes d-flex align-items-center p-3" @click="navigateTo('/manage_students')">
           <i class="bi bi-person-fill icon icon2"></i>
          <div class="content">
            <h4>{{ counts.student_count }}</h4>
            <span class="label">Total Number Of Students</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3 mb-3">
        <div class="boxes d-flex align-items-center p-3" @click="navigateTo('/ManageStrandsinSHS')">
           <i class="bi bi-book-half icon icon3"></i>
          <div class="content">
            <h4>{{ counts.strand_count }}</h4>
            <span class="label">Total Number Of Strands</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3 mb-3">
        <div class="boxes d-flex align-items-center p-3" @click="navigateTo('/AManageSubject')">
           <i class="bi bi-file-earmark-text-fill icon icon4"></i>
          <div class="content">
            <h4>{{ counts.subject_count }}</h4>
            <span class="label">Total Number Of Subjects</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="row">
      <div class="col-4">
        <p>total number of tecahers {{ counts.teacher_count }}</p>
        <p>Male: {{ counts. male_teacher_count }}</p>
        <p>Male: {{ counts.female_teacher_count }}</p>
        <canvas id="teacher-gender-chart" width="400" height="200"></canvas>
      </div>
      <div class="col-4">
        <p>total number of Students {{ counts.student_count }}</p>
        <p>Male: {{ counts. male_student_count }}</p>
        <p>Male: {{ counts.female_student_count }}</p>
        <canvas id="teacher-gender-chart" width="400" height="200"></canvas>
      </div>
      <div class="col-4">
        <div class="table-wrapper">
          <table class="table table-hover table-custom">
            <thead>
              <tr>
                <th>Strand</th>
                <th><i class="fa fa-mars mr-2 tcon"></i></th>
                <th><i class="fa fa-venus mr-2 tcon"></i></th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(strand, index) in studentsGrouped" :key="index">
                <td class="text-center">{{ strand.strand_name }} {{ strand.grade_level }}</td>
                <td class="text-center">{{ strand.male_count }}</td>
                <td class="text-center">{{ strand.female_count }}</td>
                <td class="text-center">{{ strand.total_count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { Chart } from 'chart.js';
export default {
  name: 'AdminDashboard',
  data() {
    return {
      counts: {
        teacher_count: 0,
        student_count: 0,
        strand_count: 0,
        subject_count: 0,
      },
      studentsGrouped: [],
    };
  },
  mounted() {
    this.fetchCounts();
    this.renderTeacherGenderChart();
  },
  methods: {
    fetchCounts() {
      axios.get('http://localhost:8000/api/counts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        // Set the counts data from the response
        this.counts = response.data.data.counts;
        
        // Extract grouped student data
        let groupedData = [];
        let grouped = response.data.data.students_grouped;
        
        // Loop through the grouped data to extract male and female counts per strand and grade level
        for (let strandName in grouped) {
          for (let gradeLevel in grouped[strandName]) {
            let group = grouped[strandName][gradeLevel];
            
            // Count male and female students manually from the students array
            let maleCount = group.students.filter(student => student.sex === 'male').length;
            let femaleCount = group.students.filter(student => student.sex === 'female').length;

            // Add the parsed data to the array
            groupedData.push({
              strand_name: strandName,
              grade_level: gradeLevel,
              male_count: maleCount,
              female_count: femaleCount,
              total_count: maleCount + femaleCount
            });
          }
        }

        this.studentsGrouped = groupedData;
        
      })
      .catch(error => {
        alert('Error fetching data: ' + error.message);
      });
    },
    renderTeacherGenderChart() {
  if (this.counts.male_teacher_count && this.counts.female_teacher_count) {
    const ctx = document.getElementById('teacher-gender-chart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          label: 'Teacher Gender',
          data: [this.counts.male_teacher_count, this.counts.female_teacher_count],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Teacher Gender Distribution'
        }
      }
    });
  }
}
  }
}
</script>

<style scoped>
.boxes {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background-color: #f8f9fa;
  width: 100%; /* Full width to fit within the column */
  height: 130px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer; /* Indicates clickable area */
  display: flex;
  align-items: center;
}

.icon {
  font-size: 60px;
  padding: 20px;
}

.icon1{
  color: #3572EF;
}
.icon2{
  color: #3572EF;
}
.icon3{
  color: #3572EF;
}
.icon4{
  color: #3572EF;
}

.content {
  flex: 1;
}
.tcon{
  font-size: 30px;
  color:white;
}
.content h4 {
  margin: 0;
  font-size: 32px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
}
/* Table Wrapper */
.table-wrapper {
  margin-top: 12px;
  margin-right: 5px;
}

/* Table Styles */
.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(5, 4, 4, 0.1);
  overflow: hidden;
}

.table-custom th {
  background-color: #3572EF;
  color: #000000;
  font-weight: 500;
  font-size: 20px;
}
.table th, .table td {
  text-align: center;
  vertical-align: middle;
}
.table td {
  font-size: 20px;
}

.table-custom tbody tr:hover {
  background-color: #f1f3f5;
}

.table-custom tbody tr {
  transition: background-color 0.3s ease;
}



.label {
  font-size: 16px;
  color: #000000;
}
</style>
