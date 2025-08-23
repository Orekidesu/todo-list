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
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-300': isDuplicate }"
              placeholder="Enter category name" />

            <!-- Duplicate Error Message -->
            <div v-if="isDuplicate" class="mt-1 text-sm text-red-600">
              A category with this name already exists (case-insensitive)
            </div>

            <!-- Similar Categories Suggestions -->
            <div v-else-if="similarCategories.length > 0 && categoryName.trim()" class="mt-1 text-sm text-amber-600">
              Similar categories exist:
              <span v-for="(category, index) in similarCategories" :key="category.id">
                <button type="button" @click="$emit('update:categoryName', category.name)"
                  class="text-amber-700 hover:text-amber-800 underline">
                  {{ category.name }}
                </button><span v-if="index < similarCategories.length - 1">, </span>
              </span>
            </div>

            <!-- Validation Messages -->
            <div v-else-if="categoryName && !isValidName" class="mt-1 text-sm text-gray-500">
              Category name must be at least 2 characters long
            </div>
          </div>

          <div class="flex space-x-3 pt-4">
            <Button type="button" variant="outline" class="flex-1" @click="$emit('close')">
              Cancel
            </Button>
            <Button type="submit" class="flex-1 bg-green-600 hover:bg-green-700"
              :disabled="submitting || !isValidName || isDuplicate">
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
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import type { Category } from '@/data/dummyData'

const props = defineProps<{
  categoryName: string
  submitting: boolean
  existingCategories: Category[]
}>()

defineEmits<{
  close: []
  submit: []
  'update:categoryName': [value: string]
}>()

// Check for duplicate category names (case-insensitive)
const isDuplicate = computed(() => {
  if (!props.categoryName.trim()) return false
  
  return props.existingCategories.some(category => 
    category.name.toLowerCase() === props.categoryName.trim().toLowerCase()
  )
})

// Find similar category names to show suggestions
const similarCategories = computed(() => {
  if (!props.categoryName.trim() || props.categoryName.length < 2) return []
  
  const input = props.categoryName.trim().toLowerCase()
  return props.existingCategories.filter(category => {
    const categoryName = category.name.toLowerCase()
    return categoryName.includes(input) || input.includes(categoryName)
  })
  .filter(category => category.name.toLowerCase() !== input) // Exclude exact matches
  .slice(0, 3) // Limit to 3 suggestions
})

// Check if the category name is valid (not empty after trimming, not too short)
const isValidName = computed(() => {
  const trimmed = props.categoryName.trim()
  return trimmed.length >= 2
})
</script>
