<template>
  <div class="mb-8 flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">My Tasks</h1>
      <p class="mt-2 text-gray-600">Manage your daily tasks and stay organized</p>
    </div>
    <Button @click="$emit('addTask')" class="bg-green-600 hover:bg-green-700">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      Add New Task
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineEmits<{
  addTask: []
}>()
</script>
