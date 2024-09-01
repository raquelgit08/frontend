<template>
    <div class="exam-creation-page">
      <div class="container-fluid">
          <!-- Main Content Section -->
          <div class="col-md-10 right-column">
            <router-view></router-view>
            <div class="exam-creation-page-content">
              <center>
                <h1>Exam Creation</h1>
              </center>
  
              <!-- Section for displaying added questions -->
              <div class="added-questions">
                <h2>Added Questions</h2>
                <div v-for="(item, index) in questions" :key="index" class="question-item">
                  <div class="question-form">
                    <div class="question-filter">
                      <label for="question-type">Question Type:</label>
                      <select id="question-type" v-model="item.type" disabled>
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True or False</option>
                        <option value="identification">Identification</option>
                      </select>
                    </div>
  
                    <label for="question">Question:</label>
                    <input type="text" id="question" v-model="item.question" :disabled="item.disabled" />
  
                    <div v-if="item.type === 'multiple-choice'">
                      <div class="options-wrapper">
                        <div class="option-row">
                          <div class="option">
                            <label for="optionA">Option A:</label>
                            <input type="text" id="optionA" v-model="item.options[0]" />
                          </div>
                          <div class="option">
                            <label for="optionB">Option B:</label>
                            <input type="text" id="optionB" v-model="item.options[1]" />
                          </div>
                        </div>
                        <div class="option-row">
                          <div class="option">
                            <label for="optionC">Option C:</label>
                            <input type="text" id="optionC" v-model="item.options[2]" />
                          </div>
                          <div class="option">
                            <label for="optionD">Option D:</label>
                            <input type="text" id="optionD" v-model="item.options[3]" />
                          </div>
                        </div>
                      </div>
                    </div>
  
                    <div v-if="item.type === 'true-false'">
                      <label for="correct-answer">Correct Answer:</label>
                      <select id="correct-answer" v-model="item.correctAnswer" :disabled="item.disabled">
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
  
                    <div v-if="item.type === 'identification'">
                      <label for="correct-answer">Correct Answer:</label>
                      <input type="text" id="correct-answer" v-model="item.correctAnswer" :disabled="item.disabled" />
                    </div>
  
                    <label for="points">Points:</label>
                    <input type="number" id="points" v-model="item.points" :disabled="item.disabled" />
  
                    <div class="action-buttons">
                      <button @click="duplicateItem(index)" class="btn-duplicate">
                        <i class="fas fa-copy"></i> <!-- Font Awesome duplicate icon -->
                      </button>
  
                      <button @click="deleteItem(index)" class="btn-delete">
                        <i class="fas fa-trash-alt"></i> <!-- Font Awesome delete icon -->
                      </button>
                      
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Section for creating new questions -->
              <div class="question-creation">
                <div class="question-filter">
                  <label for="question-type">Select Question Type:</label>
                  <select id="question-type" v-model="selectedQuestionType">
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True or False</option>
                    <option value="identification">Identification</option>
                  </select>
                </div>
  
                <div v-if="selectedQuestionType === 'multiple-choice'" class="question-form">
                  <label for="question">Question:</label>
                  <input type="text" id="question" v-model="question" />
  
                  <div class="options-wrapper">
                    <div class="option-row">
                      <div class="option">
                        <label for="optionA">Option A:</label>
                        <input type="text" id="optionA" v-model="options[0]" />
                      </div>
                      <div class="option">
                        <label for="optionB">Option B:</label>
                        <input type="text" id="optionB" v-model="options[1]" />
                      </div>
                    </div>
                    <div class="option-row">
                      <div class="option">
                        <label for="optionC">Option C:</label>
                        <input type="text" id="optionC" v-model="options[2]" />
                      </div>
                      <div class="option">
                        <label for="optionD">Option D:</label>
                        <input type="text" id="optionD" v-model="options[3]" />
                      </div>
                    </div>
                  </div>
  
                  <label for="correct-answer">Correct Answer:</label>
                  <input type="text" id="correct-answer" v-model="correctAnswer" />
  
                  <label for="points">Points:</label>
                  <input type="number" id="points" v-model="points" />
  
                  <button @click="addItem" class="btn-add">Add Item</button>
                </div>
  
                <div v-if="selectedQuestionType === 'true-false'" class="question-form">
                  <label for="question">Question:</label>
                  <input type="text" id="question" v-model="question" />
  
                  <label for="correct-answer">Correct Answer:</label>
                  <select id="correct-answer" v-model="correctAnswer">
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
  
                  <label for="points">Points:</label>
                  <input type="number" id="points" v-model="points" />
  
                  <button @click="addItem" class="btn-add">Add Item</button>
                </div>
  
                <div v-if="selectedQuestionType === 'identification'" class="question-form">
                  <label for="question">Question:</label>
                  <input type="text" id="question" v-model="question" />
  
                  <label for="correct-answer">Correct Answer:</label>
                  <input type="text" id="correct-answer" v-model="correctAnswer" />
  
                  <label for="points">Points:</label>
                  <input type="number" id="points" v-model="points" />
  
                  <button @click="addItem" class="btn-add">Add Item</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  </template>
  
  <script>
  export default {
    name: 'CreatingExamination',
    data() {
      return {
        showForm: false,
        selectedQuarter: '',
        selectedDate: this.getCurrentDate(),
        selectedTime: this.getCurrentTime(),
        selectedItem: '',
        
        selectedQuestionType: 'multiple-choice',
        question: '',
        options: ['', '', '', ''], // Assuming 4 options for multiple-choice
        correctAnswer: '',
        points: 1,
        questions: []
      };
    },
    methods: {
      getCurrentDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      },
      getCurrentTime() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
      },
      addItem() {
        const newItem = {
          type: this.selectedQuestionType,
          question: this.question,
          options: this.options.slice(),
          correctAnswer: this.correctAnswer,
          points: this.points,
          disabled: true
        };
        this.questions.push(newItem);
        this.resetForm();
      },
      resetForm() {
        this.question = '';
        this.options = ['', '', '', ''];
        this.correctAnswer = '';
        this.points = 1;
      },
      deleteItem(index) {
        this.questions.splice(index, 1);
      },
      duplicateItem(index) {
        const itemToDuplicate = this.questions[index];
        const newItem = { ...itemToDuplicate };
        this.questions.splice(index + 1, 0, newItem);
      },
      handleLogoutClick() {
        // Logout logic here
      },
      handleItemClick(path) {
        this.selectedItem = path;
      }
    }
  };
  </script>
  
  <style scoped>
  .exam-creation-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .container-fluid {
    flex: 1;
  }
  
  .left-column {
    background-color: white;
    padding: 10px;
    border-right: 1px solid #ddd;
    height: 100vh;
    width: 250px;
  }
  
  .right-column {
    padding: 20px;
    background-color: white;
    flex: 1;
  }
  
  .list-group-container {
    height: 100%;
  }
  
  .list-group {
    color: #333;
    text-decoration: none;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 10px 0;
    padding: 10px;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  
  .list-group.active,
  .list-group:hover,
  .logOut:hover {
    background-color: #50C878;
    color: white;
  }
  
  .icon-label {
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .icon-label i {
    margin-right: 10px;
  }
  
  .icon-label .label {
    flex: 1;
  }
  
  .exam-creation-page-content {
    padding: 15px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 900px;
    margin: 20px auto;
  }
  
  .exam-creation-page-content h1 {
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    background-color: #4CAF50;
    color: #fff;
    padding: 15px;
    border-radius: 8px 8px 0 0;
    text-align: center;
  }
  
  .added-questions {
    margin-top: 20px;
  }
  
  .added-questions h2 {
    font-family: 'Arial', sans-serif;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }
  
  .question-item {
    background-color: #fff;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .question-form {
    margin-bottom: 20px;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .question-form label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  
  .question-form input,
  .question-form select {
    width: calc(100% - 20px);
    padding: 8px;
    margin-bottom: 8px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .options-wrapper {
    display: flex;
    flex-wrap: wrap;
  }
  
  .option-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  
  .option {
    width: calc(50% - 10px);
  }
  
  .option label {
    display: block;
    margin-bottom: 4px;
  }
  
  .btn-add,
  .btn-delete,
  .btn-duplicate {
    padding: 8px 16px;
    margin-top: 10px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-add:hover,
  .btn-delete:hover,
  .btn-duplicate:hover {
    background-color: #45a049;
  }
  </style>
  