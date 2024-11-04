<template >
  <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
  <div class="carousel-item active" data-bs-interval="10000">
    <img src="/admin/Slide1.JPG" class="carouselimage" alt="Slide 1">
  </div>
  <div class="carousel-item" data-bs-interval="2000">
    <img src="/admin/Slide2.JPG" class="carouselimage" alt="Slide 2">
  </div>
  <div class="carousel-item" data-bs-interval="10000">
    <img src="/admin/Slide3.JPG" class="carouselimage" alt="Slide 3">
  </div>
  <div class="carousel-item" data-bs-interval="2000">
    <img src="/admin/Slide4.JPG" class="carouselimage" alt="Slide 4">
  </div>
  <div class="carousel-item" data-bs-interval="10000">
    <img src="/admin/Slide5.JPG" class="carouselimage" alt="Slide 5">
  </div>
  <div class="carousel-item" data-bs-interval="2000">
    <img src="/admin/Slide6.JPG" class="carouselimage" alt="Slide 6">
  </div>
  <div class="carousel-item" data-bs-interval="10000">
    <img src="/admin/Slide5.JPG" class="carouselimage" alt="Slide 5">
  </div>
  <div class="carousel-item" data-bs-interval="2000">
    <img src="/admin/Slide6.JPG" class="carouselimage" alt="Slide 6">
  </div>
  <div class="carousel-item" data-bs-interval="10000">
    <img src="/admin/Slide5.JPG" class="carouselimage" alt="Slide 5">
  </div>
  <div class="carousel-item" data-bs-interval="2000">
    <img src="/admin/Slide7.JPG" class="carouselimage" alt="Slide 7">
  </div>
  <div class="carousel-item" data-bs-interval="10000">
    <img src="/admin/Slide8.JPG" class="carouselimage" alt="Slide 8">
  </div>
  <div class="carousel-item" data-bs-interval="2000">
    <img src="/admin/Slide9.JPG" class="carouselimage" alt="Slide 9">
  </div>
  <div class="carousel-item" data-bs-interval="10000">
    <img src="/admin/Slide10.JPG" class="carouselimage" alt="Slide 10">
  </div>
  <div class="carousel-item" data-bs-interval="2000">
    <img src="/admin/Slide11.JPG" class="carouselimage" alt="Slide 11">
  </div>
  <div class="carousel-item" data-bs-interval="10000">
    <img src="/admin/Slide12.JPG" class="carouselimage" alt="Slide 12">
  </div>
  <div class="carousel-item" data-bs-interval="2000">
    <img src="/admin/Slide13.JPG" class="carouselimage" alt="Slide 13">
  </div>
  <div class="carousel-item" data-bs-interval="2000">
    <img src="/admin/Slide14.JPG" class="carouselimage" alt="Slide 14">
  </div>
  <div class="carousel-item" data-bs-interval="10000">
    <img src="/admin/Slide15.JPG" class="carouselimage" alt="Slide 15">
  </div>
  <div class="carousel-item" data-bs-interval="2000">
    <img src="/admin/Slide16.JPG" class="carouselimage" alt="Slide 16">
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
        <button class="btn btnmanual" @click="showCard('button1')">1-5. Log In</button>
        <button class="btn btnmanual" @click="showCard('button2')">6. Drawer</button>
        <button class="btn btnmanual" @click="showCard('button3')">7. Dashboard</button>
        <button class="btn btnmanual" @click="showCard('button4')">8. Manage School Year </button>
        <button class="btn btnmanual" @click="showCard('button5')">9. Manage Strand</button>
        <button class="btn btnmanual" @click="showCard('button6')">10. Manage Sections</button>
        <button class="btn btnmanual" @click="showCard('button7')">11. Manage Subjects</button>
      </div>

      <div class="right-buttons">
        <button class="btn btnmanual" @click="showCard('button8')">12. Manage Strand Curriculum</button>
        <button class="btn btnmanual" @click="showCard('button9')">13. Manage Position</button>
        <button class="btn btnmanual" @click="showCard('button10')">14. Manage All Users </button>
        <button class="btn btnmanual" @click="showCard('button11')">15. Manage Student's Account</button>
        <button class="btn btnmanual" @click="showCard('button12')">16. Manage Teacher's Account</button>
        <button class="btn btnmanual" @click="showCard('button13')">17. Generate List of Student's PDF Report</button>
        <button class="btn btnmanual" @click="showCard('button14')">18. Generate List of Teacher's PDF Report</button>
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
  name: 'AdminManualPage',
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
      this.cardTitle = 'Admin Login Instructions';
      this.cardText = `
        <b>1.</b> The admin should enter their ID number as the username.<br>
        <b>2.</b> The admin should enter their password.<br>
        <b>3.</b> Click this icon to show or hide the password to verify if it is correct.<br>
        <b>4.</b> A friendly pop-up reminder will inform users that if anyone forgets their password, they should notify the admin.<br>
        <b>5.</b> The Sign In button is clicked to check if the username and password match the admin account, and if they do, the user will be directed to the admin homepage.
      `;
    } else if (button === 'button2') {
      this.cardTitle = 'Drawer'; // Update this title accordingly
      this.cardText = `
        <b>6.</b> This icon represents the drawer, which encompasses various functionalities and attributes relevant to the entire system. It includes buttons that route users to different pages, facilitating seamless navigation throughout the application. Each functionality is designed to enhance user experience and streamline access to essential features. The open UI drawer is presented on Slide 3, while the close drawer functionality is featured on Slide 2. <br>
        <ul>
            <li><b> Click buuton # 7</b> to acces the dashboard</li>
            <li><b> Click buuton # 8</b> to acces the manage school year section</li>
            <li><b> Click buuton # 9</b> to acces the manage strand section</li>
            <li><b> Click buuton # 10</b> to acces the manage studengts section</li>
            <li><b> Click buuton # 11</b> to acces the manage subject section</li>
            <li><b> Click buuton # 12</b> to acces the manage curriculum section</li>
            <li><b> Click buuton # 13</b> to acces the manage teachers position section</li>
            <li><b> Click buuton # 14</b> to acces the manage all users section</li>
            <li><b> Click buuton # 15</b> to acces the manage students section</li>
            <li><b> Click buuton # 16</b> to acces the manage teachers section</li>
            <li><b> Click buuton # 17</b> to acces the list of students and to generate reports</li>
            <li><b> Click buuton # 18</b> to acces the list of teachers and to generate reports</li>
        </ul>
      `;
    }else if (button === 'button3') {
      this.cardTitle = 'Dashboard'; // Update this title accordingly
      this.cardText = `
        <b>7.</b> A dashboard is a visual interface that consolidates and displays key information and metrics in a concise, easily digestible format. It typically serves as a centralized location for monitoring performance, tracking progress, and analyzing data across various domains. <br>
        <ul>
            <li><b> 7.1</b> This card displays the total number of teachers, and when clicked, it will directly go to button 16.</li>
            <li><b> 7.2</b> Display the total number of students, and when clicked, it will directly go to button 15</li>
            <li><b> 7.3</b> Display the total number of sections, and when clicked, it will directly go to button 10</li>
            <li><b> 7.4</b> Display the total number of subjects, and when clicked, it will directly go to button 11</li>
            <li><b> 7.5</b> Click to <b>Logout</b> </li><br>
            <p> Graphical Representation</p>
            <li><b> 7.6</b> Gender distribution of teachers</li>
            <li><b> 7.7</b> Gender distribution of students</li>
            <li><b> 7.8</b> Gender distribution of students per strand level</li>
            <li><b> 7.9</b> Total number of students per strand</li>
        </ul>
      `;
    }else if (button === 'button4') {
      this.cardTitle = 'Manage School Year'; // Update this title accordingly
      this.cardText = `
        <b>8.</b>This section outlines the functionalities of a school management system, detailing key operations related to school years.<br>
          <ul>
            <li><b> 8.1 : Search Bar </b> allows you to type a year, and it filters in the 8.5 to see if the data you searched for has already been recorded.</li>
            <li><b> 8.2 : Add School Year Button </b> </li>
              <ul>
                <li><b>8.2.1</b> Input a school year.</li>
                <li><b>8.2.2</b> Click if you want to set this as the active school year.</li>
                <li><b>8.2.3</b> Click this <b>Save button</b> to submit your response, which will be validated by the system.</li>
                <li><b>8.2.4</b> Click this <b>Cancel button</b> to ignore the process.</li>
              </ul>
            <li><b> 8.3 : Edit Button</b> </li>
               <ul>
                <li><b>8.3.1</b> Input/update the a school year.</li>
                <li><b>8.3.2</b> Click if you want to update this as the active/inactive school year.</li>
                <li><b>8.3.3</b> Click this <b>Save button</b> to submit your response, which will be validated by the system.</li>
                <li><b>8.3.4</b> Click this <b>Cancel button</b> to ignore the process.</li>
              </ul>
            <li><b> 8.4 : Delete Button</b> </li>
              <ul>
                <li><b>8.4.1</b> Click this <b>Yes, delete it button</b> to submit your response, agreeing that you want to delete this.</li>
                <li><b>8.4.2</b> Click this <b>Cancel button</b> to ignore the process.</li>
              </ul>
            <li><b> 8.5</b> Diplay the data</li><br>
        </ul>`;
    }else if (button === 'button5') {
      this.cardTitle = 'Manage Strand Sections'; // Update this title accordingly
      this.cardText = `
        <b>9.</b>This section outlines the functionalities of a school management system, detailing key operations related to school years.<br>
          <ul>
            <li><b> 9.1 : Search Bar </b> allows you to type a strand, and it filters in the 9.5 to see if the data you searched for has already been recorded.</li>
            <li><b> 9.2 : Add Strand Button </b> </li>
              <ul>
                <li><b>9.2.1</b> Click to close the modal</li>
                <li><b>9.2.2</b> Input a strand.</li>
                <li><b>9.2.3</b> Input the <b>grade level </b> of the strand in 9.2.2</li>
                <li><b>9.3.3</b> Click this <b>Save button</b> to submit your response, which will be validated by the system.</li>
                <li><b>9.2.5</b> Click this <b>Cancel button</b> to ignore the process.</li>
              </ul>
            <li><b> 9.3 : Edit Button</b> </li>
               <ul>
                <li><b>9.3.1</b> Click to close the modal</li>
                <li><b>9.3.3</b> Input/update the a strand.</li>
                <li><b>9.3.3</b> Input/update the a gradelevel of the strand.</li>
                <li><b>9.3.4</b> Click this <b>Update button</b> to update your response, which will be validated by the system.</li>
                <li><b>9.3.5</b> Click this <b>Cancel button</b> to ignore the process.</li>
              </ul>
            <li><b> 9.4 : Delete Button</b> </li>
              <ul>
                <li><b>9.4.1</b> Click this <b>Yes, delete it button</b> to confirm the deletion of a strand.</li>
                <li><b>9.4.2</b> Click this <b>Cancel button</b> to ignore the process.</li>
              </ul>
            <li><b> 9.5</b> This feature presents the existing data related to the strands. </li><br>
        </ul>`;
    }else if (button === 'button6') {
      this.cardTitle = 'Manage Students Sections'; // Update this title accordingly
      this.cardText = `
        <b>10.</b>This section outlines the functionalities of a school management system, detailing key operations related to student's sections.<br>
          <ul>
            <li><b>10.1: Search Bar</b> allows you to type a student's section, and it filters in 10.5 to see if the data you searched for has already been inputted.</li>
            <li><b>10.2: Add Section Button</b>
                <ul>
                    <li><b>10.2.1</b> Click to close the modal.</li>
                    <li><b>10.2.2</b> Input a strand section.</li>
                    <li><b>10.2.3</b> Select the <b>strand grade level</b> of the section in 10.2.2.</li>
                    <li><b>10.2.4</b> Click this <b>Save button</b> to submit your response, which will be validated by the system.</li>
                    <li><b>10.2.5</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>

            <li><b>10.3:</b> This feature presents the existing data related to the strand sections.</li>

            <li><b>10.4: Edit Button</b>
                <ul>
                    <li><b>10.4.1</b> Click to close the modal.</li>
                    <li><b>10.4.2</b> Input/update a strand section.</li>
                    <li><b>10.4.3</b> Select the updated strand level.</li>
                    <li><b>10.4.4</b> Click this <b>Update button</b> to update your response, which will be validated by the system.</li>
                    <li><b>10.4.5</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>

            <li><b>10.5: Delete Button</b>
                <ul>
                  <li><b>10.5.1</b> Click this <b>Yes, delete it button</b> to confirm the deletion of a strand.</li>
                  <li><b>10.5.2</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>
          </ul>`;
        }else if (button === 'button7') {
        this.cardTitle = 'Manage Subjects'; // Update this title accordingly
        this.cardText = `
        <b>11.</b>This section outlines the functionalities of a subject management section, detailing key operations related to subjects.<br>
          <ul>
            <li><b>11.1: Search Bar</b> allows you to type a student's section, and it filters in 11.3 to see if the data you searched for has already been recorded.</li>
            <li><b>11.2: Add Subject Button</b>
                <ul>
                    <li><b>11.2.1</b> Click to close the modal.</li>
                    <li><b>11.2.2</b> Input a new subject.</li>
                    <li><b>11.2.3</b> Click this <b>Save button</b> to submit your response, which will be validated by the system.</li>
                    <li><b>11.2.4</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>

            <li><b>11.3:</b> This feature presents the existing data related to the subjects.</li>

            <li><b>11.4: Edit Button</b>
                <ul>
                    <li><b>11.4.1</b> Click to close the modal.</li>
                    <li><b>11.4.2</b> Input or update the subject.</li>
                    <li><b>11.4.3</b> Click this <b>Update button</b> to update your response, which will be validated by the system.</li>
                    <li><b>11.4.4</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>

            <li><b>11.5: Delete Button</b>
                <ul>
                  <li><b>11.5.1</b> Click this <b>Yes, delete it button</b> to confirm the deletion of a strand.</li>
                  <li><b>11.5.2</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>
          </ul>`;
        }else if (button === 'button8') {
        this.cardTitle = 'Manage Strand Curriculum'; // Update this title accordingly
        this.cardText = `
        <b>12.</b>This section outlines the functionalities of a strand curriculum management section, detailing key operations related to managing the strand curriculum.<br>
          <ul>
            <li><b>12.1: Search Bar</b> allows you to type a specific subject, and it filters in 12.4 to see if the data you searched for has already been recorded.</li>
            <li><b>12.2: Semester Dropdown</b> Select a semester from the dropdown, and the system will filter the subjects registered for the selected semester.</li>
            <li><b>12.3: Add Strand Curriculum Button</b>
                <ul>
                    <li><b>12.3.1</b> Select a new strand level.</li>
                    <li><b>12.3.2</b> Select as many subjects as needed to register to the strand level. You can search for subjects to make selection easier.</li>
                    <li><b>12.3.3</b> Select a new semester.</li>
                    <li><b>12.3.4</b> Click this <b>Save button</b> to submit your response, which will be validated by the system.</li>
                    <li><b>12.3.5</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>

            <li><b>12.4:</b> This feature presents the existing data related to the subjects.</li>
            <li><b>12.5: Delete Button</b>
                <ul>
                  <li><b>12.5.1</b> Click this <b>Yes, delete it button</b> to confirm the deletion of a strand.</li>
                  <li><b>12.5.2</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>
          </ul>`;
        }else if (button === 'button9') {
        this.cardTitle = 'Manage Teacher`s Position'; // Update this title accordingly
        this.cardText = `
        <b>13.</b>This section outlines the functionalities of a teacher's pposition management section, detailing key operations related to this section.<br>
          <ul>
            <li><b>13.1: Search Bar</b> allows you to type a teacher's section, and it filters in 13.3 to see if the data you searched for has already been recorded.</li>
            <li><b>13.2: Add Subject Button</b>
                <ul>
                    <li><b>13.2.1</b> Click to close the modal.</li>
                    <li><b>13.2.2</b> Input a new teacher's position.</li>
                    <li><b>13.2.3</b> Click this <b>Save button</b> to submit your response, which will be validated by the system.</li>
                    <li><b>13.2.4</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>

            <li><b>13.3:</b> This feature presents the existing data related to the subjects.</li>

            <li><b>13.4: Edit Button</b>
                <ul>
                    <li><b>13.4.1</b> Click to close the modal.</li>
                    <li><b>13.4.2</b> Input or update the teacher's position.</li>
                    <li><b>13.4.3</b> Click this <b>Update button</b> to update your response, which will be validated by the system.</li>
                    <li><b>13.4.4</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>

            <li><b>13.5: Delete Button</b>
                <ul>
                  <li><b>13.5.1</b> Click this <b>Yes, delete it button</b> to confirm the deletion of a strand.</li>
                  <li><b>13.5.2</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>
          </ul>`;
        }else if (button === 'button10') {
        this.cardTitle = 'Manage All Users'; // Update this title accordingly
        this.cardText = `
        <b>14.</b>This section outlines the functionalities of a manage all users section, detailing key operations related to this section.<br>
          <ul>
            <li><b>14.1: Search Bar</b> allows you to type a users name, and it filters in 14.3 to see if the data you searched for has already been recorded.</li>
            <li><b>14.2: User type Filter Dropdown</b>
                <ul>
                    <li>Allows filtering users by type (e.g., student, teacher, admin).Select the desired user type from the dropdown menu to filter the list accordingly.</li>
                    
                </ul>
            </li>

            <li><b>14.3:</b> This feature presents the existing data related to the all users.</li>

            <li><b>14.4: Gender Summary</b>
                <ul>
                    <li>Displays a count of male and female users.Symbols and text (e.g., "Male : 6", "Female : 4") indicate the number of users by gender.</li>
                    
                </ul>
            </li>

            <li><b>14.5: Pagination Controls</b>
                <ul>
                  <li>Provides navigation through multiple pages of user.</li>
                </ul>
            </li>
          </ul>`;
        }else if (button === 'button11') {
        this.cardTitle = 'Manage Student`s Accounts'; // Update this title accordingly
        this.cardText = `
        <b>15.</b>This interface enables administrators to manage student records by adding, editing, deleting, or importing data, with options to filter and search records for easy navigation.<br>
          <ul>
            <li><b>15.1: </b>This feature presents the existing data related to managing students account.</li>
            <li><b>15.2: Search Bar</b>
                <ul>
                    <li>Allows searching for a specific student by name, LRN, or other identifiable information</li>
                </ul>
            </li>

            <li><b>15.3: Filter by Gender and Strand</b> 
              <ul>
                    <li><b>Filter by Gender: </b> Filter students by gender (e.g., male, female).</li>
                    <li><b>All Strands : </b>Filter students by strand (e.g., HUMSS, TVL-ICT). Select the desired strand from the dropdown menu to narrow down the list.</li>
                </ul>
            </li>

            <li><b>15.4: Import Excel</b>
                <ul>
                    <li><b>15.4.1</b> Close button for the "Import Excel File" pop-up.</li>
                    <li><b>15.4.2 Choose File Button : </b> click to select an Excel file from your device.</li>
                    <li><b>15.4.3 Upload Button : </b> Click to add the selected Excel file to the system.</li>
                    <li><b>15.4.4</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>

            <li><b>15.5: Add Record Button</b>
                <ul>
                  <li><b>15.5.1 ID Number : </b> Field for entering the student’s unique ID or LRN (Learner Reference Number).</li>
                  <li><b>15.5.2 Last Name : </b> Field for entering the student’s last name.</li>
                  <li><b>15.5.3 First Name : </b> Field for entering the student’s first name.</li>
                  <li><b>15.5.4 Middle Name : </b> Field for entering the student’s middle name (optional).</li>
                  <li><b>15.5.5 Gender : </b> Radio buttons to select the student’s gender: Male or Female.</li>
                  <li><b>15.5.6 4Ps membership : </b>Radio buttons to indicate if the student is a member of the 4Ps program (a government support program): Yes or No. </li>
                  <li><b>15.5.7 Strand : </b> Dropdown menu to select the student's educational strand (e.g., HUMSS, TVL-ICT).</li>
                  <li><b>15.5.8 Section : </b> Dropdown menu to select the student’s section based on their strand.</li>
                  <li><b>15.5.9 Password : </b> Field for setting a password for the student’s account.</li>
                  <li><b>15.5.10 Password Visibility Toggle : </b> Icon to toggle visibility of the password entered in the field.</li>
                  <li><b>15.5.11 Save Record Button : </b> Button to save the new student’s record. This will proceed to the "User Details" confirmation pop-up.</li>
                  <li><b>15.5.12 Cancel Button (User Details Confirmation) : </b> Button to cancel the registration process and close the confirmation pop-up.</li>
                  <li><b>15.5.13 Register Now Button (User Details Confirmation) : </b> Button to confirm and finalize the registration of the student. After clicking, a success message will appear.</li>
                  <li><b>15.5.14 Registration Successful Confirmation : </b> Pop-up indicating that the student was successfully registered. Click "OK" to close this confirmation message.</li>
                </ul>
            </li>
            <li><b>15.6: Reset Password Button</b>
                <ul>
                  <li><b>15.6.1  </b> Close button to exit the pop-up.</li>
                  <li><b>15.6.2 New Password : </b> field for entering a new password. It can be generated automatically by the system or manually inputted</li>
                  <li><b>15.6.3  Generate Button : </b> Click to generate a new password automatically.</li>
                  <li><b>15.6.4 Confirm New Password : </b>  field for confirming the new password.</li>
                  <li><b>15.6.5 Reset Password Button : </b> Click to save the new password.</li>
                </ul>
            </li>
            <li><b>15.7: Edit Button</b>
                <ul>
                  <li><b>15.7.1  </b> Close button to exit the pop-up</li>
                  <li><b>15.7.2  </b> Enter the new id number </li>
                  <li><b>15.7.3  </b> Select the new status </li>
                  <li><b>15.7.4  </b> Input the updated student's last name</li>
                  <li><b>15.7.5  </b> Input the updated student's first name</li>
                  <li><b>15.7.6  </b> Input the updated student's middle name</li>
                  <li><b>15.7.7  </b> Select the new gender (if only)</li>
                  <li><b>15.7.8  </b> Select the new strand</li>
                  <li><b>15.7.9  </b> Select the new section.</li>
                  <li><b>15.7.10 Save changes : </b>  button to save the edited details.</li>
                  <li><b>15.7.11 </b> Close button to discard changes and close the pop-up.</li>
                </ul>
            </li>
            <li><b>15.8: Gender Summary</b>
                <ul>
                  <li>Shows a count of male and female students in the list (e.g., "Male: 6", "Female: 4").</li>
                </ul>
            </li>
            <li><b>15.9: Pagination Control</b>
                <ul>
                  <li>Used for navigating through multiple pages of student records.</li>
                </ul>
            </li>
          </ul>`;
        }else if (button === 'button12') {
        this.cardTitle = 'Manage Teacher`s Accounts'; // Update this title accordingly
        this.cardText = `
        <b>16.</b>This interface enables administrators to manage student records by adding, editing, deleting, or importing data, with options to filter and search records for easy navigation.<br>
          <ul>
            <li><b>16.1: Search Bar</b>
                <ul>
                    <li>Allows searching for a specific teacher's by name, employee number, or other identifiable information</li>
                </ul>
            </li>

            <li><b>16.2: Filter by Gender and Strand</b> 
              <ul>
                    <li><b>Filter by Gender: </b> Filter teacher's by gender (e.g., male, female).</li>
                </ul>
            </li>

            <li><b>16.3: Import Excel</b>
                <ul>
                    <li><b>16.3.1</b> Close button for the "Import Excel File" pop-up.</li>
                    <li><b>16.3.2 Choose File Button : </b> click to select an Excel file from your device.</li>
                    <li><b>16.3.3 Upload Button : </b> Click to add the selected Excel file to the system.</li>
                    <li><b>16.3.4</b> Click this <b>Cancel button</b> to ignore the process.</li>
                </ul>
            </li>

            <li><b>16.4: Add Record Button</b>
                <ul>
                  <li><b>16.4.1 Employee Number : </b> Input field for entering the teacher's unique employee number.</li>
                  <li><b>16.4.2 Last Name : </b> Field for entering the teacher’s last name.</li>
                  <li><b>16.4.3 First Name : </b> Field for entering the teacher’s first name.</li>
                  <li><b>16.4.4 Middle Name : </b> Field for entering the teacher’s middle name (optional).</li>
                  <li><b>16.4.5 Gender : </b> Radio buttons to select the teacher’s gender: Male or Female.</li>
                  <li><b>16.4.6 Password : </b> Field for setting a password for the teacher’s account.</li>
                  <li><b>16.4.7 Password Visibility Toggle : </b> Icon to toggle visibility of the password entered in the field.</li>
                  <li><b>16.4.8 Position : </b> Drop-down menu to select the teacher’s position (e.g., Teacher I, Teacher II, etc.).</li>
                  <li><b>16.4.9 Strand : </b> Drop-down menu to select the strand the teacher is associated with, if applicable.</li>
                  <li><b>16.4.10 Save Record Button : </b> Button to save the new teacher’s record. This will proceed to the "User Details" confirmation pop-up.</li>
                  <li><b>16.4.11 Cancel Button (User Details Confirmation) : </b> Button to cancel the registration process and close the confirmation pop-up.</li>
                  <li><b>16.4.12 Register Now Button (User Details Confirmation) : </b> Button to confirm and finalize the registration of the teacher. After clicking, a success message will appear.</li>
                  <li><b>16.4.13 Registration Successful Confirmation : </b> Pop-up indicating that the teacher was successfully registered. Click "OK" to close this confirmation message.</li>
                </ul>
            </li>
            <li><b>16.5: Filter by Position </b> 
              <ul>
                    <li>Drop-down menus to filter the teacher list by  position.</li>
                </ul>
            </li>
            <li><b>16.6: Reset Password Button</b>
                <ul>
                  <li><b>16.6.1  </b> Close button to exit the pop-up.</li>
                  <li><b>16.6.2 New Password : </b> field for entering a new password. It can be generated automatically by the system or manually inputted</li>
                  <li><b>16.6.3  Generate Button : </b> Click to generate a new password automatically.</li>
                  <li><b>16.6.4 Confirm New Password : </b>  field for confirming the new password.</li>
                  <li><b>16.6.5 Reset Password Button : </b> Click to save the new password.</li>
                </ul>
            </li>
            <li><b>16.7: Edit Button</b>
                <ul>
                  <li><b>16.7.1  </b> Close button to exit the pop-up</li>
                  <li><b>16.7.2  </b> Enter the new/ updated employee number </li>
                  <li><b>16.7.3  </b> Input the updated teacher's last name</li>
                  <li><b>16.7.4  </b> Input the updated teacher's first name</li>
                  <li><b>16.7.5  </b> Input the updated teacher's middle name</li>
                  <li><b>16.7.6  </b> Select the new gender (if only)</li>
                  <li><b>16.7.7  </b> Select the new position</li>
                  <li><b>16.7.8 Save changes : </b>  button to save the edited details.</li>
                  <li><b>16.7.9 </b> Close button to discard changes and close the pop-up.</li>
                </ul>
            </li>
            <li><b>16.8: Gender Summary</b>
                <ul>
                  <li>Shows a count of male and female teacher's in the list (e.g., "Male: 6", "Female: 4").</li>
                </ul>
            </li>
            <li><b>16.9: Pagination Control</b>
                <ul>
                  <li>Used for navigating through multiple pages of teacher's records.</li>
                </ul>
            </li>
            <li><b>16.10: </b>This feature presents the existing data related to managing teacher's account.</li>
          </ul>`;
        }else if (button === 'button13') {
        this.cardTitle = 'Generate Report of Student Users'; // Update this title accordingly
        this.cardText = `
        <b>17.</b>This section outlines the functionalities when it comes to generating report on the list of student's , detailing key operations related to this section.<br>
          <ul>
            <li><b>17.1: Gender Filter Dropdown</b> Drop-down menu to filter students by gender.</li>
            <li><b>17.2: Strand Filter Dropdown</b>
                <ul>
                    <li>Drop-down menu to filter students by strand (e.g., HUMSS, TVL-ICT, etc.).</li>
                    
                </ul>
            </li>
            <li><b>17.3: Section Filter Dropdown</b>
                <ul>
                    <li>Drop-down menu to filter students by section.</li>
                    
                </ul>
            </li>
            <li><b>17.4:</b> This feature presents the existing data related to the list of student users.</li>

            <li><b>17.5: Gender Summary</b>
                <ul>
                    <li>Displays a count of male and female users.Symbols and text (e.g., "Male : 6", "Female : 4") indicate the number of student users by gender.</li>
                    
                </ul>
            </li>

            <li><b>17.6: Pagination Controls</b>
                <ul>
                  <li>Provides navigation through multiple pages of user.</li>
                </ul>
            </li>
            <li><b>17.7: Generate Report Button</b>
                <ul>
                  <li>Click this button to generate a pdf format report based on the filtered student list.</li>
                </ul>
            </li>
          </ul>`;
        }else if (button === 'button14') {
        this.cardTitle = 'Generate Report of Teacher`s Users'; // Update this title accordingly
        this.cardText = `
        <b>18.</b>This section outlines the functionalities when it comes to generating report on the list of teacher's , detailing key operations related to this section.<br>
          <ul>
            <li><b>18.1: Gender Filter Dropdown</b> Drop-down menu to filter teachers by gender.</li>
            <li><b>18.2: Position Filter Dropdown</b>
                <ul>
                    <li>Drop-down menu to filter teacher by position (e.g., Teacher I, Teacher II, etc.).</li>
                    
                </ul>
            </li>
           
            <li><b>18.3:</b> This feature presents the existing data related to the list of teacher users.</li>

            <li><b>18.4: Gender Summary</b>
                <ul>
                    <li>Displays a count of male and female users.Symbols and text (e.g., "Male : 6", "Female : 4") indicate the number of teacher users by gender.</li>
                    
                </ul>
            </li>

            <li><b>18.5: Pagination Controls</b>
                <ul>
                  <li>Provides navigation through multiple pages of user.</li>
                </ul>
            </li>
            <li><b>18.6: Generate Report Button</b>
                <ul>
                  <li>Click this button to generate a pdf format report based on the filtered teacher list.</li>
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
  gap: 15px;
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
.btn {
  width: 200px;
  height: 52px;
  font-size: 15px;
  text-align: start;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.btnmanual{
  background-color: #c1c1c1d7;
  border: 2px solid #fafdff; 
}
</style>
