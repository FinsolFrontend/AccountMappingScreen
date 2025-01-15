<template>
  <div>
    <div v-if="isToastVisible" class="toast">Unsaved changes</div>
    <div class="details-container">
      <div class="column-box">
        <div class="column">
          <label for="riskUserDropdown">Select Risk User</label>
          <select
            id="riskUserDropdown"
            v-model="selectedRiskUser"
            @change="handleRiskUserChange"
          >
            <option value="">Select a user</option>
            <option v-for="user in riskUsers" :key="user" :value="user">
              {{ user }}
            </option>
          </select>
        </div>
      </div>
      <div class="column-box">
        <div class="column">
          <label>Search QT Accounts</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search accounts..."
          />
          <label>Mapped QT Accounts : {{ qtAccounts.length }}</label>
          <div v-if="selectedRiskUser === ''">
            <br />
            Please select a user
          </div>
          <div v-else-if="filteredQtAccounts.length === 0">
            <br />
            No QT Accounts mapped for this user
          </div>
          <ul v-else class="entered-list">
            <li
              v-for="(account, index) in filteredQtAccounts"
              :key="account"
              :value="account.trim()"
            >
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
      <button
        @click="exportToExcel"
        class="export-button"
        :disabled="!selectedRiskUser"
      >
        Export to Excel
      </button>
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
import * as XLSX from "xlsx";

const userDataStore = useUserDataStore();

const selectedRiskUser = ref("");
const qtAccounts = ref([]);
const isModalVisible = ref(false);
const searchQuery = ref("");
const isToastVisible = ref(false);

const riskUsers = computed(() => userDataStore.riskUsers);

const handleRiskUserChange = async () => {
  if (selectedRiskUser.value) {
    await userDataStore.getQtAccountsFromRiskUser(selectedRiskUser.value);
    qtAccounts.value = userDataStore.qtAccounts
      .map((account) => account.trim())
      .filter((account) => account !== "");
  } else {
    qtAccounts.value = [];
  }
};

const removeQtAccount = (accountValue) => {
  // Remove the account from qtAccounts based on its value
  const index = qtAccounts.value.findIndex(
    (account) => account.trim() === accountValue.trim()
  );
  if (index !== -1) {
    qtAccounts.value.splice(index, 1);
    isToastVisible.value = true; // Show toast for unsaved changes
  }
  // Add logic to update the backend if needed
};

const showConfirmModal = () => {
  if (!selectedRiskUser.value) {
    alert("Please select a Risk User before saving.");
  } else {
    isModalVisible.value = true;
  }
};

const handleConfirm = async () => {
  isModalVisible.value = false;
  try {
    await userDataStore.editMapping(
      selectedRiskUser.value,
      qtAccounts.value.filter((account) => account.trim() !== "")
    );
    alert("Changes saved successfully!");
    isToastVisible.value = false;
  } catch (error) {
    // If there is an error, handle it here
    console.error("Error saving changes:", error);
    alert("Failed to save changes. Please check your input and try again.");
  }

  selectedRiskUser.value = "";
};

const handleCancel = () => {
  isModalVisible.value = false;
};

const filteredQtAccounts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (query === "") {
    return qtAccounts.value;
  }
  return qtAccounts.value.filter((account) =>
    account.toLowerCase().includes(query)
  );
});

const exportToExcel = () => {
  if (!selectedRiskUser.value) {
    alert("Please select a Risk User first.");
    return;
  }

  // Prepare the data for the Excel file
  const title = `Mapped QT Accounts for Risk User: ${selectedRiskUser.value}`;
  const headers = [["#", "QT Account"]];
  const rows = qtAccounts.value.map((account, index) => [index + 1, account]);

  const data = [[title], ...headers, ...rows];

  // Create a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Apply formatting
  // Merge the title cell across two columns
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

  // Add bold styling for headers (manually add cell styles)
  worksheet["A2"].s = { font: { bold: true } };
  worksheet["B2"].s = { font: { bold: true } };

  // Adjust column widths for better readability
  worksheet["!cols"] = [
    { wch: 5 }, // Column for row numbers
    { wch: 30 }, // Column for QT Accounts
  ];

  // Create a workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Mapped Accounts");

  // Download the file
  const filename = `Mapped_QT_Accounts_${selectedRiskUser.value}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
</script>

<style scoped>
.details-container {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 20px auto;
  background-color: #2c3e50;
  padding: 20px;
}

.column-box {
  flex: 1;
  background-color: #34495e;
  margin: 0 10px;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
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
  height: auto;
  font-size: 1.1em;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1.1em;
}

.entered-list {
  list-style-type: none;
  padding: 0;
  margin: 0 0 10px 0;
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

.export-button {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 10px;
}

.export-button:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.export-button:hover:not(:disabled) {
  background-color: #2ecc71;
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
