<template>
  <div class="container mt-4">
    <h5 class="text-center">Manage School Year</h5>

    <div class="d-flex justify-content-between mb-3 align-items-center">
      <!-- Search Bar -->
      <div class="input-group search-bar">
        <input
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Search Years..."
        />
        <span class="input-group-text">
          <i class="bi bi-search"></i>
        </span>
      </div>
      <!-- Add School Year Button -->
      <div>
        <button class="btn btn-primary btn-gradient" @click="openAddModal">
          <i class="bi bi-plus"></i> Add School Year
        </button>
      </div>
    </div>

    <div>
      <table class="table table-hover table-bordered table-striped shadow-sm">
        <thead class="table-dark">
          <tr>
            <th>No.</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(year, index) in filteredList"
            :key="year.id"
            class="align-middle"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ year.addyear }}</td>
            <td>
              <button
                class="btn btn-warning btn-sm me-1"
                @click="openEditModal(year)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="deleteYear(year.id)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="yearModal" tabindex="-1" ref="yearModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Edit Year" : "Add Year" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input
                type="text"
                v-model="newYear"
                class="form-control rounded-pill"
                placeholder="Year Name"
              />
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary btn-gradient" @click="saveYear">
              {{ isEdit ? "Update" : "Save" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Duplicate Error Modal -->
    <div class="modal fade" id="duplicateModal" tabindex="-1" ref="duplicateModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Duplicate Year</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeDuplicateModal"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ duplicateErrorMessage }}</p>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button type="button" class="btn btn-secondary" @click="closeDuplicateModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Modal } from "bootstrap";

export default {
  name: "SchoolYear",
  data() {
    return {
      searchQuery: "",
      years: [],
      newYear: "",
      isEdit: false,
      editYearId: null,
      error: null,
      duplicateErrorMessage: "",
    };
  },
  computed: {
    filteredList() {
      return this.years.filter((year) => {
        return year.addyear.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    async fetchYears() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/viewyear", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.years = response.data.data;
      } catch (error) {
        console.error("Error fetching years:", error);
        this.error = "Failed to fetch years.";
      }
    },

    async saveYear() {
      try {
        const token = localStorage.getItem("token");
        if (this.newYear) {
          if (this.isEdit) {
            await axios.put(
              `http://localhost:8000/api/updateyear/${this.editYearId}`,
              {
                addyear: this.newYear,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else {
            await axios.post(
              "http://localhost:8000/api/addyear",
              {
                addyear: this.newYear,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
          await this.fetchYears();
          this.resetForm();
          this.closeModal();
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.duplicateErrorMessage = error.response.data.message;
          this.closeModal();
          this.showDuplicateModal();
        } else {
          console.error("Error saving year:", error);
          this.error = "Failed to save year.";
        }
      }
    },

    async deleteYear(id) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/deleteyear/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await this.fetchYears();
      } catch (error) {
        console.error("Error deleting year:", error);
        this.error = "Failed to delete year.";
      }
    },

    openAddModal() {
      this.isEdit = false;
      this.resetForm();
      this.showModal();
    },

    openEditModal(year) {
      this.isEdit = true;
      this.editYearId = year.id;
      this.newYear = year.addyear;
      this.showModal();
    },

    showModal() {
      const modal = new Modal(this.$refs.yearModal);
      modal.show();
    },

    closeModal() {
      const modal = Modal.getInstance(this.$refs.yearModal);
      modal.hide();
      this.resetForm();
    },

    showDuplicateModal() {
      const modal = new Modal(this.$refs.duplicateModal);
      modal.show();
    },

    closeDuplicateModal() {
      const modal = Modal.getInstance(this.$refs.duplicateModal);
      modal.hide();
      this.resetForm();
    },

    resetForm() {
      this.newYear = "";
      this.isEdit = false;
      this.editYearId = null;
    },
  },

  mounted() {
    this.fetchYears();
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

h5 {
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: "Arial", sans-serif;
  text-align: center;
}

.search-bar .input-group-text {
  background-color: #fff;
  border-left: none;
}

.input-group {
  max-width: 100%;
  flex-grow: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.btn-gradient {
  background: linear-gradient(45deg, #007bff, #00bfff);
  border: none;
  color: #fff;
  transition: background 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #0056b3, #0080ff);
}

.table {
  margin-top: 20px;
  width: 100%; /* Ensure the table fits within its container */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  table-layout: fixed; /* Prevents columns from stretching excessively */
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
  overflow-wrap: break-word; /* Ensure long words break appropriately */
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
}

.btn-close {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
}

.btn-close:hover {
  color: #000;
  text-decoration: none;
  opacity: 0.75;
}

.modal-content {
  border-radius: 8px;
  background-color: #f9f9f9;
}

.modal-title {
  font-weight: bold;
}

@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    align-items: stretch;
  }

  .input-group,
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .table {
    font-size: 14px;
    width: 100%; /* Ensure the table adapts to smaller screens */
  }

  .table th,
  .table td {
    padding: 10px 5px; /* Adjust padding for smaller screens */
  }
}
</style>
