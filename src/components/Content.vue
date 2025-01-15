<template>
  <div>
    <CtclSection @section-change="handleSectionChange" />
    <div v-if="selectedSection === 'existing'">
      <CtclSelectionDetails />
    </div>
    <div v-else-if="selectedSection === 'new'">
      <NewCtclDetails />
    </div>
    <div v-else-if="selectedSection === 'edit'">
      <EditCtclDetails />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CtclSection from '../components/CtclSelection.vue';
import CtclSelectionDetails from '../components/CtclSelectionDetails.vue';
import NewCtclDetails from '../components/NewCtclDetails.vue';
import EditCtclDetails from '../components/EditCtclDetails.vue';

const selectedSection = ref('existing');

const handleSectionChange = (section) => {
  selectedSection.value = section;
};
</script>

<style scoped>
/* Add any additional styles for Content.vue here */
</style>
