<template>
  <div v-if="isVisible">
    <nav class="navbar navbar-expand-lg">
      <div class="d-flex align-items-center">
        <div :class="['title-container', isSidebarCollapsed ? 'collapsed' : '']">
          <h2>Student Portal</h2>
        </div>
      </div>
      <div class="d-flex align-items-center ms-auto">
        <h4 class="mb-0 me-3">WELCOME {{userProfile.fname}}</h4>
        <div @click="togglePopover" class="profile-icon-container">
          <i class="bi bi-person-fill profile-icon"></i>
          <div v-if="isPopoverVisible" class="popover show" role="tooltip">
            <div class="popover-arrow"></div>
            <div v-if="isLoggedIn">
              <div v-if="userProfile">
                <div class="popover-body"><center>
                 
                  <span> {{ userProfile.idnumber }}</span><br>
                <span>{{ userProfile.lname }}, {{ userProfile.fname }} {{ userProfile.mname }}</span> <br>
                <span><i> {{ userProfile.email }}</i></span><br>
                <span>STRAND: {{ userProfile.strand_name }} - {{ userProfile.section_name }}</span><br>
                <span>GRADE: {{ userProfile.grade_level }}</span><br>
                  <a><b>ENHS - SHS</b></a><br>
                  <a>San Fabian, Echague, Isabela</a></center>
                </div>
                <button class="btn btn-success btn-sm mt-2" @click="showModal = true">My Profile</button>
                <button class="btn btn-danger btn-sm mt-2 logOut" @click="handleLogout">Log Out</button>
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
    <div v-if="showModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">My Profile</h5>
            <button type="button" class="btn-close" @click="showModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row mb-3">
                <div class="col-md-3">
                  <label for="id" class="form-label">LRN Number:</label>
                  <input type="text" id="id" v-model="userProfile.idnumber" class="form-control" required>
                </div>
                <div class="col-md-3">
                  <label class="form-label d-block">Gender:</label>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="gender" id="male" value="male" v-model="userProfile.sex">
                    <label class="form-check-label" for="male">Male</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="gender" id="female" value="female" v-model="userProfile.sex">
                    <label class="form-check-label" for="female">Female</label>
                  </div>
                </div>
                <div class="col-md-3">
                  <label for="strand" class="form-label">Strand:</label>
                  <select v-model="strand" id="strand" class="form-select">
                    <option v-for="(strand, index) in strands" :key="index" :value="strand.value">{{ strand.label }}</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="grade" class="form-label">GRADE:</label>
                  <select v-model="gradelevel" id="grade" class="form-select">
              <option v-for="(grade, index) in grades" :key="index" :value="grade.value">{{ grade.label }}</option>
            </select>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="lname" class="form-label">Last Name:</label>
                  <input type="text" id="lname" v-model="userProfile.lname" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label for="fname" class="form-label">First Name:</label>
                  <input type="text" id="fname" v-model="userProfile.fname" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label for="mname" class="form-label">Middle Name:</label>
                  <input type="text" id="mname" v-model="userProfile.mname" class="form-control" required>
                </div>
              </div>
              

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="email" class="form-label">Email Address:</label>
                  <input type="email" id="email" v-model="userProfile.email" class="form-control" required>
                </div>
                <div class="col-md-6 position-relative">
                  <label for="password" class="form-label">Password:</label>
                  <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="userProfile.password" class="form-control" required>
                    <button type="button" class="btn btn-outline-secondary" @click="togglePasswordVisibility">
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>
              </div>
          
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showModal = false">Close</button>
            <button type="button" class="btn btn-primary" @click="updateProfile">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex">
      <div :class="['sidebar', isSidebarCollapsed ? 'collapsed' : '']">
        <img :src="require('@/assets/i12.png')" class="img-fluid logo" alt="Your Image">

        <!-- Dashboard Section -->
        <router-link v-for="(item, index) in items.filter(i => i.section === 'dashboard')" :key="index" :to="item.path" class="list-group" :class="{ active: selectedItem === item.path }"  @click="handleItemClick(item.path)">
          <span class="icon-label">
            <i :class="item.icon"></i>
            <span class="label">{{ item.label }}</span>
          </span>
        </router-link>

        <!-- Manage Section -->
        <h5 class="sidebar-section-label">Activities</h5>
        <router-link
          v-for="(item, index) in items.filter(i => i.section === 'manage')" :key="index" :to="item.path" class="list-group" :class="{ active: selectedItem === item.path }" @click="handleItemClick(item.path)">
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
  name: 'Student_homepage',
  props: {
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
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
      drawerVisible: true,
      isPopoverVisible: false,
 
      isSidebarCollapsed: false,
      selectedItem: localStorage.getItem('selectedItem') || '/sdashboard',
      items: [
        // Dashboard Section
        { path: '/sdashboard', label: 'Dashboard', icon: 'bi bi-speedometer2', section: 'dashboard' },

        // Manage Section
        { path: '/saddsubject', label: 'Add Subjects', icon: 'bi bi-file-earmark-plus-fill fs-4', section: 'manage' },
        { path: '/spending', label: 'Pending Exam',icon: 'bi bi-hourglass-split fs-4', section: 'manage' },
        { path: '/sfinished', label: 'Finished Exams', icon: 'bi bi-check-circle-fill fs-4', section: 'manage' },
        { path: '/sperformance', label: 'My Performance', icon: 'bi bi-bar-chart-line-fill fs-4', section: 'manage' },
        { path: '/takeExam', label: 'Take Exam', icon: 'bi bi-bar-chart-line-fill fs-4', section: 'manage' },
       

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
    this.$router.push('/sdashboard');
    this.selectedItem = '/sdashboard';
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
  font-size: 25px;
  font-weight: normal; /* Make text bold */
  padding: 5px; /* Reduce padding for less space */
  color: white;
  background-color: transparent;
  text-decoration: none; /* Ensure no underline */
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
  font-weight: bold; /* Make text bold */
  margin-bottom: 5px; /* Reduce margin to lessen space */
  text-decoration: none; /* Ensure no underline */
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
  background-color: #eaeaea; /* Gray background */
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
  left: -200px;
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
  text-decoration: none; /* Ensure no underline */
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.logOut {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 15px;
  font-weight: 500;
  width: 220px;
  margin: 10px;
  cursor: pointer;
}

.sidebar {
  width: 270px;
  background-color: #0e68bc;
  height: 100vh;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: width 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  color: #fff;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar .logo {
  width: 100%;
  transition: opacity 0.3s ease;
}

.sidebar .list-group {
  margin-top: 10px; /* Reduce space between items */
}

.sidebar .list-group .icon-label {
  display: flex;
  align-items: center;
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .icon-label .label {
  display: none;
}

.sidebar.collapsed .icon-label i {
  font-size: 1.5rem;
}

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

.content.collapsed {
  margin-left: 80px;
  width: calc(100% - 80px);
}
</style>