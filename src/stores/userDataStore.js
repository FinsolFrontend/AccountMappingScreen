import { defineStore } from "pinia";
import { reactive, ref, computed, watch } from "vue";
import axios from "axios";

export const useUserDataStore = defineStore("userdata", () => {
  const BASE_URL = "http://52.66.140.160:2021/DBService.svc/";

  const ctclValues = ref([]);
  const qtUsers = ref([]);
  const qtAccounts = ref([]);
  const riskUsers = ref([]);

  const createAuthorizationHeader = () => {
    const token = sessionStorage.getItem("x-auth-token");
    return {
      "Content-Type": "application/json",
      Authorization: token,
    };
  };

  const getRiskUserList = async () => {
    try {
      const headers = createAuthorizationHeader();
      const response = await axios.get(`${BASE_URL}GetRiskUserList/`, {
        headers,
      });
      const str = response.data["GetRiskUserListResult"];
      riskUsers.value = str;
      return response.data;
    } catch (error) {
      console.log("Error fetching risk users: ", error);
      throw error;
    }
  };

  const getUniqueCtcls = async () => {
    try {
      const headers = createAuthorizationHeader();
      const response = await axios.get(`${BASE_URL}GetCTCL/`, { headers });
      const str = response.data["GetCTCLResult"];
      ctclValues.value = str.split(",");
      return response.data;
    } catch (error) {
      console.log("Error fetching unique ctcl ids: ", error);
      throw error;
    }
  };

  const getQtUsersFromCtcl = async (selectedCtcl, selectedRiskUser) => {
    try {
      const headers = createAuthorizationHeader();
      const response = await axios.post(
        `${BASE_URL}GetCtclUser/`,
        { ctclDict: selectedCtcl, user: selectedRiskUser },
        { headers }
      );
      const str1 = response.data["GetCtclUserResult"][0];
      const str2 = response.data["GetCtclUserResult"][1];
      qtUsers.value = str1;
      qtAccounts.value = str2;
      return response.data;
    } catch (error) {
      console.log("Error fetching qt users: ", error);
      throw error;
    }
  };

  const getQtUsersMapppingFromCtclAndUsers = async (
    selectedCtcl,
    selectedUsers
  ) => {
    try {
      const headers = createAuthorizationHeader();
      const commaSeparatedString1 = selectedCtcl.join(",");
      const commaSeparatedString2 = selectedUsers.join(",");
      const arr = {
        ctcl: commaSeparatedString1,
        user: commaSeparatedString2,
        AccountName: "",
      };
      const ctclDict = JSON.stringify(arr);
      const response = await axios.post(
        `${BASE_URL}GetAccountName/`,
        { ctclDict },
        { headers }
      );
      console.log(response);
      const str = response.data["GetAccountNameResult"];
      qtAccounts.value = str.split(",");
      return response.data;
    } catch (error) {
      console.log("Error fetching qt accounts: ", error);
      throw error;
    }
  };

  const getLoginuserNames = async () => {
    try {
      const headers = createAuthorizationHeader();
      const response = await axios.get(`${BASE_URL}GetLoginUserNames/`, {
        headers,
      });
      const str = response.data["GetLoginUserNamesResult"];
      for (let u of str) {
        riskUsers.value.push(u["BoUserName"]);
      }
      return response.data;
    } catch (error) {
      console.log("Error fetching login user names: ", error);
      throw error;
    }
  };

  const addManualMapping = async (savedData) => {
    try {
      const headers = createAuthorizationHeader();
      const arr = savedData.qtAccounts.map((u) => ({
        BoUserName: savedData.riskUser,
        CTCLId: savedData.ctcl,
        UserName: savedData.qtUser,
        AccountName: u,
      }));
      const ctclDict = JSON.stringify(arr);
      const response = await axios.post(
        `${BASE_URL}AddManualMapping/`,
        { ctclDict },
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Error posting the mapping: ", error);
      throw error;
    }
  };

  const addMapping = async (riskUser, selectedAccounts) => {
    try {
      const headers = createAuthorizationHeader();
      const arr = selectedAccounts.map((u) => ({
        user: riskUser,
        AccountName: u,
      }));
      const ctclDict = JSON.stringify(arr);
      const response = await axios.post(
        `${BASE_URL}AddCtclSymbolMapping/`,
        { ctclDict },
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Error posting the mapping: ", error);
      throw error;
    }
  };

  const getQtAccountsFromRiskUser = async (user) => {
    try {
      const headers = createAuthorizationHeader();
      const userDict = JSON.stringify([{ user: user }]);
      const response = await axios.post(
        `${BASE_URL}GetRiskUserMapping/`,
        { userDict },
        { headers }
      );
      const str1 = response.data["GetRiskUserMappingResult"];
      qtAccounts.value = str1.split(",");
      return response.data;
    } catch (error) {
      console.log("Error fetching qt accounts: ", error);
      throw error;
    }
  };

  const editMapping = async (riskUser, selectedAccounts) => {
    try {
      const headers = createAuthorizationHeader();
      const arr = selectedAccounts.map((u) => ({
        user: riskUser,
        AccountName: u,
      }));
      const ctclDict = JSON.stringify(arr);
      const response = await axios.post(
        `${BASE_URL}DeleteAccountName/`,
        { ctclDict },
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Error editing the mapping: ", error);
      throw error;
    }
  };

  return {
    riskUsers,
    ctclValues,
    qtUsers,
    qtAccounts,
    getUniqueCtcls,
    getQtUsersFromCtcl,
    getQtUsersMapppingFromCtclAndUsers,
    getRiskUserList,
    addMapping,
    getQtAccountsFromRiskUser,
    editMapping,
    getLoginuserNames,
    addManualMapping,
  };
});
