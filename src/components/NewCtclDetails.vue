<template>
  <div>
    <div class="details-container">
      <!-- Select Risk User -->
      <div class="column-box">
        <div class="column">
          <label for="riskUserDropdown">Select Risk User</label>
          <select id="riskUserDropdown" v-model="selectedRiskUser">
            <option value="">Select a user</option>
            <option v-for="user in riskUsers" :key="user" :value="user">
              {{ user }}
            </option>
          </select>
        </div>
      </div>

      <!-- Enter CTCL -->
      <div class="column-box">
        <div class="column">
          <label>Enter CTCL</label>
          <input
            type="text"
            v-model="ctclInput"
            placeholder="Enter CTCL"
            class="input-input"
          />
        </div>
      </div>

      <!-- Enter QT User -->
      <div class="column-box">
        <div class="column">
          <label>Enter QT User</label>
          <input
            type="text"
            v-model="qtUserInput"
            placeholder="Enter QT User"
            class="input-input"
          />
        </div>
      </div>

      <!-- Enter QT Accounts -->
      <div class="column-box">
        <div class="column">
          <label>Enter QT Accounts</label>
          <div class="input-group">
            <input type="text" v-model="qtAccountInput" />
            <button class="add-button" @click="addQtAccount">Add</button>
          </div>
          <ul class="entered-list">
            <li v-for="account in qtAccounts" :key="account">
              {{ account }}
              <button class="remove-button" @click="removeQtAccount(account)">
                Delete
              </button>
            </li>
          </ul>
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
import { ref, computed } from "vue";
import ModalComponent from "./ModalComponent.vue";
import { useUserDataStore } from "../stores/userDataStore";

const userDataStore = useUserDataStore();

const selectedRiskUser = ref("");
const qtAccountInput = ref("");
const qtAccounts = ref([]);
const ctclInput = ref("");
const qtUserInput = ref("");
const isModalVisible = ref(false);

const riskUsers = computed(() => userDataStore.riskUsers);

const addQtAccount = () => {
  const trimmedInput = qtAccountInput.value.trim();

  if (!trimmedInput) {
    alert("Please enter a valid QT account.");
    return;
  }

  if (qtAccounts.value.includes(trimmedInput)) {
    alert("This QT account already exists.");
  } else {
    qtAccounts.value.push(trimmedInput);
    qtAccountInput.value = "";
  }
};

const removeQtAccount = (accountToRemove) => {
  qtAccounts.value = qtAccounts.value.filter(
    (account) => account !== accountToRemove
  );
};

const showConfirmModal = () => {
  if (
    !selectedRiskUser.value ||
    !ctclInput.value.trim() ||
    !qtUserInput.value.trim() ||
    qtAccounts.value.length === 0
  ) {
    alert(
      "Please ensure all fields are filled:\n- Risk User\n- CTCL\n- QT User\n- QT Accounts."
    );
  } else {
    isModalVisible.value = true;
  }
};

const handleConfirm = () => {
  isModalVisible.value = false;

  try {
    // Sending all 4 values in the save logic
    const saveData = {
      riskUser: selectedRiskUser.value,
      ctcl: ctclInput.value.trim(),
      qtUser: qtUserInput.value.trim(),
      qtAccounts: qtAccounts.value,
    };

    userDataStore.addManualMapping(saveData);
    alert("Changes saved successfully!");
  } catch (error) {
    // If there is an error, handle it here
    console.error("Error saving changes:", error);
    alert("Failed to save changes. Please check your input and try again.");
  }

  selectedRiskUser.value = "";
  qtAccountInput.value = "";
  qtUserInput.value = "";
  ctclInput.value = "";
  qtAccounts.value = [];
};

const handleCancel = () => {
  isModalVisible.value = false;
};
</script>

<style scoped>
.details-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 90%;
  margin: 20px auto;
  background-color: #2c3e50;
  padding: 20px;
  border-radius: 8px;
}

.column-box {
  flex: 1 1 22%; /* Equal width for all columns */
  background-color: #34495e;
  margin: 10px;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 242px;
  overflow-y: auto;
}

.column {
  padding: 10px;
}

label {
  display: block;
  margin-bottom: 10px;
  color: #ecf0f1;
  font-size: 1em;
}

select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1em;
  height: auto;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1em;
  height: auto;
}

.input-input {
  width: 90%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1em;
  height: auto;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.add-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 5px;
  margin-bottom: 10px;
}

.add-button:hover {
  background-color: #2980b9;
}

.entered-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  color: #ecf0f1;
}

.entered-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1abc9c;
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-button:hover {
  background-color: #c0392b;
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
</style>
