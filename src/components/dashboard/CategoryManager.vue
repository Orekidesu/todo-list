<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">
            Manage Categories
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="p-6 overflow-y-auto max-h-[60vh]">
        <div v-if="categories.length === 0" class="text-center py-8 text-gray-500">
          No categories found. Create your first category!
        </div>

        <div v-else class="space-y-3">
          <div v-for="category in categories" :key="category.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-green-100 rounded-full">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                  </path>
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">{{ category.name }}</h4>
                <p class="text-sm text-gray-500">{{ getTaskCount(category.id) }} tasks</p>
              </div>
            </div>

            <Button variant="outline" size="sm" @click="handleDeleteCategory(category)"
              class="text-red-600 hover:text-red-700 hover:bg-red-50">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                </path>
              </svg>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div class="p-6 border-t bg-gray-50 flex justify-between">
        <Button @click="$emit('addCategory')" class="bg-green-600 hover:bg-green-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Category
        </Button>
        <Button variant="outline" @click="$emit('close')">
          Close
        </Button>
      </div>
    </div>

    <!-- Delete Category Alert Dialog -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the category "{{ categoryToDelete?.name }}"?
            <br><br>
            <strong>{{ getTaskCount(categoryToDelete?.id || 0) }} tasks</strong> are currently using this category.
            If you delete this category, all these tasks will become uncategorized.
            <br><br>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="cancelDelete">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete" class="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            :disabled="deleting">
            <div v-if="deleting" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Deleting...
            </div>
            <span v-else>Delete Category</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Category, Task } from '@/data/dummyData'

const props = defineProps<{
  categories: Category[]
  tasks: Task[]
}>()

const emit = defineEmits<{
  close: []
  addCategory: []
  deleteCategory: [categoryId: number]
}>()

// Delete category state
const showDeleteDialog = ref(false)
const categoryToDelete = ref<Category | null>(null)
const deleting = ref(false)

// Get task count for a category
const getTaskCount = (categoryId: number) => {
  return props.tasks.filter(task => task.category?.id === categoryId).length
}

// Handle delete category button click
const handleDeleteCategory = (category: Category) => {
  categoryToDelete.value = category
  showDeleteDialog.value = true
}

// Cancel delete
const cancelDelete = () => {
  showDeleteDialog.value = false
  categoryToDelete.value = null
}

// Confirm delete
const confirmDelete = async () => {
  if (!categoryToDelete.value) return

  deleting.value = true
  try {
    emit('deleteCategory', categoryToDelete.value.id)
    showDeleteDialog.value = false
    categoryToDelete.value = null
  } finally {
    deleting.value = false
  }
}
</script>
