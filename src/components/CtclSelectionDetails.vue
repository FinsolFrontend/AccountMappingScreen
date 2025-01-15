<template>
  <div>
    <div v-if="isToastVisible" class="toast">Unsaved changes</div>
    <div class="details-container">
      <div class="column-box" v-if="currentStep >= 1">
        <div class="column">
          <label for="riskUserDropdown">Select Risk User</label>
          <select id="riskUserDropdown" v-model="selectedRiskUser">
            <option v-for="user in riskUsers" :key="user" :value="user">
              {{ user }}
            </option>
          </select>
        </div>
      </div>
      <div class="column-box" v-if="currentStep >= 1">
        <div class="column">
          <label>Select CTCL</label>
          <input
            type="text"
            v-model="ctclSearch"
            placeholder="Search CTCL"
            class="search-box"
          />
          <div class="checkbox-group">
            <div>
              <input
                type="checkbox"
                @change="toggleSelectAllCtcl"
                :checked="selectAllCtcl"
              />
              <span>Select All</span>
            </div>
            <div v-for="value in filteredCtclValues" :key="value">
              <input
                type="checkbox"
                :value="value.trim()"
                v-model="selectedCtcls"
                @change="handleCtclChange"
              />
              <span>{{ value.trim() }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="column-box" v-if="currentStep >= 2">
        <div class="column">
          <label>Select QT Users</label>
          <input
            type="text"
            v-model="qtUsersSearch"
            placeholder="Search QT Users"
            class="search-box"
          />
          <div class="checkbox-group">
            <div>
              <input
                type="checkbox"
                @change="toggleSelectAllUsers"
                :checked="selectAllUsers"
              />
              <span>Select All</span>
            </div>
            <div v-for="user in filteredQtUsersValues" :key="user">
              <input
                type="checkbox"
                :value="user.trim()"
                v-model="selectedUsers"
                @change="handleUserChange"
              />
              <span>{{ user }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="column-box" v-if="currentStep >= 2">
        <div class="column">
          <label>Select QT Accounts</label>
          <input
            type="text"
            v-model="qtAccountsSearch"
            placeholder="Search QT Accounts"
            class="search-box"
          />
          <div class="checkbox-group">
            <div>
              <input
                type="checkbox"
                @change="toggleSelectAllAccounts"
                :checked="selectAllAccounts"
              />
              <span>Select All</span>
            </div>
            <div
              v-for="(account, index) in filteredQtAccountsValues"
              :key="index"
            >
              <input
                type="checkbox"
                :value="account.trim()"
                v-model="selectedAccounts"
              />
              <span>{{ account }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="save-container">
      <button @click="showConfirmModal" class="save-button">Save</button>
    </div>
    <ModalComponent
      :show="isModalVisible"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useUserDataStore } from "../stores/userDataStore";
import ModalComponent from "./ModalComponent.vue";

const userDataStore = useUserDataStore();

const currentStep = ref(1);
const selectedRiskUser = ref("");
const selectedCtcls = ref([]);
const selectedUsers = ref([]);
const selectedAccounts = ref([]);
const isModalVisible = ref(false);
const selectAllCtcl = ref(false);
const selectAllUsers = ref(false);
const selectAllAccounts = ref(false);
const ctclSearch = ref("");
const qtUsersSearch = ref("");
const qtAccountsSearch = ref("");
const isToastVisible = ref(false);

const riskUsers = computed(() => userDataStore.riskUsers);
const ctclValues = computed(() => userDataStore.ctclValues);
const qtUsers = computed(() => userDataStore.qtUsers);
const qtAccounts = computed(() => userDataStore.qtAccounts);
const filteredCtclValues = computed(() =>
  ctclValues.value.filter((value) =>
    value.toLowerCase().includes(ctclSearch.value.toLowerCase().trim())
  )
);
const filteredQtUsersValues = computed(() =>
  qtUsers.value.filter((value) =>
    value.toLowerCase().includes(qtUsersSearch.value.toLowerCase().trim())
  )
);
const filteredQtAccountsValues = computed(() =>
  qtAccounts.value.filter((value) =>
    value.toLowerCase().includes(qtAccountsSearch.value.toLowerCase().trim())
  )
);

watch(selectedAccounts, (newAccounts) => {
  if (newAccounts.length > 0) {
    isToastVisible.value = true; // Show toast if any account is selected
  } else {
    isToastVisible.value = false; // Hide toast if no accounts are selected
  }
});

const handleCtclChange = () => {
  if (selectedCtcls.value.length > 0) {
    userDataStore.getQtUsersFromCtcl(
      selectedCtcls.value.join(","),
      selectedRiskUser.value
    );
    currentStep.value = 2;
  } else {
    currentStep.value = 1;
  }
};

const handleUserChange = () => {
  if (selectedUsers.value.length > 0) {
    userDataStore.getQtUsersMapppingFromCtclAndUsers(
      selectedCtcls.value,
      selectedUsers.value
    );
    currentStep.value = 2;
  }
};

const toggleSelectAllCtcl = () => {
  if (selectAllCtcl.value) {
    selectedCtcls.value = [];
  } else {
    selectedCtcls.value = ctclValues.value.map((value) => value.trim());
  }
  selectAllCtcl.value = !selectAllCtcl.value;
  handleCtclChange();
};

const toggleSelectAllUsers = () => {
  if (selectAllUsers.value) {
    selectedUsers.value = [];
  } else {
    selectedUsers.value = qtUsers.value.map((user) => user.trim());
  }
  selectAllUsers.value = !selectAllUsers.value;
  handleUserChange();
};

const toggleSelectAllAccounts = () => {
  if (selectAllAccounts.value) {
    selectedAccounts.value = [];
  } else {
    selectedAccounts.value = qtAccounts.value.map((account) => account.trim());
  }
  selectAllAccounts.value = !selectAllAccounts.value;
};

const showConfirmModal = () => {
  if (selectedRiskUser.value && selectedAccounts.value.length > 0) {
    isModalVisible.value = true;
  } else {
    alert("Please select both Risk User and QT Accounts before saving.");
  }
};

const handleConfirm = () => {
  isModalVisible.value = false;
  try {
    userDataStore.addMapping(selectedRiskUser.value, selectedAccounts.value);
    alert("Changes saved successfully!");
    isToastVisible.value = false;
  } catch (error) {
    // If there is an error, handle it here
    console.error("Error saving changes:", error);
    alert("Failed to save changes. Please check your input and try again.");
  }

  selectedRiskUser.value = "";
  selectedCtcls.value = [];
  selectedUsers.value = [];
  selectedAccounts.value = [];
  selectAllUsers.value = false;
  selectAllCtcl.value = false;
  selectAllAccounts.value = false;
};

const handleCancel = () => {
  isModalVisible.value = false;
};
</script>

<style scoped>
.details-container {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 20px auto;
  background-color: #2c3e50; /* Match with TopBar background */
  padding: 20px;
}

.column-box {
  flex: 1;
  background-color: #34495e;
  margin: 0 10px;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 400px; /* Fixed height */
  overflow-y: auto; /* Enable vertical scrolling */
}

.column {
  padding: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  color: #ecf0f1;
  font-size: 1.1em;
}

select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  height: auto; /* Ensure proper height */
  font-size: 1.1em; /* Increase font size for readability */
}

option {
  padding: 10px; /* Increase padding for better readability */
  font-size: 1em; /* Increase font size for readability */
}

.checkbox-group {
  margin-bottom: 10px;
}

.checkbox-group div {
  margin-bottom: 5px;
}

.buttons {
  display: flex;
  justify-content: flex-start;
  gap: 10px; /* Minimal gap between buttons */
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

.save-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.save-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #2980b9;
}

input.search-box {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 1em;
  z-index: 1000;
  animation: fadeInOut 4s ease-in-out;
}
</style>
