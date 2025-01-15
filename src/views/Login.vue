<template>
  <div
    v-if="store.loading"
    :style="{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '9999',
    }"
  >
    <VueSpinnerBars size="75" color="#87CEEB" />
  </div>

  <div v-else class="box">
    <div class="container">
      <div class="top-header">
        <header>C-U-A Mapping Screen</header>
        <!-- <p v-if="error">{{ error }}</p> -->
      </div>
      <div class="input-field">
        <input
          type="text"
          class="input"
          id="username-input"
          placeholder="Username"
          required
        />
      </div>
      <div class="input-field">
        <input
          type="password"
          class="input"
          id="password-input"
          placeholder="Password"
          required
        />
      </div>
      <div class="bottom">
        <div class="left1">
          <input type="checkbox" id="check" />
          <label for="check"> Remember Me</label>
        </div>
      </div>
      <div class="input-field">
        <input
          type="submit"
          class="submit"
          value="Login"
          @click="handleSubmit"
          :disabled="store.loading"
        />
      </div>
      <div style="display: none">{{ store.error }}</div>
      <div style="display: none">{{ store.loading }}</div>
      <div style="display: none">{{ store.userName }}</div>
      <div style="display: none">{{ store.role }}</div>
      <div style="display: none">{{ store.remeberMe }}</div>
    </div>
  </div>
</template>

<script setup>
import { useLoginStore } from "../stores/loginStore.js";
import { useRouter } from "vue-router";
import { VueSpinnerBars } from "vue3-spinners";
import { useUserDataStore } from "../stores/userDataStore.js";

const store = useLoginStore();
const userStore = useUserDataStore();
const router = useRouter();

const handleSubmit = async (event) => {
  event.preventDefault();

  const userNameInput = document.getElementById("username-input").value;
  const passwordInput = document.getElementById("password-input").value;
  const rememberCheckbox = document.getElementById("check").checked;

  try {
    store.setLoading(true);
    const response = await store.loginUser(userNameInput, passwordInput, null);
    if (response) {
      const token = response.GetLogin_BoUserMappingsResult[0].Token;
      sessionStorage.setItem("x-auth-token", token);
      const response1 = await store.loginUser(
        userNameInput,
        passwordInput,
        token
      );
      sessionStorage.setItem(
        "UserName",
        response1.GetLogin_BoUserMappingsResult[0].BoUserName
      );
      store.setUserName(response1.GetLogin_BoUserMappingsResult[0].BoUserName);
      sessionStorage.setItem(
        "Role",
        response1.GetLogin_BoUserMappingsResult[0].Role
      );
      store.setRole(response1.GetLogin_BoUserMappingsResult[0].Role);
      setTimeout(() => {
        router.push("/home");
      }, 1000);
      // if (role === "User") {
      //     setTimeout(() => {
      //         navigate('/home');
      //     }, 2000);
      // }
    } else {
      store.setError("Login failed. Please try again.");
    }
  } catch (error) {
    store.setError("Login failed. Please try again.");
  } finally {
    setTimeout(() => {
      store.setLoading(false); // Hide the loading spinner after 3 seconds
    }, 3000);
  }
};
</script>

<style scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
}
.container {
  width: 400px;
  display: flex;
  flex-direction: column;
  padding: 0 15px 0 15px;
}
span {
  color: #fff;
  font-size: small;
  display: flex;
  justify-content: center;
  padding: 10px 0 10px 0;
}
header {
  color: #fff;
  font-size: 35px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 0 10px 0;
  margin-bottom: 15px;
}
.input-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.input-field .input {
  height: 40px;
  width: 93%;
  border: none;
  outline: none;
  border-radius: 30px;
  color: #fff;
  padding: 0 0 0 22px;
  background: rgba(255, 255, 255, 0.1);
}
i {
  position: relative;
  top: -40px;
  left: 17px;
  color: #fff;
}
::-webkit-input-placeholder {
  color: #fff;
}
.submit {
  border: none;
  border-radius: 30px;
  font-size: 15px;
  height: 45px;
  outline: none;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
  font-weight: 500;
  color: black;
  font-weight: bold;
}
.submit:hover {
  box-shadow: 1px 5px 7px 1px rgba(0, 0, 0, 0.2);
}
.bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: small;
  color: #fff;
  margin-bottom: 10px;
  margin-top: 6px;
}
.left1 {
  display: flex;
}
label a {
  color: #fff;
  text-decoration: none;
}
#check {
  margin-right: 8px;
}
</style>
