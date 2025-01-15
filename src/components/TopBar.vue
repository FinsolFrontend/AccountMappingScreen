<template>
  <div class="top-bar">
    <div class="insider">
      <span style="color: white; font-weight: 500; margin-top: 7px;">QT-BackOffice</span>
      <div class="user-div">
        <img src="../assets/icons8-logout-64.png" alt="Logout" class="logout-logo" @click="handleLogout" />
        <img src="../assets/icons8-user-48.png" alt="User" class="user-logo" @click="toggleDropdown"/>
        <span style="color: white; font-weight: 500; margin-top: 7px;" @click="toggleDropdown" ref="usernameRef">{{ userName }}</span>
        <div v-if="dropdownVisible" class="dropdown-menu" ref="dropdownMenu">
          <div class="dropdown-item" @click="goToProfile">
            <img src="../../public/images/resume.png" alt="My Profile" class="dropdown-icon" />
            <span>My Profile</span>
          </div>
          <div class="dropdown-item" @click="goToSupport">
            <img src="../../public/images/technical-support.png" alt="Support" class="dropdown-icon" />
            <span>Support</span>
          </div>
          <!-- Add more items as needed -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useLoginStore } from "../stores/loginStore.js";
import { useRouter } from "vue-router";
import { useUserDataStore } from "../stores/userDataStore.js";

const loginStore = useLoginStore();
const router = useRouter();
const userDataStore = useUserDataStore();

const userName = sessionStorage.getItem("UserName");
const dropdownVisible = ref(false);

const handleLogout = async () => {
  try {
    const logoutResult = await loginStore.logoutUser();
    sessionStorage.clear();
    router.push("/");
  } catch (error) {
    console.log("Logout error: ", error);
  }
};

const goToProfile = () => {
  console.log("Navigating to My Profile");
  dropdownVisible.value = false;
};

const goToSupport = () => {
  console.log("Navigating to Support");
  dropdownVisible.value = false;
};

</script>

<style scoped>
.top-bar {
  height: 5vh;
  width: 98.5vw;
  margin-top: 10px;
  border-radius: 5px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: rgba(
    128,
    128,
    128,
    0.5
  ); /* Greyish background with 50% opacity */
  border-radius: 10px; /* Add rounded corners for a smoother appearance */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add a subtle shadow for depth */
}

.insider {
  display: flex;
  flex-direction: row;
  padding-left: 8px;
  justify-content: space-between;
  padding-right: 8px;
}

.user-logo {
  width: 34px; /* Set the width of the image */
  height: 34px; /* Maintain aspect ratio */
  margin-right: 5px; /* Add spacing between user logo and text */
}

.logout-logo {
  width: 34px; /* Set the width of the image */
  height: 34px; /* Maintain aspect ratio */
  margin-right: 5px; /* Add spacing between user logo and text */
}

.show-logo {
  width: 34px; /* Set the width of the image */
  height: 34px; /* Maintain aspect ratio */
  margin-right: 5px; /* Add spacing between user logo and text */
}

.user-div {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: relative; /* Required for positioning the dropdown */
}

.dropdown-menu {
  position: absolute;
  top: 40px; /* Adjust based on your design */
  right: 0;
  background-color: black;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2000;
  color: white; /* White text color */
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #333; /* Darker background on hover */
}

.dropdown-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}
</style>
