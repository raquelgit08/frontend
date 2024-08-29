<template>
  <div>
    <h3>DASHBOARD</h3>
    <div class="row mb-3">
      <!-- Chart Section -->
      <div class="col-lg-8 col-md-12 mb-3">
        <div class="graph">
          <h5>TOTAL NUMBER OF SENIOR HIGH SCHOOL STUDENTS: {{ totalStudents }}</h5>
          <b-card class="graph-card">
            <div class="chart-container">
              <BarChart :data="chartData" :options="chartOptions" />
            </div>
          </b-card>
        </div>
      </div>
      <!-- Statistics Section -->
      <div class="col-lg-4 col-md-12">
        <div class="row">
          <div class="col-6 mb-3" v-for="(stat, label) in stats" :key="label">
            <div class="boxes">
              <center>
                <h4>{{ stat }}</h4>
                <span class="label">TOTAL NUMBER OF <br /><b>{{ label }}</b></span>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from './adminbarchart.vue';
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  components: {
    BarChart,
  },
  data() {
    return {
      stats: {
        STEM: 0,
        ABM: 0,
        HUMMS: 0,
        'TVL-ICT': 0,
        'FEMALE USERS': 0,
        'MALE USERS': 0,
        TEACHERS: 0,
        STUDENTS: 0,
      },
      chartData: {
        labels: ['STEM', 'ABM', 'HUMMS', 'TVL ICT'],
        datasets: [
          {
            label: 'Number of Students',
            data: [0, 0, 0, 0],
            backgroundColor: ['#28a045', '#007bff', '#ffc107', '#dc3545'],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
      },
    };
  },
  computed: {
    totalStudents() {
      return (
        this.stats.STEM +
        this.stats.ABM +
        this.stats.HUMMS +
        this.stats['TVL-ICT']
      );
    },
  },
  mounted() {
    this.fetchUsersCounts();
    this.fetchDataStrand();
  },
  methods: {
    async fetchUsersCounts() {
      try {
        const response = await axios.get('http://localhost:8000/api/user-counts');
        this.stats['FEMALE USERS'] = response.data.femaleUsers;
        this.stats['MALE USERS'] = response.data.maleUsers;
        this.stats.TEACHERS = response.data.teacher;
        this.stats.STUDENTS = response.data.student;
      } catch (error) {
        console.error('Failed to fetch Users counts:', error);
      }
    },
    async fetchDataStrand() {
      try {
        const response = await axios.get('http://localhost:8000/api/countstrand', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const { total_stem, total_abm, total_humms, total_tvl } = response.data;

        this.stats.STEM = total_stem;
        this.stats.ABM = total_abm;
        this.stats.HUMMS = total_humms;
        this.stats['TVL-ICT'] = total_tvl;

        this.chartData.datasets[0].data = [
          total_stem,
          total_abm,
          total_humms,
          total_tvl,
        ];
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
};
</script>

<style>
h3 {
  color: #060000;
  padding: 10px;
  border-radius: 8px 8px 0 0;
  font-family: 'Georgia', serif;
  margin: 20px;
  text-align: center;
  background-color: #f7f7f7;
}

.graph {
  border: 2px solid whitesmoke;
  padding: 20px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.chart-container {
  position: relative;
  height: 300px;
}

.boxes {
  border: 1px solid #ccc;
  background-color: #ffffff;
  border-radius: 8px;
  height: 100px;
  padding: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.boxes:hover {
  transform: translateY(-5px);
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

.label {
  font-family: 'Verdana', Geneva, Tahoma, sans-serif;
  font-size: 14px;
  margin-top: 5px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 200px;
  }
  .boxes {
    height: 80px;
  }
  .label {
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  h3 {
    font-size: 18px;
  }
  .boxes {
    height: 70px;
  }
  .label {
    font-size: 10px;
  }
}
</style>
