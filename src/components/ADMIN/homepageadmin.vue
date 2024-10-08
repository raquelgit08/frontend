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
          <h2 >Echague National High School</h2>
          <p style="font-size: 12px; color: #888;">SAN FABIAN, ECHAGUE, ISABELA</p>
        </div>
      </div>
      <div class="d-flex align-items-center ms-auto" style="margin-right: 20px;">
        
        
        <img :src="profileImage || require('@/assets/enhs logo.jpg')" @click="togglePopover" style="width: 50px; height: 50px; border-radius: 50%;" alt="Profile Image">
        <div class="profile_content2" style="flex: 1; text-align: center;">
          <!-- <div class="names" v-if="userProfile && Object.keys(userProfile).length">{{ userProfile.lname ? `${userProfile.lname}, ${userProfile.fname} ${userProfile.mname}` : 'No Name' }}</div> -->
          <div class="designations" v-if="userProfile && Object.keys(userProfile).length">Welcome Admin</div>
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
import Swal from 'sweetalert2';
import config from '@/config';

export default {
  name: 'HomePageAdmin',
  data() {
    return {
      isOpen: false,
      isLoggedIn: false,
      userProfile: {}, // Initialize with empty object
      isPopoverVisible: false,
      isDropdownVisible: {
        manageUser: false,
        strand: false,
      },
      isSidebarCollapsed: false,
      selectedItem: localStorage.getItem('selectedItem') || '/adashboard',
      menuItems: [
      { items: [
          { name: 'Dashboard', path: '/adashboard', icon: 'bi bi-speedometer2 fs-3' }
        ] },
        { section: 'Set Up', items: [
          { name: 'Manage School Year', path: '/ASchoolYear', icon: 'bi bi-calendar-month-fill fs-3' },
          { name: 'Manage Strand', path: '/ManageStrandsinSHS', icon: 'bi-book-half fs-3' },
          { name: 'Manage Section', path: '/ASection', icon: 'bi bi-folder2-open fs-3' },
          { name: 'Manage Subjects', path: '/AManageSubject', icon: 'bi bi-file-earmark-text-fill fs-3' },
         { name: 'Manage Curriculum', path: '/ManageCuricculuminSHS', icon: 'bi bi-grid-fill fs-3' },
          { name: 'Manage Position', path: '/AManagePosition', icon: 'bi bi-file-person fs-3' }
        ] },
        { section: 'Manage Users', items: [
          { name: 'Manage All Users', path: '/allusers', icon: 'bi bi-person-check-fill fs-3' },
          { name: 'Manage Students', path: '/manage_students', icon: 'bi bi-person-fill fs-3' },
          { name: 'Manage Teachers', path: '/manage_teachers', icon: 'bi bi-person-bounding-box fs-3' },
    
        ] },
        { section: 'Reports', items: [
          { name: 'List of Student', path: '/ReportListofStudent', icon: 'bi bi-person-fill fs-3' },
          { name: 'List of Teacher', path: '/ReportListofTeacher', icon: 'bi bi-person-lines-fill fs-3' }
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
        const response = await axios.get(`${config.apiBaseURL}/userprofile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.userProfile = response.data.data || {}; // Ensure data is not null
      } catch (error) {
        this.error = error.response?.data.message || 'Failed to fetch user profile';
      }
    },
    async handleLogout() {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to log out?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log me out!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post(`${config.apiBaseURL}/logout`, {}, {
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
   // this.$router.push('/adashboard');
    this.selectedItem = '/adashboard';
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
  background-color: #A02334;
  overflow-y: overlay;
  max-height: 100vh;
  top: 0;
  left: 0;
}
/* Sidebar and Content */


.sidebar.open ~ .navbar {
  margin-left: 300px; /* Adjust margin based on sidebar state */
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

.sidebar::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

.sidebar.open ~ .content {
  margin-left: 320px; /* Margin when sidebar is open */
  width: calc(100% - 320px); /* Adjust width based on sidebar state */
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
.sidebar.open {
  width: 320px; /* Width when open */
}

.navbar {
  position: relative; /* Position relative to keep it in place */
  margin-left: 85px; /* Margin equal to closed sidebar width */
  padding-left: 30px;
  transition: margin-left 0.3s ease; /* Transition effect for margin change */
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
