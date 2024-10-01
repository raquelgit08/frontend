<template>
  <div class="container-fluid">
    <!-- Statistics Section -->
    <div class="row">
      <div class="col-12 col-sm-6 col-md-3 mb-3">
        <div class="boxes box1 d-flex align-items-center p-3" @click="$router.push('/manage_teachers')">
          <i class="bi bi-person-video3 icon icon1"></i>
          <div class="content">
            <h4>{{ counts.teacher_count }}</h4>
            <span class="label">Total Number Of Teachers</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3 mb-3">
        <div class="boxes d-flex align-items-center p-3" @click="$router.push('/manage_students')">
          <i class="bi bi-person icon icon2"></i>
          <div class="content">
            <h4>{{ counts.student_count }}</h4>
            <span class="label">Total Number Of Students</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3 mb-3">
        <div class="boxes d-flex align-items-center p-3" @click="$router.push('/ManageStrandsinSHS')">
          <i class="bi bi-book-half icon icon3"></i>
          <div class="content">
            <h4>{{ counts.strand_count }}</h4>
            <span class="label">Total Number Of Strands</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3 mb-3">
        <div class="boxes d-flex align-items-center p-3" @click="$router.push('/AManageSubject')">
          <i class="bi bi-file-earmark-text icon icon4"></i>
          <div class="content">
            <h4>{{ counts.subject_count }}</h4>
            <span class="label">Total Number Of Subjects</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Table and Chart Sections -->
    <div class="row">
      <div class="col-2">
        <div class="chart-container">
          <h6 class="mb-2">TEACHERS GENDER DISTRIBUTION</h6>
          <canvas id="teacher-gender-chart" width="400" height="200"></canvas>
        </div>
        </div>
        <div class="col-2">
        <div class="chart-container">
          <h6 class="mb-2">STUDENTS GENDER DISTRIBUTION</h6>
          <canvas id="student-gender-chart" width="400" height="200"></canvas>
        </div>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <div class="chart-container">
          <h6 class="mb-2">STUDENTS BY STRAND AND GRADE LEVEL</h6>
          <canvas id="students-strand-chart" width="400" height="200"></canvas>
        </div>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <div class="chart-container">
          <h6 class="mb-2">STUDENTS STRAND Analysis</h6>
          <canvas id="strand-chart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>

    
  </div>
</template>


