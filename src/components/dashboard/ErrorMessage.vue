<template>
  <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <p class="text-red-800">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string | null
}>()
</script>
