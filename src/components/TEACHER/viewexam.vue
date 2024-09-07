<template>
  <div class="exam-details-container" v-if="exam">
    <i class="fas fa-arrow-left" style="margin-right: 10px; cursor: pointer;" @click="$router.go(-1)"></i>
    <h2 class="text-center">Exam Details</h2>
    <div style="display: flex; justify-content: space-between;">
      <h3>TITLE: {{ exam.title }} | {{ exam.quarter }} </h3><h5>Schedule: {{ exam.start }} - {{ exam.end }}</h5>
    </div>
    <div class="table-wrapper">
      <table class="table table-hover table-custom">
        <thead class="table-info">
          <tr>
            <th style="width: 3%;">#</th>
            <th style="width: 35%;">Question</th>
            <th style="width: 30%;">Choices</th>
            <th style="width: 15%;">Correct Answer</th>
            <th style="width: 7%;">Points</th>
          </tr>
       </thead>
        <tbody>
          <tr v-for="(item, index) in exam.questions" :key="index">
            <td style="text-align: center;"><b>{{ index + 1 }}</b></td>
            <td>{{ item.question }}</td>
            <td><li v-for="(choice, index) in item.choices" :key="index">
                  {{ choice.choices }}
                </li></td>
            <td>{{ item.correct_answers[0].correct_answer }}</td>
            <td style="text-align: center;"><b>{{ item.correct_answers[0].points  }}</b></td>
          </tr>
          
        </tbody>
      </table>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ViewExam',
  data() {
    return {
      exam: {},
    };
  },
  
  async created() {
    try {
      const examId = this.$route.params.examId;
      const response = await axios.get(`http://localhost:8000/api/exams/${examId}/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data); // Log the API response data
      this.exam = response.data.exam;
    } catch (error) {
      console.error('Failed to fetch exam details:', error.message);
    }
  },
};
</script>

<style scoped>
.exam-details-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(5, 4, 4, 0.1);
  padding: 20px;
}


/* Table Wrapper */
.table-wrapper {
  margin: 0 auto;
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
}

.table-custom th {
  background-color: #0d8eead7;
  color: #000000;
  font-weight: 700;
}
.table th{
  text-align: center;
  vertical-align: middle;
}
template{
  background-color: #007bff;
}

.table-custom tbody tr:hover {
  background-color: #f1f3f5;
}

.table-custom tbody tr {
  transition: background-color 0.3s ease;
}
</style>
  