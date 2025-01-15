<template>
  <div class="ctcl-container">
    <div 
      class="ctcl-section" 
      :class="{ active: selectedSection === 'existing' }" 
      @click="selectSection('existing')"
    >
      Add Mapping
    </div>
    <div 
      class="ctcl-section" 
      :class="{ active: selectedSection === 'new' }" 
      @click="selectSection('new')"
    >
      Manual Mapping
    </div>
    <div 
      class="ctcl-section" 
      :class="{ active: selectedSection === 'edit' }" 
      @click="selectSection('edit')"
    >
      Edit Mapping
    </div>
    <div class="indicator" :style="indicatorStyle"></div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';

const emit = defineEmits(['section-change']);
const selectedSection = ref('existing');

const selectSection = (section) => {
  selectedSection.value = section;
  emit('section-change', section);
};

const indicatorStyle = computed(() => {
  if (selectedSection.value === 'existing') {
    return { transform: 'translateX(0%)' };
  } else if (selectedSection.value === 'new') {
    return { transform: 'translateX(100%)' };
  } else if (selectedSection.value === 'edit') {
    return { transform: 'translateX(200%)' };
  }
  return { transform: 'translateX(0%)' };
});
</script>

<style scoped>
.ctcl-container {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 20px auto;
  border-bottom: 2px solid #ccc;
  position: relative;
}

.ctcl-section {
  flex: 1;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.ctcl-section.active {
  color: blue;
}

.indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 33.33%; /* Adjusted to accommodate the three tabs */
  height: 4px; /* Thicker indicator for better visibility */
  background-color: blue;
  transition: transform 0.3s ease;
}
</style>
