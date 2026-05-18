<template>
  <div class="app-wrapper">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const saved = localStorage.getItem('was-theme') || 'dark'
  document.documentElement.setAttribute('data-theme', saved)
})
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
}
</style>
