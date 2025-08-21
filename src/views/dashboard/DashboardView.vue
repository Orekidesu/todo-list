<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <DashboardHeader :user="auth.user" :loading="auth.loading" @logout="handleLogout" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 sm:px-0">
        <!-- Dashboard Title -->
        <DashboardTitle @add-task="openCreateModal" />

        <!-- Error State -->
        <ErrorMessage :error="error" />

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span class="ml-2 text-gray-600">Loading tasks...</span>
        </div>

        <!-- Tasks Display -->
        <div v-else-if="tasks.length > 0" class="space-y-6">
          <!-- Stats Cards -->
          <StatsCards :tasks="tasks" :unique-categories="uniqueCategories" :due-soon-tasks="dueSoonTasks" />

          <!-- Search and Filter Controls -->
          <TaskFilters v-model:search-query="searchQuery" v-model:selected-category="selectedCategory"
            v-model:selected-status="selectedStatus" v-model:selected-due-filter="selectedDueFilter"
            :unique-categories="uniqueCategories" :has-active-filters="hasActiveFilters"
            :filtered-tasks-count="filteredTasks.length" :total-tasks-count="tasks.length"
            @clear-filters="clearFilters" />

          <!-- Tasks Grid with Drag and Drop -->
          <TaskGrid :filtered-tasks="filteredTasks" :has-active-filters="hasActiveFilters" :dragged-task="draggedTask"
            :drag-over-index="dragOverIndex" @edit-task="openEditModal" @delete-task="deleteTask"
            @toggle-complete="toggleTaskComplete" @drag-start="handleDragStart" @drag-end="handleDragEnd"
            @drag-over="handleDragOver" @drop="handleDrop" @drag-enter="handleDragEnter"
            @drag-leave="handleDragLeave" />

          <!-- No Results Message -->
          <NoResults v-if="filteredTasks.length === 0 && hasActiveFilters" @clear-filters="clearFilters" />
        </div>

        <!-- Empty State -->
        <EmptyState v-else-if="!loading" @add-task="openCreateModal" />
      </div>
    </main>

    <!-- Task Creation/Editing Modal -->
    <TaskModal v-if="showModal" :is-editing="isEditing" v-model:task-form="taskForm" :categories="categories"
      :submitting="submitting" @close="closeModal" @submit="submitTask" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { type Task, type Category } from '@/data/dummyData'
import { taskApi, categoryApi } from '@/services/taskApi'

// Import all dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardTitle from '@/components/dashboard/DashboardTitle.vue'
import StatsCards from '@/components/dashboard/StatsCards.vue'
import TaskFilters from '@/components/dashboard/TaskFilters.vue'
import TaskGrid from '@/components/dashboard/TaskGrid.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import NoResults from '@/components/dashboard/NoResults.vue'
import TaskModal from '@/components/dashboard/TaskModal.vue'
import ErrorMessage from '@/components/dashboard/ErrorMessage.vue'

const auth = useAuth()

const tasks = ref<Task[]>([])
const categories = ref<Category[]>([])
const error = ref<string | null>(null)
const loading = ref(true)

const showModal = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const editingTaskId = ref<number | null>(null)

const taskForm = ref({
  title: '',
  description: '',
  category_id: '',
  due_date: ''
})

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedDueFilter = ref('')

const draggedTask = ref<Task | null>(null)
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const uniqueCategories = computed(() => {
  const categoryNames = tasks.value.map(task => task.category.name)
  return [...new Set(categoryNames)]
})

const dueSoonTasks = computed(() => {
  const today = new Date()
  const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000))

  return tasks.value.filter(task => {
    const dueDate = new Date(task.due_date)
    return dueDate <= threeDaysFromNow && dueDate >= today && !task.completed
  })
})

const filteredTasks = computed(() => {
  let filtered = [...tasks.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(task => task.category.name === selectedCategory.value)
  }

  if (selectedStatus.value) {
    if (selectedStatus.value === 'completed') {
      filtered = filtered.filter(task => task.completed)
    } else if (selectedStatus.value === 'incomplete') {
      filtered = filtered.filter(task => !task.completed)
    }
  }

  if (selectedDueFilter.value) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    filtered = filtered.filter(task => {
      const dueDate = new Date(task.due_date)
      dueDate.setHours(0, 0, 0, 0)

      switch (selectedDueFilter.value) {
        case 'overdue':
          return dueDate < today
        case 'today':
          return dueDate.getTime() === today.getTime()
        case 'week':
          const weekFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
          return dueDate >= today && dueDate <= weekFromNow
        case 'month':
          const monthFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
          return dueDate >= today && dueDate <= monthFromNow
        default:
          return true
      }
    })
  }

  return filtered
})

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedCategory.value || selectedStatus.value || selectedDueFilter.value)
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
  selectedDueFilter.value = ''
}

