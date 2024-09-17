<template>
  <div>
    <!-- Sidebar Component -->
    <div class="sidebar" :class="{ open: isOpen }">
      <div class="logo_details">
        <img :src="profileImage || require('@/assets/logowise.png')" class="icon" style="width: 70px; height: 70px; border-radius: 50%; margin: 10px;" alt="Profile Image">
        <div class="logo_name">WISE-SHS</div>
        <i class="bi" :class="isOpen ? 'bi-text-indent-right fs-1' : 'bi bi-list fs-1'" @click="toggleSidebar" id="btn"></i>
      </div>
      <ul class="nav-list">
        <li v-for="(section, sectionIndex) in menuItems" :key="sectionIndex">
          <div v-if="section.section !== 'Dashboard'">{{ section.section }}</div>
          <ul>
            <li v-for="(item, itemIndex) in section.items" :key="itemIndex">
              <a :href="item.path" @click.prevent="handleItemClick(item.path)">
                <i :class="item.icon"></i>
                <span class="link_name">{{ item.name }}</span>
              </a>
              <span class="tooltip">{{ item.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- <button class="btn btn-danger btn-sm mt-2 logOut" @click="handleLogout">Log Out</button> -->
    </div>
    
    <!-- Navbar Component -->
    <nav class="navbar navbar-expand-lg">
      <div class="d-flex align-items-center">
        <div :class="['title-container', isSidebarCollapsed ? 'collapsed' : '']">
          <h2 style="margin-left: 90px;">Student Portal</h2>
        </div>
      </div>
      <div class="d-flex align-items-center ms-auto" style="margin-right: 20px;">
        
        
        <img :src="profileImage || require('@/assets/enhs logo.jpg')" @click="togglePopover" style="width: 50px; height: 50px; border-radius: 50%;" alt="Profile Image">
        <div class="profile_content2" style="flex: 1; text-align: center;">
          <div class="names" v-if="userProfile && Object.keys(userProfile).length">Welcome {{ userProfile.lname ? `${userProfile.lname}, ${userProfile.fname} ${userProfile.mname}` : 'No Name' }}</div>
          <div class="designations" v-if="userProfile && Object.keys(userProfile).length">{{ userProfile.strand_name }} - {{ userProfile.section_name }}</div>
          <p v-else>Loading profile...</p>
        </div>
        <i class="bi bi-box-arrow-right fs-2" id="log_out" @click="handleLogout"></i>
      </div>
    </nav>

    <!-- Content Area -->
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Student_homepage',
  data() {
    return {
      isOpen: false,
      isLoggedIn: false,
      userProfile: {
        idnumber: '',
        lname: '',
        fname: '',
        mname: '',
        strand_name: '',
        sex: '',
        email: '',
        password: ''
      },
      strand_id:'',
      isPopoverVisible: false,
      // isDropdownVisible: {
      //   manageUser: false,
      //   strand: false,
      // },
      isSidebarCollapsed: false,
      selectedItem: localStorage.getItem('selectedItem') || '/sdashboard',
      menuItems: [
      { items: [
          { name: 'Dashboard', path: '/sdashboard', icon: 'bi bi-speedometer2 fs-3' },
          { name: 'Classes', path: '/saddsubject', icon: 'bi bi-file-earmark-plus-fill fs-3' }
        ] },
       
      ],
    };
  },
  created() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.fetchUserProfile();
    }
    if (this.$route.path !== this.selectedItem) {
      this.$router.push(this.selectedItem);
    }
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    },
    async fetchUserProfile() {
      try {
        const response = await axios.get('http://localhost:8000/api/userprofile', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });

        const userData = response.data.data;

        // Access and assign data directly
        this.userProfile.idnumber = userData.idnumber;
        this.userProfile.lname = userData.lname;
        this.userProfile.fname = userData.fname;
        this.userProfile.mname = userData.mname;
        this.userProfile.email = userData.email;

        // Check if the student object exists before accessing its properties
        if (userData.student) {
          this.userProfile.strand_name = userData.student.strand_name;
          this.userProfile.grade_level = userData.student.grade_level;
          this.userProfile.section_name = userData.student.section_name;
          this.userProfile.Mobile_no = userData.student.Mobile_no;
        }

      } catch (error) {
        console.log('Failed to fetch user profile:', error);
      }
    },
    async handleLogout() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:8000/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data.message);
        localStorage.removeItem('token');
        localStorage.removeItem('selectedItem');
        this.isLoggedIn = false;
        this.userProfile = {};
        this.$emit('logout');
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    togglePopover() {
      this.isPopoverVisible = !this.isPopoverVisible;
    },
    toggleDropdown(section) {
      this.isDropdownVisible[section] = !this.isDropdownVisible[section];
    },
    handleItemClick(path) {
      this.selectedItem = path;
      localStorage.setItem('selectedItem', path);
      this.$router.push(path);
    },
  },
  beforeMount() {
    this.$router.push('/sdashboard');
    this.selectedItem = '/sdashboard';
  },
};
</script>

<style scoped>


* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  min-height: 100vh;
}
.logOut{
  margin: 20px;
}
.sidebar {
  min-height: 100vh;
  width: 85px;
  padding: 6px 14px;
  z-index: 99;
  color: rgb(255, 255, 255);
  transition: all 0.5s ease;
  position: fixed;
  background-color: #0047AB;
  overflow-y: overlay;
  max-height: 100vh;
  top: 0;
  left: 0;
}
/* Sidebar and Content */


.sidebar.open {
  width: 320px; /* Width when open */
}
.profile_content2{
  font-size: 20px;
  padding-left: 10px;
  padding-right: 10px;
}

