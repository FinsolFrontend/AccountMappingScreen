<template>
  <TopBar />
  <Content />
</template>

<script setup>
import { onBeforeMount, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useUserDataStore } from "../stores/userDataStore.js";
import TopBar from "../components/TopBar.vue";
import Content from "../components/Content.vue";

const userDataStore = useUserDataStore();

const router = useRouter();

onBeforeMount(async () => {
  const tokenVal = sessionStorage.getItem("x-auth-token");
  if (!tokenVal) {
    router.push("/");
    return;
  }
  try {
    await Promise.all([
      userDataStore.getUniqueCtcls(),
      userDataStore.getLoginuserNames()
    ]); 
  } catch (error) {}
});

onMounted(() => {});
</script>

<style scoped>
.container-home {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
