<template >
    <div id="carouselExampleInterval" style="margin-left: 50px;"  class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="10000">
        <img src="/student/Slide30.JPG" class="carouselimage" alt="Slide 1">
        </div>
        <div class="carousel-item" data-bs-interval="2000">
        <img src="/student/Slide31.JPG" class="carouselimage" alt="Slide 2">
        </div>
        <div class="carousel-item" data-bs-interval="10000">
        <img src="/student/Slide32.JPG" class="carouselimage" alt="Slide 3">
        </div>
        <div class="carousel-item" data-bs-interval="2000">
        <img src="/student/Slide33.JPG" class="carouselimage" alt="Slide 4">
        </div>
        <div class="carousel-item" data-bs-interval="10000">
        <img src="/student/Slide34.JPG" class="carouselimage" alt="Slide 5">
        </div>
        <div class="carousel-item" data-bs-interval="2000">
        <img src="/student/Slide35.JPG" class="carouselimage" alt="Slide 6">
        </div>
        
    </div>
  
  
      <!-- Previous button -->
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
  
      <!-- Next button -->
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
  
      <div class="carousel-buttons">
        <div class="left-buttons">
          <button class="btn btnmanual" @click="$router.go(-1)" style="text-align: center;font-weight: bolder; background-color: lightcoral;"><i class="bi bi-x-circle fs-4" ></i>  EXIT</button>
          <button class="btn btnmanual" @click="showCard('button1')" style="line-height: 1;"><small class="d-block mb-0">PAGE 1</small><i class="bi bi-person-check fs-4"></i> Log In</button>
          <button class="btn btnmanual" @click="showCard('button2')" style="line-height: 1;"><small class="d-block mb-0">PAGE 2</small><i class="bi bi-book-half fs-4"></i> Classes</button>
          <button class="btn btnmanual" @click="showCard('button3')" style="line-height: 1;"><small class="d-block mb-0">PAGE 3</small><i class="bi bi-easel2-fill fs-4"></i> Class Details</button>
          
        </div>
  
        <div class="right-buttons">
          <button class="btn btnmanual" @click="showCard('button4')" style="line-height: 1;"><small class="d-block mb-0">PAGE 4</small><i class="bi bi-journal-text fs-4"></i> Examination</button>
          <button class="btn btnmanual" @click="showCard('button5')" style="line-height: 1;"><small class="d-block mb-0">PAGE 5</small><i class="bi bi-bar-chart-line fs-4"></i> Results & Feedback</button>
          <button class="btn btnmanual" @click="showCard('button6')" style="line-height: 1;"><small class="d-block mb-0">PAGE 6</small><i class="bi bi-activity fs-4"></i> My Performance</button>
          <button class="btn btnmanual" @click="$router.go(-1)" style="text-align: center;font-weight: bolder; background-color: lightcoral;"><i class="bi bi-x-circle fs-4" ></i>  EXIT</button>
        </div>
      </div>
  
      <!-- Card for displaying info -->
      <div v-if="showCardContent" class="info-card">
        <button class="btn-close" @click="closeCard"></button>
        <h5>{{ cardTitle }}</h5>
        <p v-html="cardText"></p> <!-- Use v-html to render HTML -->
      </div>
    </div>
  
  </template>
  
  <script>
  export default {
    name: 'StudentManualPage',
    data() {
      return {
        showCardContent: false,
        cardTitle: '',
        cardText: ''
      };
    },
  methods: {
    showCard(button) {
      this.showCardContent = true;
  
      if (button === 'button1') {
        this.cardTitle = 'Login Instructions';
        this.cardText = `
          <b>1.1</b> Enter your LRN number as your username.<br><br>
          <b>1.2</b> Enter your password.<br><br>
            <ul>
                <li> <b>1.2.1</b> Click this icon to show or hide the password to verify if it is correct.<br></li>
            </ul>
          <b>1.3</b> A friendly pop-up reminder will inform users that if anyone forgets their password, they should notify the admin.<br><br>
          <b>1.4</b> The Sign In button is clicked to check if the username and password match the specific student's account, and if they do, the user will be directed to the student homepage.
        `;
      } else if (button === 'button2') {
        this.cardTitle = 'Classes Page'; // Update this title accordingly
        this.cardText = `
          <b>2.</b> This icon represents the classes , which encompasses various functionalities and attributes relevant to the entire system. It includes buttons that route users to different pages, facilitating seamless navigation throughout the application.<br>
            <ul>
              <li><b> 2.1 : Log Out </b> To log out, click on the "Logout" icon or option next to "WELCOME ( Your Name)".</li>
                <ul>
                    <p>A confirmation popup will appear</p>
                    <li><b>2.1.1 : Yes, log me out </b> Click this button to confirm logout.</li>
                    <li><b>2.1.2 : Cancel </b>Click this to cancel the logout action and stay logged in.</li>
                </ul>
              <li><b> 2.2 : Viewing a Class  </b> Click on any class card to view details or options specific to that class.</li>
                <ul>
                  <li>Use the dropdown menu labeled "SORT BY SEMESTER" to filter classes by semester (e.g., "First Semester").</li>
                </ul>
              <li><b> 2.3 : Joining a Class</b> </li>
                 <ul>
                  <p>To add a new class, click the <b>"+" </b>icon</p>
                  <li><b>2.3.1 : " + "</b> Click the <b>"plus"</b> icon within a circle to open the <b>"Join in Class"</b> form.
                    <ul>
                        <li>This brings up a modal where you can enter a class code to join a class.</li>
                        <li>Use the <b>"X"</b> button in the top-right corner to close the modal without joining.</li>
                    </ul>
                  </li>
                   <li><b>2.3.2 : Class Code</b> After entering the class code, click <b>"Join this Class"<b/> to submit your request.</b> 
                    <ul>
                        <li>A success message saying <b>"Request Successfully Submitted"</b> will display if the code is correct.</li>
                    </ul>
                  </li>
                  <li><b>2.3.3 : Join this Class Button</b> Click to submit and validate the class code you entered.</b> 
                    <ul>
                        <li><b>Already Joined</b>Displays if you’ve already joined the class.</li>
                        <li><b>Error</b> indicate that the class code is invalid, or your strand does not match the class requirements.</li>
                    </ul>
                  </li>
                </ul>
                <b>3.</b>  Click and it will route users to different pages, facilitating seamless navigation throughout the application.<br>
                You can click on any class card (2.2) to view more details or interact with the class.
          </ul>`;
      }else if (button === 'button3') {
        this.cardTitle = 'Class Details Page'; // Update this title accordingly
        this.cardText = `
          <b>3.</b> Start by accessing the Examinations or My Performance section. This interface displays all tasks associated with the class.<br>
          <ul>
              <li><b> 3.1 : Back to Classes Button </b> 
                <ul><li>o go back to the main list of classes, click on Back to Classes. This will return you to the homepage or previous screen showing the list of available classes.</ul></li></li>
              <li><b> 3.2 : Summary of Task Status </b> 
                <ul><li>In the top right, there’s a status summary showing the count of :
                    <ul>
                      <li><b>Finished / Completed:</b>Finished assessments (green icon)</li>
                      <li><b>Missing: </b>Missing assessments (red icon)</li>
                      <li><b>Pending: </b>Pending assessments (yellow icon)</li>
                    </ul>
                </li>
                <li>This overview provides a quick look at how many tasks are completed, overdue, or upcoming.</li>
                </ul></li>
              <li><b> 3.3 : Viewing and Managing Individual Task </b> 
                <ul>
                  <li>Each Assessment Task is displayed in a separate box with key details:
                    <li><bTask Title: : </b>The title of the assessment task (e.g., Assessment Task 1, Task 2).</li>
                    <li><b>Points</b>Total points that can be earned for the task.</li>
                    <li><b>Status: </b>Indicates if the task is <b>Passed, Pending, or Missing  </b>.</li>
                    <li><b>Availability: </b>Shows if the task is Available or Unavailable to start.</li>
                    <li><b>Due Date: </b>The deadline by which the task must be completed</li>
                    <li><b>Score</b>Displays the student’s score if available, along with the total possible points.</li>
                  </li>

                </ul></li>
              <li><b> 3.4 Data in Table</b>
                <ul>
                  <li>To get more information about a specific assessment, click on the assessment box (such as Assessment Task 2).</li>
                  <li>This action opens a detailed view of the task, showing additional information and options: exam instruction/s, quarter, strat and end date, status  (Pending ,Finished, Missing), and score
                    <ul>
                      <li><b>3.4.1</b>If the assessment is available, you can click on <b>Take Exam</b> to begin. It will navigate you to the page 4</li>
                      <li><b><3.4.2/b>If you decide not to proceed, use the <b>Close button</b> to exit the detailed view and return to the main assessment list.</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li><b> 3.5 : Edit Exam Details ( ">" )</b> 
          <b>6.</b> Click <b>"Performance Tracking"</b> to analyze students' performance and progress on assessments.<br>
        `;
      }else if (button === 'button4') {
        this.cardTitle = 'Exam Taking Page'; // Update this title accordingly
        this.cardText = `
          <b>4.</b>This guide should help you navigate the task interface effectively. <br>
            <ul>
              <li><b> 4.1 : Timer </b> 
                <ul><li>countdown at the top right displays how much time is left to complete the assessment. Keep an eye on this timer to ensure you submit all answers within the allotted time.</li></ul>
              </li>
              <li><b> 4.2 : Answering Questions </b> 
                <ul>
                  <li>The main section displays each question, along with answer options. To select an answer:
                    <ul></li>Click on the option you believe is correct. Selected answers will be highlighted.</li></ul>
                  </li>
                  <li>Make sure to carefully read the question and all options before choosing an answer.</li>
                </ul>
              </li>
              <li><b> 4.3 : Proceed to the Next Question</b> 
                <ul>
                  <li>Once you’ve selected an answer, click the <b>Next</b> button to proceed to the following question.The submit button is only available at the end of the examination, navigating the user to page 5</li>
                  <li>Ensure an answer is selected before clicking Next to avoid a warning.
                    <ul>
                      <b>Warning for Unanswered Questions</b>
                      <li>If you try to proceed without selecting an answer, a Warning message will pop up, prompting you to answer the question first.</li>
                      <li>To close the warning, click <b>OK</b> and ensure you select an answer before moving forward.</li>
                    </ul>
                  </li>
                </ul>
              </li>
          </ul>`;
      }else if (button === 'button5') {
        this.cardTitle = 'Results and Feedback'; // Update this title accordingly
        this.cardText = `
          <b>5.</b>This manual serves as a guide for viewing results and submitting feedback after completing a task/examination<br>
            <ul>
              <b>View of Exam task result</b>
              <li><b>5.1</b>
                <ul></li>The main section shows a visual representation of your score, including <b>Total Score</b> and <b>Average</b>.</li></ul>
              </li>
              <li><b>5.2 : Show Result Button</b>
                <ul></li>This may display a breakdown of your answers, correct responses, and other performance metrics.</li></ul>
              </li><br>
              <b>Your Feedback Section</b>
              <li><b>5.3</b>
                <ul></li> Use this space to share any thoughts or suggestions.</li></ul>
              </li>
              <li><b>5.4 : Submit Feedback Button</b>
                <ul></li> After entering your feedback, click the Submit Feedback button to send it. This can help improve future assessments.
                  <ul><li><b>5.4.1 : </b>Once submitted, a Success message appears, confirming that your feedback was received. Click OK to close this notification and will directly navigate you to Page 3 .</li></ul>
                </li></ul>
              </li>
            </ul>`;
      }else if (button === 'button6') {
        this.cardTitle = 'My Performance Section'; // Update this title accordingly
        this.cardText = `
          <b>6.</b>This guide should help you efficiently review and analyze your academic progress, using the performance table and filters to focus on specific assessments as needed. <br>
            <ul>
              <li><b>6.1 : Back to Classes</b>
                  <ul>
                      <li>Click on the Back to Classes button to return to the main class overview page. This is helpful if you need to navigate to a different subject or course.</li>
                  </ul>
              </li>
              <li><b>6.2 : Detailed Performance Table</b>
                  <ul>
                      <li>The performance table displays your scores across different assessments. It includes:
                        <ul>
                          <li>Assessment Name (e.g., Assessment Task 1, Task 2, etc.)</li>
                          <li>Quarter (e.g., 1st Quarter)</li>
                          <li>Total Points (e.g., 4/5)</li>
                          <li>Percentage (e.g., 80%)</li>
                          <li>Remarks (e.g., Passed or Failed)</li>
                          <li>Date of completion</li>
                        </ul>
                       </li>
                      <li>This table summarizes your overall progress and highlights areas where improvement may be needed.</li>
                  </ul>
              </li>
              <li><b>6.3 : Filter By Status</b>
                  <ul>
                      <li>Allows you to filter assessments based on their completion status (e.g., Passed, Failed). Use this to quickly locate assessments you may need to review.</li>
                  </ul>
              </li>
              <li><b>6.4 : Filter By Quarter</b>
                  <ul>
                      <li> Lets you filter assessments by the academic quarter. This is useful for tracking performance on a quarterly basis.</li>
                  </ul>
              </li>
              <li><b>6.5 : Overall Pass/Fail Status</b>
                  <ul>
                      <li>This summary provides a quick overview of your performance by showing the total number of Passed and Failed assessments. This helps you get a quick sense of your overall progress at a glance.</li>
                  </ul>
              </li>
            </ul>`;
          }
      // Add conditions for other buttons here
    },
    closeCard() {
      this.showCardContent = false;
    }
  }
  
  };
  </script>
  
  <style scoped>
  
  .carouselimage {
    width: 70%;
    height: auto;
    display: block;
    margin: 0 auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .carousel-buttons {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
  }
  
  .left-buttons, .right-buttons {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  

  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    background-color: black;
    filter: invert(1);
  }
  
  .carousel-control-prev {
    position: absolute;
    left: 150px;
    top: 50%;
    transform: translateY(-50%);
  }
  h5 {
    font-size: 30px;
    font-weight: 600;
    padding: 10px;
  }
  
  .carousel-control-next {
    position: absolute;
    right: 150px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  /* Style for the info card */
  .info-card {
    position: absolute; /* Position it absolutely within the carousel */
    top: 50%; /* Center it vertically */
    left: 50%; /* Center it horizontally */
    transform: translate(-50%, -50%); /* Shift it back to center */
    background-color: white; /* Card background */
    border-radius: 10px; /* Rounded corners */
    padding: 20px; /* Padding inside the card */
    height: 500px;
    overflow-x: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for depth */
    z-index: 10; /* Make sure it appears above other elements */
  }
  
  /* Close button style */
  .btn-close {
    position: absolute;
    top: 10px; /* Distance from the top */
    right: 10px; /* Distance from the right */
    color: black;
    cursor: pointer; /* Cursor pointer on hover */
    width: 15px; /* Button size */
    height: 15px; /* Button size */
    background-size: contain; /* Make icon fill the button */
    background-repeat: no-repeat; /* Prevent repeat */
  }
  small{
    font-size: 13px;
  }
  .btn {
    width: 200px;
    height: 70px;
    font-size: 20px;
    text-align: start;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  .btnmanual{
    background-color: #c1c1c1d7;
    border: 2px solid #fafdff; 
  }
  </style>
  