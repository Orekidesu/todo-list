<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="(task, index) in filteredTasks" :key="task.id" :draggable="!hasActiveFilters"
      @dragstart="$emit('dragStart', $event, task, index)" @dragend="$emit('dragEnd')"
      @dragover="$emit('dragOver', $event)" @drop="$emit('drop', $event, index)"
      @dragenter="$emit('dragEnter', $event, index)" @dragleave="$emit('dragLeave', $event)"
      class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200" :class="{
        'cursor-move': !hasActiveFilters,
        'opacity-50': draggedTask?.id === task.id,
        'ring-2 ring-green-500 ring-opacity-50': dragOverIndex === index && draggedTask?.id !== task.id
      }">
      <div class="p-6">
        <!-- Drag Handle -->
        <div v-if="!hasActiveFilters" class="flex items-center justify-between mb-2">
          <div class="flex items-center text-gray-400 hover:text-gray-600 cursor-move">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
            </svg>
            <span class="text-xs ml-1">Drag to reorder</span>
          </div>
        </div>

        <!-- Category Badge and Actions -->
        <div class="flex items-center justify-between mb-3">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {{ task.category.name }}
          </span>
          <div class="flex items-center space-x-2">
            <span v-if="task.completed" class="text-xs text-green-600 font-medium">✓ Completed</span>
            <button @click="$emit('deleteTask', task.id)" class="text-red-500 hover:text-red-700 p-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                </path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Task Title -->
        <h3 class="text-lg font-semibold text-gray-900 mb-2" :class="{ 'line-through text-gray-500': task.completed }">
          {{ task.title }}
        </h3>

        <!-- Task Description -->
        <p class="text-gray-600 text-sm mb-4 line-clamp-3" :class="{ 'text-gray-400': task.completed }">
          {{ task.description }}
        </p>

        <!-- Due Date -->
        <div class="flex items-center text-sm text-gray-500 mb-4">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Due: {{ formatDate(task.due_date) }}
        </div>

        <!-- Task Actions -->
        <div class="flex space-x-2">
          <Button size="sm" variant="outline" class="flex-1" @click="$emit('editTask', task)">
            Edit
          </Button>
          <Button size="sm" :variant="task.completed ? 'outline' : 'default'"
            :class="task.completed ? 'text-gray-600' : 'bg-green-600 hover:bg-green-700 text-white'" class="flex-1"
            @click="$emit('toggleComplete', task)">
            {{ task.completed ? 'Mark Incomplete' : 'Mark Complete' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { Task } from '@/data/dummyData'

defineProps<{
  filteredTasks: Task[]
  hasActiveFilters: boolean
  draggedTask: Task | null
  dragOverIndex: number | null
}>()

defineEmits<{
  editTask: [task: Task]
  deleteTask: [taskId: number]
  toggleComplete: [task: Task]
  dragStart: [event: DragEvent, task: Task, index: number]
  dragEnd: []
  dragOver: [event: DragEvent]
  drop: [event: DragEvent, index: number]
  dragEnter: [event: DragEvent, index: number]
  dragLeave: [event: DragEvent]
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
