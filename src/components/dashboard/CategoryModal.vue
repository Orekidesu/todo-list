<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            Create New Category
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="$emit('submit')" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input :value="categoryName"
              @input="$emit('update:categoryName', ($event.target as HTMLInputElement).value)" type="text" required
              maxlength="50"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter category name" />
          </div>

          <div class="flex space-x-3 pt-4">
            <Button type="button" variant="outline" class="flex-1" @click="$emit('close')">
              Cancel
            </Button>
            <Button type="submit" class="flex-1 bg-green-600 hover:bg-green-700"
              :disabled="submitting || !categoryName.trim()">
              <div v-if="submitting" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
              <span v-else>Create Category</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineProps<{
  categoryName: string
  submitting: boolean
}>()

defineEmits<{
  close: []
  submit: []
  'update:categoryName': [value: string]
}>()
</script>
