<template>
  <div v-if="isVisible">
    <nav class="navbar navbar-expand-lg">
      <div class="d-flex align-items-center">
        <h2>Admin Portal</h2>
      </div>
      <div class="d-flex align-items-center ms-auto">
        <h4 class="mb-0 me-3">WELCOME ADMIN!</h4>
        <div @click="togglePopover" style="cursor: pointer; position: relative;">
          <i class="bi bi-person-lock" style="font-size: 40px; margin-right: 20px;"></i>
          <div v-if="isPopoverVisible" class="popover show" role="tooltip">
            <div class="popover-arrow"></div>
            <div v-if="isLoggedIn">
              <div v-if="userProfile">
                <div class="popover-body">
                  ID number: {{ userProfile.idnumber }}
                  NAME : {{ userProfile.lname }}
                  <br />
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

        <router-link
          v-for="(item, index) in items"
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

        <!-- Manage User Dropdown -->
        <div class="list-group dropdown" @click="toggleDropdown('manageUser')">
          <span class="icon-label dropdown-toggle" style="cursor: pointer;">
            <i class="bi bi-people-fill fs-4" style="padding-right: 20px;"></i> Manage User
          </span>
          <ul v-if="isDropdownVisible.manageUser" class="dropdown-menu show">
            <li><router-link to="/allusers" class="dropdown-item" @click="handleItemClick('/allusers')">All Users</router-link></li>
            <li><router-link to="/manage_teachers" class="dropdown-item" @click="handleItemClick('/manage_teachers')">Manage Teachers</router-link></li>
            <li><router-link to="/manage_students" class="dropdown-item" @click="handleItemClick('/manage_students')">Manage Students</router-link></li>
          </ul>
        </div>

        <!-- Strand Dropdown -->
        <div class="list-group" @click="handleItemClick('/strand-section')">
          <span class="icon-label dropdow">
            <i class="bi bi-grid-fill fs-4" style="padding-right: 10px;"></i> Strand & Section
          </span>
        </div> 

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
      isSidebarCollapsed: false, // New data property for sidebar state
      selectedItem: localStorage.getItem('selectedItem') || '/adashboard',
      items: [
        { path: '/adashboard', label: 'Dashboard', icon: 'bi bi-bar-chart-fill fs-4' },
     
        { path: '/ASection', label: 'Manage Section', icon: 'bi bi-bar-chart-fill fs-4' },
        { path: '/AYearLevel', label: 'Manage Year Level', icon: 'bi bi-bar-chart-fill fs-4' }
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
  font-family: Arial, Helvetica, sans-serif;
  color: rgb(14, 1, 1);
 
  margin-left: 270px;
 
}
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Horizontal offset, vertical offset, blur radius, spread radius, and color */
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

.sidebar {
  width: 250px;
  background-color: #0e68bc;

  height: 100vh; /* Full viewport height */
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.list-group {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 500;
  padding: 10px;
  border: #130404;
  color:white ;
  border-bottom: 2px solid #ccc; /* Light gray border color */
}

.dropdown {
  font-family: Arial, Helvetica, sans-serif;
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
}

.content {
  margin-left: 250px;
  padding: 20px;
  width: calc(100% - 250px);
  background-color: #f5f5f5;
}



.popover {
  position: absolute;
  z-index: 1050;
  display: block;
  font-family: Arial, sans-serif;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  width: 250px;
  top: 50px; /* Adjust this value based on where you want it to appear */
  left: -170px; /* Adjust this value to position it relative to the profile icon */
  opacity: 0;
  font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
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
  right: 100%; /* Position the arrow on the left side of the popover */
  transform: translateY(-50%);
}

.popover.show {
  display: block;
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
/* Sidebar Styling */
.sidebar {
  width: 250px;
  background-color: #0e68bc;
  height: 100vh;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: width 0.3s ease;
  overflow: hidden; /* Hide overflow content when collapsed */
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
  white-space: nowrap; /* Prevent text wrapping */
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
}

/* Content Area Styling */
.content {
  margin-left: 250px;
  padding: 20px;
  width: calc(100% - 250px);
  transition: margin-left 0.3s ease, width 0.3s ease;
}

.content.collapsed {
  margin-left: 80px;
  width: calc(100% - 80px);
}

</style>
