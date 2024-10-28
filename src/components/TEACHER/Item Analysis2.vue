<template>
  <div>
    <h2>Item Analysis for Exam ID: {{ examId }}</h2>
    <p><strong>Exam ID: {{ exam_id }}</strong></p>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <h3>Exam Title: {{ itemAnalysisData.exam_title }}</h3>
      <p>Instructions: {{ itemAnalysisData.instruction }}</p>
      <p>Total Students: {{ itemAnalysisData.total_students }}</p>
      <p>Students Completed Exam: {{ itemAnalysisData.students_completed_exam }}</p>
      <p>Completion Percentage: {{ itemAnalysisData.completion_percentage }}</p>

      <h3>Item Analysis:</h3>
      <div v-for="(item, index) in itemAnalysisData.item_analysis" :key="index">
        <h4>Question: {{ item.question || 'No question available' }}</h4> <!-- Handle null case -->
        <p>Correct Answer Count: {{ item.correct_answers_count }}</p>
        <p>Item Difficulty: {{ item.difficulty_level }}</p>
        <p>Discrimination Level: {{ item.discrimination_level }}</p>

        <h5>Choices:</h5>
        <ul>
          <li v-for="(choice, idx) in item.choices" :key="idx">
            {{ choice.choice }} - {{ choice.count }} students ({{ choice.percentage }}%)
            <ul>
              <li v-for="student in choice.students" :key="student.user_id">
                {{ student.lname }}, {{ student.fname }} ({{ student.idnumber }})
              </li>
            </ul>
          </li>
        </ul>

        <h5>Top 3 High Scorers:</h5>
        <ul>
          <li v-for="(student, idx) in item.top3High" :key="idx">
            {{ student.user_id }} - Total Score: {{ student.total_score }}, Correct Answers: {{ student.correct_answers }}
          </li>
        </ul>

        <h5>Top 3 Low Scorers:</h5>
        <ul>
          <li v-for="(student, idx) in item.top3Low" :key="idx">
            {{ student.user_id }} - Total Score: {{ student.total_score }}, Correct Answers: {{ student.correct_answers }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import config from '@/config'; // Import your configuration file if you have one

export default {
  name: 'ItemAnalysis2',
  data() {
    return {
      exam_id: null,  // Update to match the route parameter
      itemAnalysisData: {},
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.exam_id = this.$route.params.exam_id; // Capture the correct route parameter
    this.fetchItemAnalysis();
  },
  methods: {
    async fetchItemAnalysis() {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                this.error = 'Authorization token is missing. Please log in again.';
                console.error(this.error);
                return;
            }

            const response = await axios.get(`${config.apiBaseURL}/itemAnalysis2`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    examId: this.exam_id,
                },
            });
                // Log the response data to the console
        console.log('API item analysissssss 2 Response:', response.data);

            this.itemAnalysisData = response.data;
            this.loading = false;
        } catch (error) {
            console.error('Error fetching item analysis:', error);
            this.error = error.response ? error.response.data.error : 'An unexpected error occurred.';
            this.loading = false;
        }
    },
},

};
</script>


<style scoped>
/* Add any custom styling if necessary */
</style>