// API Functions
const fetchTasks = async () => {
  try {
    loading.value = true
    error.value = null
    tasks.value = await taskApi.getTasks()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch tasks'
    console.error('Error fetching tasks:', err)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    categories.value = await categoryApi.getCategories()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch categories'
    console.error('Error fetching categories:', err)
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingTaskId.value = null
  taskForm.value = {
    title: '',
    description: '',
    category_id: '',
    due_date: ''
  }
  showModal.value = true
}

const openEditModal = (task: Task) => {
  isEditing.value = true
  editingTaskId.value = task.id
  taskForm.value = {
    title: task.title,
    description: task.description,
    category_id: task.category.id.toString(),
    due_date: task.due_date.split('T')[0]
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingTaskId.value = null
}

const submitTask = async () => {
  submitting.value = true

  try {
    const taskData = {
      title: taskForm.value.title,
      description: taskForm.value.description,
      due_date: taskForm.value.due_date,
      category_id: parseInt(taskForm.value.category_id)
    }

    if (isEditing.value && editingTaskId.value) {
      // Update existing task
      const updatedTask = await taskApi.updateTask(editingTaskId.value, taskData)
      const taskIndex = tasks.value.findIndex(t => t.id === editingTaskId.value)
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = updatedTask
      }
    } else {
      // Create new task
      const newTask = await taskApi.createTask(taskData)
      tasks.value.push(newTask)
    }

    closeModal()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save task'
  } finally {
    submitting.value = false
  }
}

const toggleTaskComplete = async (task: Task) => {
  try {
    const updatedTask = await taskApi.toggleTaskComplete(task.id, !task.completed)
    const taskIndex = tasks.value.findIndex(t => t.id === task.id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = updatedTask
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update task status'
  }
}

const deleteTask = async (taskId: number) => {
  if (!confirm('Are you sure you want to delete this task?')) {
    return
  }

  try {
    await taskApi.deleteTask(taskId)
    tasks.value = tasks.value.filter(task => task.id !== taskId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete task'
  }
}

const handleDragStart = (event: DragEvent, task: Task, index: number) => {
  if (hasActiveFilters.value) {
    event.preventDefault()
    return
  }

  draggedTask.value = task
  draggedIndex.value = index

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', (event.target as HTMLElement).outerHTML)
  }
}

const handleDragEnd = () => {
  draggedTask.value = null
  draggedIndex.value = null
  dragOverIndex.value = null
}

const handleDragOver = (event: DragEvent) => {
  if (hasActiveFilters.value || !draggedTask.value) {
    return
  }

  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDrop = async (event: DragEvent, dropIndex: number) => {
  event.preventDefault()
  dragOverIndex.value = null

  if (hasActiveFilters.value || !draggedTask.value || draggedIndex.value === null) {
    return
  }

  if (draggedIndex.value === dropIndex) {
    return
  }

  const tasksCopy = [...tasks.value]
  const draggedTaskData = tasksCopy[draggedIndex.value]

  tasksCopy.splice(draggedIndex.value, 1)
  const newIndex = draggedIndex.value < dropIndex ? dropIndex - 1 : dropIndex
  tasksCopy.splice(newIndex, 0, draggedTaskData)

  tasks.value = tasksCopy

  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    console.log('Task order updated (simulated)')
  } catch (err) {
    console.error('Failed to update task order:', err)
  }
}

const handleDragEnter = (event: DragEvent, index: number) => {
  if (hasActiveFilters.value || !draggedTask.value) {
    return
  }
  dragOverIndex.value = index
}

const handleDragLeave = (event: DragEvent) => {
  const currentTarget = event.currentTarget as Element
  const relatedTarget = event.relatedTarget as Element

  if (!currentTarget?.contains(relatedTarget)) {
    dragOverIndex.value = null
  }
}

const handleLogout = async () => {
  await auth.logout()
}

onMounted(async () => {
  console.log('Dashboard loading...')
  await Promise.all([
    fetchTasks(),
    fetchCategories()
  ])
  console.log('Dashboard loaded with API data')
})
</script>
