<template>
    <div class="modal-overlay" v-if="show">
      <div class="modal">
        <p>Are you sure you want to proceed?</p>
        <div class="modal-buttons">
          <button @click="confirmAction" class="modal-button">Confirm</button>
          <button @click="cancelAction" class="modal-button cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    show: Boolean
  });
  
  const emit = defineEmits(['confirm', 'cancel']);
  
  const confirmAction = () => {
    emit('confirm');
  };
  
  const cancelAction = () => {
    emit('cancel');
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
  }
  
  .modal p {
    margin-bottom: 20px;
    font-size: 1.2em;
    color: #333;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .modal-button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .modal-button:hover {
    background-color: #2980b9;
  }
  
  .cancel-button {
    background-color: #e74c3c;
  }
  
  .cancel-button:hover {
    background-color: #c0392b;
  }
  </style>
  