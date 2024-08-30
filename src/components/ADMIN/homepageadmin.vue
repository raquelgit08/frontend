<template>
  <div v-if="isVisible">
    <nav class="navbar navbar-expand-lg">
      <div class="d-flex align-items-center">
        <div :class="['title-container', isSidebarCollapsed ? 'collapsed' : '']">
          <h2>Admin Portal</h2>
        </div>
      </div>
      <div class="d-flex align-items-center ms-auto">
        <h4 class="welcome-text">WELCOME ADMIN!</h4>
        <div @click="togglePopover" class="profile-icon-container">
          <i class="bi bi-person-lock profile-icon"></i>
          <div v-if="isPopoverVisible" class="popover show" role="tooltip">
            <div class="popover-arrow"></div>
            <div v-if="isLoggedIn">
              <div v-if="userProfile">
                <div class="popover-body">
                  <p>ID number: {{ userProfile.idnumber }}</p>
                  <p>NAME: {{ userProfile.lname }}, {{ userProfile.fname }} {{ userProfile.mname }}</p>
                </div>
                <button class="btn btn-danger btn-sm mt-2" @click="handleLogout">Log Out</button>
              </div>
              <div v-else>
                <p>Loading user profile...</p>
              </div>
              <div v-if="error">
                <p>Error fetching user profile: {{ error }}</p>
              </div>
            </div>
            <div v-else>
              <p>User not logged in.</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="d-flex">
      <div :class="['sidebar', isSidebarCollapsed ? 'collapsed' : '']">
        <img :src="require('@/assets/i12.png')" class="img-fluid logo" alt="Your Image">

        <!-- Dashboard Section -->
        <h5 class="sidebar-section-label">Dashboard</h5>
        <router-link
          v-for="(item, index) in items.filter(i => i.section === 'dashboard')"
          :key="index"
          :to="item.path"
          class="list-group"
          :class="{ active: selectedItem === item.path }"
          @click="handleItemClick(item.path)"
        >
          <span class="icon-label">
            <i :class="item.icon"></i>
            <span class="label">{{ item.label }}</span>
          </span>
        </router-link>

        <!-- Manage Section -->
        <h5 class="sidebar-section-label">Set Up</h5>
        <router-link
          v-for="(item, index) in items.filter(i => i.section === 'manage')" :key="index" :to="item.path" class="list-group" :class="{ active: selectedItem === item.path }" @click="handleItemClick(item.path)">
          <span class="icon-label">
            <i :class="item.icon"></i>
            <span class="label">{{ item.label }}</span>
          </span>
        </router-link>

        <!-- Manage User Dropdown -->
        <div class="list-group dropdown" @click="toggleDropdown('manageUser')">
          <span class="icon-label dropdown-toggle">
            <i class="bi bi-people-fill fs-4"></i> Manage User
          </span>
          <ul v-if="isDropdownVisible.manageUser" class="dropdown-menu show">
            <li><router-link to="/allusers" class="dropdown-item" @click="handleItemClick('/allusers')">All Users</router-link></li>
            <li><router-link to="/manage_teachers" class="dropdown-item" @click="handleItemClick('/manage_teachers')">Manage Teachers</router-link></li>
            <li><router-link to="/manage_students" class="dropdown-item" @click="handleItemClick('/manage_students')">Manage Students</router-link></li>
          </ul>
        </div>

        <!-- Report Section -->
        <h5 class="sidebar-section-label">Report</h5>
        <router-link
          v-for="(item, index) in items.filter(i => i.section === 'report')"
          :key="index"
          :to="item.path"
          class="list-group"
          :class="{ active: selectedItem === item.path }"
          @click="handleItemClick(item.path)"
        >
          <span class="icon-label">
            <i :class="item.icon"></i>
            <span class="label">{{ item.label }}</span>
          </span>
        </router-link>

        <!-- Chevron Icon to Collapse/Expand Sidebar -->
        <i @click="toggleSidebar" class="bi" :class="isSidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </div>
      <div :class="['content', isSidebarCollapsed ? 'collapsed' : '']">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomePageAdmin',
  props: {
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isLoggedIn: false,
      userProfile: null,
      drawerVisible: true,
      isPopoverVisible: false,
      isDropdownVisible: {
        manageUser: false,
        strand: false,
      },
      isSidebarCollapsed: false,
      selectedItem: localStorage.getItem('selectedItem') || '/adashboard',
      items: [
        // Dashboard Section
        { path: '/adashboard', label: 'Dashboard', icon: 'bi bi-house-door-fill', section: 'dashboard' },

        // Manage Section
        { path: '/ASchoolYear', label: 'Manage School Year', icon: 'bi bi-calendar-month-fill', section: 'manage' },
        { path: '/ManageStrandsinSHS', label: 'Manage Strand', icon: 'bi bi-calendar-month-fill', section: 'manage' },
        { path: '/ASection', label: 'Manage Section', icon: 'bi bi-folder-symlink-fill', section: 'manage' },
        { path: '/AManageSubject', label: 'Manage Subjects', icon: 'bi bi-house-door-fill', section: 'manage' },
        { path: '/AManagePosition', label: 'Manage Position', icon: 'bi bi-house-door-fill', section: 'manage' },
        { path: '/ManageCuricculuminSHS', label: 'Manage Curriculum', icon: 'bi bi-house-door-fill', section: 'manage' },

        // Report Section
        { path: '/ReportListofStudent', label: 'List of Student', icon: 'bi bi-house-door-fill', section: 'report' },
        { path: '/ReportListofTeacher', label: 'List of Teacher', icon: 'bi bi-house-door-fill', section: 'report' },
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
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    },
    async fetchUserProfile() {
      try {
        const response = await axios.get('http://localhost:8000/api/userprofile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.userProfile = response.data.data;
      } catch (error) {
        this.error = error.response && error.response.data.message ? error.response.data.message : 'Failed to fetch user profile';
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
        this.userProfile = null;
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
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
  },
  beforeMount() {
    this.$router.push('/adashboard');
    this.selectedItem = '/adashboard';
  },
};
</script>

<style scoped>
h2 {
  font-family: 'Roboto', sans-serif;
  color: rgb(14, 1, 1);
  margin-left: 270px;
  transition: margin-left 0.3s ease;
}

.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.welcome-text {
  margin-right: 20px;
  font-size: 1.25rem;
  color: white;
}

.profile-icon-container {
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
}

.profile-icon {
  font-size: 40px;
  margin-right: 10px;
  color: white;
  transition: color 0.3s;
}

.profile-icon-container:hover .profile-icon {
  color: #0056b3;
}

.modal-content {
  border: 2px solid #add8e6;
  border-radius: 10px;
}

.modal-header {
  background-color: #add8e6;
  color: #130404;
  border-bottom: 1px solid #ddd;
}

.modal-title {
  font-size: 1.25rem;
}

.modal-body {
  background-color: #f7f7f7;
}

.list-group {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 500;
  padding: 10px;
  border: none;
  color: white;
  background-color: transparent;
  transition: background-color 0.3s, color 0.3s;
}

.list-group.active {
  background-color: #007bff;
}

.list-group:hover {
  background-color: #0056b3;
}

.dropdown {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
}

.icon-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.label {
  margin-left: 10px;
  font-family: 'Roboto', sans-serif;
}

.content {
  margin-left: 250px;
  padding: 20px;
  width: calc(100% - 250px);
  transition: margin-left 0.3s ease, width 0.3s ease;
}

.title-container.collapsed h2 {
  margin-left: 100px;
}

.popover {
  position: absolute;
  z-index: 1050;
  display: block;
  font-family: 'Roboto', sans-serif;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  top: 50px;
  left: -170px;
  opacity: 0;
  font-size: 16px;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.popover.show {
  opacity: 1;
  transform: translateX(0);
}

.popover-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-width: 5px;
  border-style: solid;
  border-color: white transparent transparent transparent;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
}

.dropdown-menu {
  display: block;
  position: static;
  float: none;
  margin: 5px;
  background-color: #fff;
  font-size: 15px;
}

.dropdown-item {
  font-size: 18px;
  padding: 5px 10px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.logOut {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
}

.sidebar {
  width: 270px;
  background-color: #0e68bc;
  height: 100vh; /* Full viewport height */
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: width 0.3s ease;
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Hide horizontal overflow if necessary */
  color: #fff;
}

.sidebar.collapsed {
  width: 80px; /* Width of collapsed sidebar */
}

/* Sidebar Content */
.sidebar .logo {
  width: 100%;
  transition: opacity 0.3s ease;
}

.sidebar .list-group {
  margin-top: 20px;
}

.sidebar .list-group .icon-label {
  display: flex;
  align-items: center;
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .icon-label .label {
  display: none; /* Hide text when collapsed */
}

.sidebar.collapsed .icon-label i {
  font-size: 1.5rem; /* Adjust icon size if needed */
}

/* Chevron Icon for Toggling Sidebar */
.bi-chevron-left, .bi-chevron-right {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 1.5rem;
  cursor: pointer;
  color: wheat;
  transition: color 0.3s;
}

.bi-chevron-left:hover, .bi-chevron-right:hover {
  color: #0056b3;
}

/* Content Area Styling */
.content.collapsed {
  margin-left: 80px;
  width: calc(100% - 80px);
}
</style>
