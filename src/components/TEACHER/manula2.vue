<template >
    <div id="carouselExampleInterval" style="margin-top: 50px; margin-bottom: 50px;" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="10000">
        <img src="/teacher/Slide18.JPG" class="carouselimage" alt="Slide 1">
        </div>
        <div class="carousel-item" data-bs-interval="2000">
        <img src="/teacher/Slide19.JPG" class="carouselimage" alt="Slide 2">
        </div>
        <div class="carousel-item" data-bs-interval="10000">
        <img src="/teacher/Slide20.JPG" class="carouselimage" alt="Slide 3">
        </div>
        <div class="carousel-item" data-bs-interval="2000">
        <img src="/teacher/Slide21.JPG" class="carouselimage" alt="Slide 4">
        </div>
        <div class="carousel-item" data-bs-interval="10000">
        <img src="/teacher/Slide22.JPG" class="carouselimage" alt="Slide 5">
        </div>
        <div class="carousel-item" data-bs-interval="2000">
        <img src="/teacher/Slide23.JPG" class="carouselimage" alt="Slide 6">
        </div>
        <div class="carousel-item" data-bs-interval="10000">
        <img src="/teacher/Slide24.JPG" class="carouselimage" alt="Slide 5">
        </div>
        <div class="carousel-item" data-bs-interval="2000">
        <img src="/teacher/Slide25.JPG" class="carouselimage" alt="Slide 6">
        </div>
        <div class="carousel-item" data-bs-interval="10000">
        <img src="/teacher/Slide26.JPG" class="carouselimage" alt="Slide 5">
        </div>
        <div class="carousel-item" data-bs-interval="2000">
        <img src="/teacher/Slide27.JPG" class="carouselimage" alt="Slide 7">
        </div>
        <div class="carousel-item" data-bs-interval="10000">
        <img src="/teacher/Slide28.JPG" class="carouselimage" alt="Slide 8">
        </div>
        <div class="carousel-item" data-bs-interval="2000">
        <img src="/teacher/Slide29.JPG" class="carouselimage" alt="Slide 9">
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
          <button class="btn btnmanual" @click="showCard('button2')" style="line-height: 1;"><small class="d-block mb-0">PAGE 2</small><i class="bi bi-book-half fs-4"></i> My Classes</button>
          <button class="btn btnmanual" @click="showCard('button3')" style="line-height: 1;"><small class="d-block mb-0">PAGE 3</small><i class="bi bi-easel2-fill fs-4"></i> Class Details</button>
          <button class="btn btnmanual" @click="showCard('button4')" style="line-height: 1;"><small class="d-block mb-0">PAGE 4</small><i class="bi bi-newspaper fs-4"></i> Exam Management</button>
        </div>
  
        <div class="right-buttons">
          <button class="btn btnmanual" @click="showCard('button5')" style="line-height: 1;"><small class="d-block mb-0">PAGE 5</small><i class="bi bi-file-earmark-bar-graph fs-4"></i> Item Analysis</button>
          <button class="btn btnmanual" @click="showCard('button6')" style="line-height: 1;"><small class="d-block mb-0">PAGE 6</small><i class="bi bi-chat-dots fs-4"></i> Feedback</button>
          <button class="btn btnmanual" @click="showCard('button7')" style="line-height: 1;"><small class="d-block mb-0">PAGE 7</small><i class="bi bi-activity fs-4"></i> Performance Tracking</button>
          <button class="btn btnmanual" @click="showCard('button8')" style="line-height: 1;"><small class="d-block mb-0">PAGE 8</small><i class="bi bi-person-lines-fill fs-4"></i> Students</button>
          <button class="btn btnmanual" @click="showCard('button9')" style="line-height: 1;"><small class="d-block mb-0">PAGE 9</small><i class="bi bi-hourglass-split fs-4"></i> Pending</button>
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
    name: 'TeacherManualPage',
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
          <b>1.1</b> Enter your employee number as your username.<br><br>
          <b>1.2</b> Enter your password.<br><br>
            <ul>
                <li> <b>1.2.1</b> Click this icon to show or hide the password to verify if it is correct.<br></li>
            </ul>
          <b>1.3</b> A friendly pop-up reminder will inform users that if anyone forgets their password, they should notify the teacher.<br><br>
          <b>1.4</b> The Sign In button is clicked to check if the username and password match the specific teacher's account, and if they do, the user will be directed to the teacher homepage.
        `;
      } else if (button === 'button2') {
        this.cardTitle = 'My Classes Page'; // Update this title accordingly
        this.cardText = `
          <b>2.</b> This icon represents the classes , which encompasses various functionalities and attributes relevant to the entire system. It includes buttons that route users to different pages, facilitating seamless navigation throughout the application.<br>
            <ul>
              <li><b> 2.1 : Log Out </b> To log out, click on the "Logout" icon or option next to "WELCOME ( Your Name)".</li>
                <ul>
                    <p>A confirmation popup will appear</p>
                    <li><b>2.1.1 : Yes, log me out </b> Click this button to confirm logout.</li>
                    <li><b>2.1.2 : Cancel </b>Click this to cancel the logout action and stay logged in.</li>
                </ul>
              <li><b> 2.2 : Filter Classes by Semester  </b> </li>
                <ul>
                  <li>Use the dropdown menu labeled "SORT BY SEMESTER" to filter classes by semester (e.g., "First Semester").</li>
                </ul>
              <li><b> 2.3 : Add New Class</b> </li>
                 <ul>
                  <p>To add a new class, click the <b>"+" </b>icon</p>
                  <li><b>2.3.1 : Strand</b> Select the strand for the class from the dropdown.</li>
                  <li><b>2.3.2 : Section</b> Select the section from the dropdown.</li>
                  <li><b>2.3.3 : Semester</b> Choose the semester (e.g., First or Second Semester).</li>
                  <li><b>2.3.4 : Subjects</b> Choose the subject(s) for the class.</li>
                  <li><b>2.3.5 : Year</b> Select the academic year.</li>
                  <li><b>2.3.6 : Class Description </b> Enter a description for the class if required.</li>
                  <li><b>2.3.7 : Upload Picture </b>  Click <b>"Choose File"</b> to upload a picture for the class.</li>
                  <li><b>2.3.8 : Generate Code </b> Click <b>"Generate Code"</b> to create a unique class code automatically.</li>
                  <li><b>2.3.9 </b> Click <b>"Save"</b> to add the class to your list.</li>
                  <li><b>2.3.10</b> Click <b>"Close"</b> to exit the form without saving</li>
                </ul>
              <li><b> 2.4 : Class Cards</b> </li>
                <ul>
                  <li>Each class is displayed as a card showing : Class Name, Strand , Class Code , Semester, & School Year</li>
                  <li>Click <b>"Archive"</b> to archive the specific class.</li>
                </ul>
              <li><b> 2.5</b> Click to be directly go to your desired classroom</li><br>
          </ul>`;
      }else if (button === 'button3') {
        this.cardTitle = 'Class Details Page'; // Update this title accordingly
        this.cardText = `
          <b>3.</b> This consolidates and displays key information and metrics in a concise, easily digestible format. It typically serves as a centralized location for monitoring exams schedule, tracking progress, and analyzing data across various domains. <br>
          <ul>
              <li><b> 3.1 : Back to Classes Button </b> 
                <ul><li>Click on "Go Back to Classes" to return to the main dashboard with all classes.</ul></li></li>
              <li><b> 3.2 : Search Bar </b> 
                <ul><li>Use the search bar labeled "Search Exam..." to quickly find specific assessments within this class.</ul></li></li>
              <li><b> 3.3 : Exam Schedule Button </b> 
                <ul>
                  <li>Click "Exam Schedule" to view or manage the exam dates and times for the class.</li>
                  <li><b>3.3.1 : </b>Click the <b>"X"</b> to close the form without saving.</li>
                  <li><b>3.3.2 : Exam Title</b> Enter the title for the exam (e.g., "Assessment Task 1").</li>
                  <li><b>3.3.3 : Quarter</b> Select the quarter in which the exam will be conducted (e.g., "1st Quarter").</li>
                  <li><b>3.3.4 : Start Date</b> Choose the start date for the exam.</li>
                  <li><b>3.3.5 : End Date</b> Select the end date for the exam.</li>
                  <li><b>3.3.6 : Max Points</b> Set the maximum score achievable for this exam (e.g., "10").</li>
                  <li><b>3.3.7 :Start Time</b> Set the start time of the exam.</li>
                  <li><b>3.3.8 : End Time</b> Set the end time of the exam.</li>
                  <li><b>3.3.9 :</b> Click <b>"Save Schedule Button"</b> to save and assign the exam details to the students.</li>
                  <li><b>3.3.10 :</b> Press <b>"Close Button"</b> to exit the form without saving changes.
                    <ul>
                      <li><b>3.3.10.1 :</b> When saving, a confirmation prompt appears. Choose <b>"Yes, assign it!"</b> to confirm. <br> After successful assignment, an <b>"OK"</b> button appears to acknowledge the completion</li>
                      <li><b>3.3.10.2 :</b> When saving, a confirmation prompt appears. Choose <b>"Cancel"</b> to abort the process</li>
                    </ul>
                  </li>
                </ul></li>
              <li><b> 3.4 Data in Table</b>
                <ul><li>The table lists all assessments for the class, including: Title Exam, Quarter, Schedule of exam (Strat and End), Maximum Points, Response tracking and the Percentage</li></ul>
              </li>
              <li><b> 3.5 : Edit Exam Details ( ">" )</b> 
                <ul>
                  <li><b>3.5.1 : </b>Click the <b>"X"</b> to close the form without saving.</li>
                  <li><b>3.5.2 : Exam Title</b> Modify the title for the exam (e.g., "Assessment Task 1").</li>
                  <li><b>3.5.3 : Quarter</b> Adjust the quarter in which the exam will be conducted (e.g., "1st Quarter").</li>
                  <li><b>3.5.4 : Start Date</b> Modify the start date for the exam.</li>
                  <li><b>3.5.5 : End Date</b> Adjust the end date for the exam.</li>
                  <li><b>3.5.6 : Max Points</b> Update the maximum score achievable for this exam (e.g., "10").</li>
                  <li><b>3.5.7 :Start Time</b> Update the start time of the exam. (if needed)</li>
                  <li><b>3.5.8 : End Time</b> Adjust the end time of the exam.(if needed)</li>
                  <li><b>3.5.9 :</b> Click <b>"Update Exam Button"</b> to modified the exam details to the students.</li>
                  <li><b>3.5.10 :</b> Press <b>"Close Button"</b> to exit the form without saving changes.
                    <ul>
                      <li><b>3.5.10.1 :</b> When saving, a confirmation prompt appears. Choose <b>"Yes, assign it!"</b> to confirm. <br> After successful assignment, an <b>"OK"</b> button appears to acknowledge the completion</li>
                      <li><b>3.5.10.2 :</b> When saving, a confirmation prompt appears. Choose <b>"Cancel"</b> to abort the process</li>
                    </ul>
                  </li>
                </ul>
              </li><br>
          </ul>
          <b>6.</b> Go to <b>"Feedback"</b> to view or provide feedback related to the class.<br>
          <b>7.</b> Click <b>"Performance Tracking"</b> to analyze students' performance and progress on assessments.<br>
          <b>8.</b> View the list of students enrolled in the class by clicking "Students."<br>
          <b>9.</b> Access any pending tasks or actions related to this class."<br>
        `;
      }else if (button === 'button4') {
        this.cardTitle = 'Exam Management'; // Update this title accordingly
        this.cardText = `
          <b>4.</b>This section outlines the functionalities with regards to the formulation of exam, detailing key operations related to this section.<br>
            <ul>
              <b>3. Go Back to Classes (Page)</b> Click this link button to return to the main classes page. This allows you to exit the current exam management section and go back to the list of classes.<br>
             
              <li><b> 4.1 : Created Questions Panel </b> Displays the list of questions that have been created for the exam. It shows each question along with the correct answer and possible choices.
                <ul><li><b>4.1.1 Edit Icon</b>Click this icon to edit an existing question. This allows you to make changes to the question text only </li></ul>
              </li>
              <li><b> 4.2 : Exam Instruction Field </b> Enter the exam instructions here. This text will appear at the beginning of the exam to guide students on how to proceed.</li>
              <li><b> 4.3 : Question Type Dropdown </b> Select the type of question from the dropdown. By default, it’s set to “Multiple Choice.”</li>
              <li><b> 4.4 : Question and Answer Input Fields </b> </li>
                <ul>
                  <li><b>4.4.1 :  Question Text Field</b> Enter the question text here.</li>
                  <li><b>4.4.2 : Choices Fields</b> Input the answer choices here. You can enter multiple options for each question.</li>
                  <li><b>4.4.3 : Add Choice Button</b> Click this button to add a new choice field if the question requires more options.</li>
                  <li><b>4.4.4 : Correct Answer Field</b> Specify the correct answer for the question in this field. Choose from the dropdown that displays all available choices.</li>
                  <li><b>4.4.5 : Points Field</b>Enter the number of points that this question is worth.</li>
                </ul>
              <li><b> 4.5 : Save All Button </b> <br>After filling in the question, choices, correct answer, and points, click this button to save all the questions you’ve added.
                <ul>
                  <li><b>4.5.1 </b> Once you save the questions, a <b>“Success”</b> message will appear confirming that all questions were saved successfully. Click OK to dismiss this message.</li>
                </ul>
              </li>
              <li><b> 4.6 : Add New Question Button: </b> <br>Click this button to add another question to the exam. This will clear the fields and allow you to start entering a new question.</li>
            <b>5. View Item Analysis Button </b> Click this button to view a detailed analysis of each exam question. This provides insights on student responses and performance.<br>
          </ul>`;
      }else if (button === 'button5') {
        this.cardTitle = 'Item Analysis'; // Update this title accordingly
        this.cardText = `
          <b>5.</b>This manual serves as a quick reference to understanding the elements of the Exam Item Analysis, including how to interpret the performance analytics and take actions based on the recommendations provided.<br>
            <ul>
              <b>4. Go Back to Classes (Page)</b> Click this link button to return to the main classes page. This allows you to exit the current exam management section and go back to the list of classes.<br>
              <li><b> 5.1 : Question Analysis Table </b> This table provides a detailed breakdown of each question in the assessment, helping instructors understand performance metrics and decide whether to retain or revise each item.</li>
                <ul>
                  <li><b>5.1.1 : Correct Selections</b> 
                    <ul>
                      <li><b>5.1.1.1 :</b> A table is displayed showing the students' answers, the correct answer, and the question, with data displayed in sets of 10 entries per page. This helps teachers or admins quickly see which question was answered correctly by the listed students.</li>
                      <li><b>5.1.1.2 :</b>These buttons allow users to navigate through multiple pages if there are many entries.</li>
                      <li><b>5.1.1.3 :  Buttons</b>
                        <ul>
                          <li><b>Cancel Button : </b>Clicking this button will close the modal without saving any changes.</li>
                          <li><b>OK Button :</b>Clicking OK will confirm any changes or simply exit the modal, saving the view state.</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li><b>5.1.2 : Incorrect Selections</b> 
                    <ul>
                      <li><b>5.1.2.1 :</b> This table lists students who answered the question incorrectly, showing their ID Number, Last Name, First Name, Middle Name, and Answer (with their incorrect choice).<br>This allows the teacher to identify students who need more support or review on the topic.</li>
                      <li><b>5.1.2.2 :</b> Use these buttons to move between pages if there are many entries.</li>
                      <li><b>5.1.2.3 :  Buttons</b>
                        <ul>
                          <li><b>Cancel Button : </b>Clicking this button will close the modal without saving any changes.</li>
                          <li><b>OK Button :</b>Clicking OK will confirm any changes or simply exit the modal, saving the view state.</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li><b>5.1.3 : Difficulty Index</b> A measure of how difficult each question is, represented as a percentage with remarks such as "Average item" or "Easy." (<i>Click  this icon for reference</i>)</li>
                  <li><b>5.1.4 : Discrimination Index</b> Measures how well each question distinguishes between high and low scorers. Higher values indicate good discrimination, with remarks like "Very Good item" or "Poor item." (<i>Click  this icon for reference</i>)</li>
                  <li><b>5.1.5 : Decision</b> Provides recommendations on whether to Retain or Revise each question based on its difficulty and discrimination indices. (<i>Click  this icon for reference</i>)</li>
                </ul>
              <li><b> 5.2 : Page Control</b> </li>
                 <ul>
                  <li> Use the <b>"Previous"</b> and <b>"Next"</b> buttons to navigate through multiple pages of questions. This is useful for assessments with many questions, allowing easy navigation without overwhelming the screen with information.</li>
                </ul>
            </ul>`;
      }else if (button === 'button6') {
        this.cardTitle = 'Student`s Feedbacks Section'; // Update this title accordingly
        this.cardText = `
          <b>6.</b>This interface is designed to help teachers view student feedback and responses for each assessment task. <br>
          Select the Feedback tab (Label 5) to view students' feedback on the specific tasks.<br><br>
            <ul>
              <li><b>Student Comments</b>
                  <ul>
                      <li><b>Student's Name</b> Each entry shows the student’s full name and their unique identifier.</li>
                      <li><b>Feedback or Comment</b> Each student’s response or feedback on the assessment task is displayed to the right of their name</li>
                  </ul>
              </li>
            </ul>`;
          }else if (button === 'button7') {
          this.cardTitle = 'Performance Tracking'; // Update this title accordingly
          this.cardText = `
          <b>7.</b>Go to the Performance Tracking section by clicking the <b>Performance Tracking button</b> on the top navigation bar. This opens the performance data for the selected class.<br>
            <ul>
              <b>2.</b>If you want to return to the main class list, click the <b>Go Back to Classes button</b> on the left. This takes you back to the list of classes you manage, without saving any data.<br>
              <li><b>7.1:  Download the Exam Results Button</b>
                  <ul>
                    <li>To download a summary of the students' results for offline use, click the Download Exam Results button on the right. This provides a file (usually in CSV or Excel format) containing all students' scores </li>
                  </ul>
              </li><br>
              <li><b>7.2:  Student Performance Table</b>
                  <ul>
                    <li>The main section of the screen shows a Student Performance Table with detailed performance data for each student. <br>Each column in this table provides specific information:<br>
                      <ul>
                        <li><b># : Serial number for easy reference.</b></li>
                        <li><b>LRN (Learner Reference Number): </b>The unique ID for each student.</li>
                        <li><b>Student Name: </b>The full name of each student.</li>
                        <li><b>Sex: </b>Gender of each student.</li>
                        <li><b>Strand: </b>The academic track or strand the student belongs to (e.g., HUMSS - 12).</li>
                        <li><b>EXAM</b>
                          <ul>
                            <li><b>Score: </b>The student's score for each task (e.g., 3/5).</li>
                            <li><b>PS (Percentage Score): </b>The student’s score as a percentage of the total possible score.</li>
                            <li><b>WS (Weighted Score): </b>The score's weight in the final grade (calculated based on task importance).</li>
                          </ul>
                        </li>
                        <li><b>Exam Statistics: </b>At the bottom of the table, view the Exam Statistics for each assessment. These statistics summarize the overall class performance for each assessment task:
                          <ul>
                            <li><b>Mean: </b>Average score for each task.</li>
                            <li><b>Median: </b>Middle score value.</li>
                            <li><b>Mode: </b>Most frequently occurring score.</li>
                            <li><b>Range: </b>Difference between the highest and lowest scores.</li>
                          </ul>
                        </li>
                        
                      </ul>
                    </li>
                    
                  </ul>
                  <li><b>7.3 : Page Control </b>(Navigate Through Pages)
                    <ul><li>If there are multiple pages of student data, use the <b>Previous</b> and <b>Next</b> buttons at the bottom of the table to go between pages.</li></ul>
                  </li>
              </li>
            </ul>`;
          }else if (button === 'button8') {
          this.cardTitle = 'Students to a Class'; // Update this title accordingly
          this.cardText = `
          <b>8.</b>Click on the Students tab to access the student management section for this class.<br>
            <ul>
              <b>2.</b>If you want to return to the main class list, click the <b>Go Back to Classes button</b> on the left. This takes you back to the list of classes you manage<br>
              <li><b>8.1: Add Students to Class</b>  Click to open the pop-up window for adding students.
                  <ul>
                      <li><b>8.1.1</b>To close the pop-up without adding students, click the <b>"X"</b> in the top-right or the Cancel button.</li>
                      <li><b>8.1.2 : Search Bar</b> In the pop-up, use the search bar to find a specific student by typing their name or ID.</li>
                      <li><b>8.1.3 : Select Students to Add</b> Use the checkboxes next to each student's information to select the students you want to add.</li>
                      <li><b>8.1.3 : Close Button</b>To close the pop-up without adding students, click the <b>"X"</b> in the top-right or the Cancel button.</li>
                      <li><b>8.1.4 : Add Selected Student</b> Click this to confirm the process.
                        <ul><li>Once you save the questions, a <b>“Success”</b> message will appear confirming that all questions were saved successfully. Click <b>OK</b> to dismiss this message.</li></ul>
                      </li>
                  </ul>
              </li>
              <li><b>8.2: Students Table</b>
                  <ul><li>The newly added students will appear in the Students table in the class page.</li></ul>
              </li>
              <li><b>8.3: Page Control</b>
                  <ul><li>Use the pagination controls to view other pages.</li></ul>
              </li>
            </ul>`;
          }else if (button === 'button9') {
          this.cardTitle = 'Approve Student Join Request'; // Update this title accordingly
          this.cardText = `
          <b>9.</b>Click on the Pending tab to view join requests from students.<br>
            <ul>
              <b>2.</b>If you want to return to the main class list, click the <b>Go Back to Classes button</b> on the left. This takes you back to the list of classes you manage<br></li>
              <li><b>9.1: Search Bar</b> Use the <b>Search by ID Number </b> field to find a specific student if needed.</li>
              <li><b>9.2: List of Students Submitted their Request</b>
                  <ul><li>In the list, locate the student you want to approve.</li></ul>
              </li>
              <li><b>9.3: Approve Button</b>
                  <ul><li>Click the Approve button next to the student's name.
                    <ul><li>A confirmation message will appear stating that the student join request was approved successfully.</li>
                        <li><b>9.3.1 : </b>Click <b>OK</b> on this confirmation to complete the approval.</li>
                    </ul>
                    </li></ul>
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
  
  .left-buttons {
    margin-left: 20px;
  }
  
  .right-buttons {
    margin-right: 20px;
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
  