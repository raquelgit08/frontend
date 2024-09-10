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



    <div class="row">
      <div class="col-12 col-sm-6 col-md-3 mb-3 teacher"><br>
        <div class="container">
          <center><h5>TOTAL NUMBER OF TEACHERS: {{ counts.teacher_count }}</h5></center><br>
        <canvas id="teacher-gender-chart" ></canvas>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3 mb-3 teacher"></div>
      <div class="col-12 col-sm-6 col-md-3 mb-3 teacher ">
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
    <div class="row">
      <div class="col">
        <canvas id="strand-student-chart" ></canvas>
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
      chartInstance: null,
      counts: {
        teacher_count: 0,
        student_count: 0,
        strand_count: 0,
        subject_count: 0,
      },
      teacherGrouped: {
        male: {
          male_count: 0,
          female_count: 0,
          total_count: 0,
        },
        female: {
          male_count: 0,
          female_count: 0,
          total_count: 0,
        },
      },
    };
  },
  mounted() {
    this.fetchCounts();
    this.createTeacherGenderChart();
  },
  methods: {
    fetchCounts() {
      axios.get('http://localhost:8000/api/counts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        this.counts = response.data.data.counts;
        this.teacherGrouped = response.data.data.teacher_grouped;
        this.createTeacherGenderChart();
      })
      .catch(error => {
        alert('Error fetching data: ' + error.message);
      });
    },
    createTeacherGenderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy(); // Destroy the previous chart instance
      }

      const ctx = document.getElementById('teacher-gender-chart').getContext('2d');
      this.chartInstance = new Chart(ctx, { // Create a new chart instance and store it in the reference
        type: 'pie',
        data: {
          labels: [ 
            
          `Male (${this.teacherGrouped.male.total_count})`,
          `Female (${this.teacherGrouped.female.total_count})`,
          ],
          datasets: [{
            label: 'Teacher Gender',
            data: [this.teacherGrouped.male.total_count, this.teacherGrouped.female.total_count],
            backgroundColor: ['#3559E0', '#98ABEE'],
            hoverBackgroundColor: ['#007BFF', '#28a745'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
        
        }
      });
    },
   
  },
};
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
.teacher {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10;
  height: 430px;
  width: 380px;
  margin-top: 10px;
  margin: 10px;
  
}
.container{
  border-radius: 10px;
  padding: 10;
  height: 30px;
  margin-bottom: 10px;
}


.icon {
  font-size: 60px;
  padding: 20px;
  color: #3D56B2;
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
}

/* Table Styles */
.table-custom {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(5, 4, 4, 0.1);
  overflow: hidden;
}

.table-custom th {
  background-color: #0d8aeadf;
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
