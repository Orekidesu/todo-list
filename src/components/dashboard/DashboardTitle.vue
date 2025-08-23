<template>
  <div class="mb-6 sm:mb-8">
    <!-- Desktop Layout -->
    <div class="hidden sm:flex justify-between items-center">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">My Tasks</h1>
        <p class="mt-2 text-gray-600">Manage your daily tasks and stay organized</p>
      </div>
      <div class="flex space-x-3">
        <Button variant="outline" @click="$emit('addCategory')"
          class="bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
            </path>
          </svg>
          Add Category
        </Button>
        <Button @click="$emit('addTask')" class="bg-green-600 hover:bg-green-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Task
        </Button>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="sm:hidden space-y-4">
      <!-- Title Section -->
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p class="mt-1 text-sm text-gray-600">Manage your daily tasks</p>
      </div>

      <!-- Buttons Section - Stacked on mobile -->
      <div class="flex flex-col space-y-3">
        <Button @click="$emit('addTask')" class="bg-green-600 hover:bg-green-700 w-full py-3">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Task
        </Button>
        <Button variant="outline" @click="$emit('addCategory')"
          class="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 w-full py-3">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
            </path>
          </svg>
          Add Category
        </Button>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineEmits<{
  addTask: []
  addCategory: []
}>()
</script>