<script>
import axios from 'axios';
import config from '@/config';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'AdminDashboard',
  data() {
    return {
      counts: {
        teacher_count: 0,
        student_count: 0,
        strand_count: 0,
        subject_count: 0,
        male_teacher_count: 0,
        female_teacher_count: 0,
      },
      studentsGrouped: [],
      strandChartData: [],
      chartInstanceTeacher: null,
      chartInstanceStudent: null,
      chartInstanceStrand: null,
    };
  },
  mounted() {
    this.fetchCounts();
  },
  methods: {
    fetchCounts() {
      axios.get(`${config.apiBaseURL}/counts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        // Extract strand counts data
        let strandCounts = response.data.data.strand_counts;
        this.strandChartData = Object.keys(strandCounts).map(strandName => {
          return {
            label: strandName,
            value: strandCounts[strandName]
          };
        });

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
        
        // Render charts after data is fetched
        this.renderTeacherGenderChart();
        this.renderStudentGenderChart();
        this.renderStrandChart();
        this.renderStudentsStrandChart();
      })
      .catch(error => {
        alert('Error fetching data: ' + error.message);
      });
    },
    
    renderTeacherGenderChart() {
      if (this.chartInstanceTeacher) {
        this.chartInstanceTeacher.destroy();
      }
      const ctx = document.getElementById('teacher-gender-chart').getContext('2d');
      this.chartInstanceTeacher = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            `Male Teachers: ${this.counts.male_teacher_count}`, 
            `Female Teachers: ${this.counts.female_teacher_count}`],
          datasets: [{
            label: 'Teacher Gender Distribution',
            data: [this.counts.male_teacher_count, this.counts.female_teacher_count],
            backgroundColor: [
              '#C21010',
              '#EAD196'
            ],
            borderColor: [
              '#F5F5F5',
              '#F5F5F5'
            ],
            borderWidth: 1
          }]
        },
        options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Arial', // Font family for legend labels
                size: 14,
              }
            }
          },
          tooltip: {
            titleFont: {
              family: 'Arial', // Font family for tooltip title
              size: 17,       // Font size for tooltip title
              weight: 'bold',
            },
            bodyFont: {
              family: 'Arial', // Font family for tooltip body
              size: 14,
            }
          }
        }
      }
      });
    },

    renderStudentGenderChart() {
      if (this.chartInstanceStudent) {
        this.chartInstanceStudent.destroy();
      }
      const ctx = document.getElementById('student-gender-chart').getContext('2d');
      this.chartInstanceStudent = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            `Male Students: ${this.counts.male_student_count}`, 
            `Female Students: ${this.counts.female_student_count}`],
          datasets: [{
            label: 'Student Gender Distribution',
            data: [this.counts.male_student_count, this.counts.female_student_count],
            backgroundColor: [
              '#FFAD60',
              '#C21010'
            ],
            borderColor: [
              '#F5F5F5',
              '#F5F5F5'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  family: 'Arial',
                  size: 14,
                }
              }
            },
            tooltip: {
              titleFont: {
                family: 'Arial',
                size: 17,
                weight: 'bold',
              },
              bodyFont: {
                family: 'Arial',
                size: 14,
              }
            }
          }
        }
      });
    },

    renderStrandChart() {
      if (this.chartInstanceStrand) {
        this.chartInstanceStrand.destroy();
      }
      const ctx = document.getElementById('strand-chart').getContext('2d');
      this.chartInstanceStrand = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.strandChartData.map(strand => strand.label),
          datasets: [{
            label: 'Number of Students',
            data: this.strandChartData.map(strand => strand.value),
            backgroundColor: '#E64848',
            borderColor: '#1A2130',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  family: 'Arial',
                  size: 14,
                }
              }
            },
            tooltip: {
              titleFont: {
                family: 'Arial',
                size: 17,
                weight: 'bold',
              },
              bodyFont: {
                family: 'Arial',
                size: 14,
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: true
              }
            }
          }
        }
      });
    },

    renderStudentsStrandChart() {
      if (this.chartInstanceStudentsStrand) {
        this.chartInstanceStudentsStrand.destroy();
      }
      const ctx = document.getElementById('students-strand-chart').getContext('2d');
      this.chartInstanceStudentsStrand = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.studentsGrouped.map(data => `${data.strand_name} ${data.grade_level}`),
          datasets: [
            {
              label: 'Male Students',
              data: this.studentsGrouped.map(data => data.male_count),
              backgroundColor: '#C21010',
              borderColor: '#1A2130',
              borderWidth: 1
            },
            {
              label: 'Female Students',
              data: this.studentsGrouped.map(data => data.female_count),
              backgroundColor: '#EE4E4E',
              borderColor: '#1A2130',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  family: 'Arial',
                  size: 14,
                }
              }
            },
            tooltip: {
              titleFont: {
                family: 'Arial',
                size: 17,
                weight: 'bold',
              },
              bodyFont: {
                family: 'Arial',
                size: 14,
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: true
              }
            }
          }
        }
      });
    }
  }
};
</script>


<style scoped>
.chart-container {
  width: 100%;  /* Instead of fixed 420px */
  height: auto;  /* Let height adjust based on content */
  max-width: 500px; /* Ensure it doesn't grow too large */
  padding: 10px;
  margin: 10px;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}


.chart-table {
 margin-top: 10px;
 
  padding: 10px;
  padding-top: 5px;

  border: 1px solid #dee2e6;
  border-radius: 15PX;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}
h6{
  padding-top: 30px;
}
.chart-wrapper {
  flex: 1;
  max-width: 300px; /* Adjust this as needed */
  text-align: center;
}

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
  color: #BF3131;
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
  padding: 10PX;
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
