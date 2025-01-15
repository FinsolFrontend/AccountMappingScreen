import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import axios from "axios";

export const useLoginStore = defineStore("login", () => {
  // const count = ref(0)
  // const name = ref('Eduardo')
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  // return { count, name, doubleCount, increment }

  let loading = ref(false);
  let error = ref(null);
  let userName = ref("");
  let rememberMe = ref(false);
  let role = ref("");

  const BASE_URL = "http://52.66.140.160:2021/DBService.svc/";

  function setLoading(value) {
    loading.value = value;
  }
  function setError(value) {
    error.value = value;
  }
  function setUserName(value) {
    userName.value = value;
  }
  function setRole(value) {
    role.value = value;
  }
  function setRemeberMe(value) {
    rememberMe.value = value;
  }

  const createAuthorizationHeader = () => {
    const token = sessionStorage.getItem("x-auth-token");
    return {
      "Content-Type": "application/json",
      Authorization: token,
    };
  };

  const loginUser = async (userName, password, token) => {
    try {
      const authHeader = createAuthorizationHeader();
      const response = await axios.post(
        `${BASE_URL}GetLogin_BoUserMappings`,
        {
          BoUser: userName,
          password: password,
          Token: token,
        },
        { headers: authHeader }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to Login. Please try again.");
    }
  };

  const logoutUser = async () => {
    const tokenVal = sessionStorage.getItem("x-auth-token");
    const authHeader = createAuthorizationHeader();
    try {
      const response = await axios.post(
        `${BASE_URL}Logout`,
        { key: tokenVal },
        { headers: authHeader }
      );
      setLoading(false);
      setError(null);
      setUserName("");
      setRemeberMe(false);
      setRole("");
      return response;
    } catch (error) {
      console.log("Logout error: ", error);
      throw new Error("Logout failed");
    }
  };

  return {
    loading,
    error,
    userName,
    role,
    rememberMe,
    setLoading,
    setError,
    setRole,
    setUserName,
    setRemeberMe,
    loginUser,
    logoutUser,
    createAuthorizationHeader,
  };
});