.content {
  margin-top: 20px;
  margin-left: 85px; /* Margin when sidebar is closed */
  padding: 10px;
  width: calc(100% - 85px); /* Adjust width based on sidebar state */
  transition: margin-left 0.3s ease, width 0.3s ease; /* Adjust transition duration as needed */
}

.sidebar.open ~ .content {
  margin-left: 320px; /* Margin when sidebar is open */
  width: calc(100% - 320px); /* Adjust width based on sidebar state */
}

/* Navbar Adjustments */
.navbar {
  transition: margin-left 0.3s ease, width 0.3s ease; /* Ensure navbar transitions smoothly */
}

.sidebar.open ~ .navbar {
  margin-left: 320px; /* Adjust margin based on sidebar state */
  width: calc(100% - 320px); /* Adjust width based on sidebar state */
}


.sidebar::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}
.sidebar.open {
  width: 320px; /* Width when open */
}


.sidebar.open ~ .content {
  margin-left: 320px; /* Margin when sidebar is open */
  width: calc(100% - 320px); /* Adjust width based on sidebar state */
}

/* Navbar Adjustments */
.navbar {
  transition: margin-left 0.3s ease, width 0.3s ease; /* Ensure navbar transitions smoothly */
}

.sidebar.open ~ .navbar {
  margin-left: 320px; /* Adjust margin based on sidebar state */
  width: calc(100% - 320px); /* Adjust width based on sidebar state */
}
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


.sidebar .section-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-left: 10px;
}


.sidebar.open {
  width: 320px;
}

.sidebar .logo_details {
  height: 90px;
  display: flex;
  align-items: center;
  position: relative;
}

.sidebar .logo_details .icon {
  opacity: 0;
  transition: all 0.5s ease;
}

.sidebar .logo_details .logo_name {
  color: white;
  font-size: 30px;
  font-weight: 600;
  opacity: 0;
  transition: all 0.5s ease;
}

.sidebar.open .logo_details .icon,
.sidebar.open .logo_details .logo_name {
  opacity: 1;
}

.sidebar .logo_details #btn {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  text-align: center;
  cursor: pointer;
  transition: all 0.5s ease;
}

.sidebar.open .logo_details #btn {
  text-align: right;
}

.sidebar i {
  color: white;
  height: 60px;
  line-height: 60px;
  min-width: 50px;
  font-size: 25px;
  text-align: center;
}

.sidebar .nav-list {
  margin-top: 20px;
  height: 100%;
}

.sidebar li {
  position: relative;
  margin: 8px 0;
  list-style: none;
}

.sidebar li .tooltip {
  position: absolute;
  top: -20px;
  left: calc(100% + 15px);
  z-index: 3;
  background-color: white;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  padding: 6px 14px;
  font-size: 17px;
  font-weight: 400;
  border-radius: 5px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
}

.sidebar li:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
  transition: all 0.4s ease;
  top: 50%;
  transform: translateY(-50%);
}

.sidebar.open li .tooltip {
  display: none;
}



.sidebar li a {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  text-decoration: none;
  position: relative;
  padding-top: 10px;
  transition: all 0.5s ease;
  z-index: 12;
}

.sidebar li a::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  transform: scaleX(0);
  background-color: white;
  border-radius: 5px;
  transition: transform 0.3s ease-in-out;
  transform-origin: left;
  z-index: -2;
}

.sidebar li a:hover::after {
  transform: scaleX(1);
  color: beige;
}

.sidebar li a .link_name {
  color: white;
  font-size: 17px;
  font-weight: 400;
  white-space: nowrap;
  pointer-events: auto;
  margin-top: 10px;
  transition: all 0.4s ease;
  pointer-events: none;
  opacity: 0;
}

.sidebar li a:hover .link_name,
.sidebar li a:hover i {
  transition: all 0.5s ease;
  color: #000000;
}

.sidebar.open li a .link_name {
  opacity: 1;
  pointer-events: auto;
}

.sidebar li i {
  height: 35px;
  line-height: 35px;
  font-size: 18px;
  border-radius: 5px;
}

.sidebar li.profile {
  position: fixed;
  height: 90px;
  width: 78px;
  left: 0;
  bottom: -8px;
  padding: 10px 14px;
  overflow: hidden;
  transition: all 0.5s ease;
}

.sidebar.open li.profile {
  width: 250px;
}

.sidebar .profile .profile_details {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  height: 70px;
  padding: 20px;
}

.sidebar li img {
  height: 45px;
  width: 45px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
}

.sidebar li.profile .name,
.sidebar li.profile .designation {
  font-size: 15px;
  font-weight: 400;
  color:white;
  white-space: nowrap;
}

.sidebar li.profile .designation {
  font-size: 12px;
}

.sidebar .profile #log_out {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background-color: #0071c5;
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-radius: 5px;
  text-align: center;
  transition: all 0.5s ease;
}

.sidebar.open .profile #log_out {
  width: 50px;
  background-color: transparent;
  border-radius: 50%;
  height: 35px;
  line-height: 35px;
}
.dropdown-icon {
  margin-left: auto;
  font-size: 1.2rem;
}

/* Adjust the dropdown items visibility */
.nav-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list ul li {
  margin: 5px 0;
}

.nav-list ul li a {
  display: flex;
  align-items: center;
  padding: 10px;
  text-decoration: none;
  color: white;
}

.nav-list ul li a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-list .items {
  cursor: pointer;
  padding: 10px;
  color: white;
}

.nav-list .section-title:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
