<template>
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
        <button class="btn btn-secondary" @click="showCard('button1')">1-5. Log In</button>
        <button class="btn btn-secondary" @click="showCard('button2')">6. Drawer</button>
        <button class="btn btn-secondary" @click="showCard('button3')">7. Dashboard</button>
        <button class="btn btn-secondary" @click="showCard('button4')">8. Manage School Year </button>
        <button class="btn btn-secondary" @click="showCard('button5')">Button 5</button>
        <button class="btn btn-secondary" @click="showCard('button6')">Button 6</button>
      </div>

      <div class="right-buttons">
        <button class="btn btn-secondary" @click="showCard('button7')">Button 7</button>
        <button class="btn btn-secondary" @click="showCard('button8')">Button 8</button>
        <button class="btn btn-secondary" @click="showCard('button9')">Button 9</button>
        <button class="btn btn-secondary" @click="showCard('button10')">Button 10</button>
        <button class="btn btn-secondary" @click="showCard('button11')">Button 11</button>
        <button class="btn btn-secondary" @click="showCard('button12')">Button 12</button>
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
            <li><b> 7.2</b> to acces the manage school year section</li>
            <li><b> 7.3</b> to acces the manage strand section</li>
            <li><b> 7.4</b> to acces the manage studengts section</li>
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
  gap: 10px;
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
  height: 40px;
  font-size: 15px;
  text-align: start;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
