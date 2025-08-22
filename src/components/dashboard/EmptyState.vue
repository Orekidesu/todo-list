<template>
  <div class="text-center py-12">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
      </path>
    </svg>
    <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
    <p class="mt-1 text-sm text-gray-500">Get started by creating your first task.</p>
    <div class="mt-6">
      <Button @click="$emit('addTask')">
        Add New Task
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineEmits<{
  addTask: []
}>()
</script>
