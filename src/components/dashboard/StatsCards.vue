<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <!-- Total Tasks Card -->
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="flex items-center">
        <div class="p-2 bg-blue-100 rounded-lg">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
            </path>
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Tasks</p>
          <p class="text-2xl font-bold text-gray-900">{{ tasks.length }}</p>
        </div>
      </div>
    </div>

    <!-- Categories Card -->
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="flex items-center">
        <div class="p-2 bg-green-100 rounded-lg">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Categories</p>
          <p class="text-2xl font-bold text-gray-900">{{ uniqueCategories.length }}</p>
        </div>
      </div>
    </div>

    <!-- Due Soon Card -->
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="flex items-center">
        <div class="p-2 bg-yellow-100 rounded-lg">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Due Soon</p>
          <p class="text-2xl font-bold text-gray-900">{{ dueSoonTasks.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/data/dummyData'

defineProps<{
  tasks: Task[]
  uniqueCategories: string[]
  dueSoonTasks: Task[]
}>()
</script>
