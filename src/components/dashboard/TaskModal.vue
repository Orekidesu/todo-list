<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditing ? 'Edit Task' : 'Create New Task' }}
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="$emit('submit')" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input :value="taskForm.title"
              @input="$emit('update:taskForm', { ...taskForm, title: ($event.target as HTMLInputElement).value })"
              type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter task title" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea :value="taskForm.description"
              @input="$emit('update:taskForm', { ...taskForm, description: ($event.target as HTMLTextAreaElement).value })"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter task description"></textarea>
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-medium text-gray-700">Category (Optional)</label>
              <button type="button" @click="$emit('addCategory')"
                class="text-sm text-green-600 hover:text-green-700 font-medium">
                + Add New Category
              </button>
            </div>
            <select :value="taskForm.category_id"
              @change="$emit('update:taskForm', { ...taskForm, category_id: ($event.target as HTMLSelectElement).value })"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">No category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input :value="taskForm.due_date"
              @input="$emit('update:taskForm', { ...taskForm, due_date: ($event.target as HTMLInputElement).value })"
              type="date" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>

          <div class="flex space-x-3 pt-4">
            <Button type="button" variant="outline" class="flex-1" @click="$emit('close')">
              Cancel
            </Button>
            <Button type="submit" class="flex-1 bg-green-600 hover:bg-green-700" :disabled="submitting">
              <div v-if="submitting" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ isEditing ? 'Updating...' : 'Creating...' }}
              </div>
              <span v-else>{{ isEditing ? 'Update Task' : 'Create Task' }}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { Category } from '@/data/dummyData'

interface TaskForm {
  title: string
  description: string
  category_id: string
  due_date: string
}

defineProps<{
  isEditing: boolean
  taskForm: TaskForm
  categories: Category[]
  submitting: boolean
}>()

defineEmits<{
  close: []
  submit: []
  addCategory: []
  'update:taskForm': [value: TaskForm]
}>()
</script>
