<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <DashboardHeader :user="auth.user" :loading="auth.loading" @logout="handleLogout" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 sm:px-0">
        <!-- Dashboard Title -->
        <!-- Dashboard Header -->
        <DashboardTitle @add-task="openCreateModal" @manage-categories="openCategoryManager" />

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
      :submitting="submitting" @close="closeModal" @submit="submitTask" @add-category="openCategoryModalFromTask" />

    <!-- Category Creation Modal -->
    <CategoryModal v-if="showCategoryModal" v-model:category-name="categoryForm.name" :submitting="categorySubmitting"
      :existing-categories="categories" @close="closeCategoryModal" @submit="submitCategory" />

    <!-- Category Manager Modal -->
    <CategoryManager v-if="showCategoryManager" :categories="categories" :tasks="tasks" @close="closeCategoryManager"
      @add-category="openCategoryModalFromManager" @delete-category="deleteCategory" />

    <!-- Delete Task Alert Dialog -->
    <AlertDialog v-model:open="showDeleteTaskDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the task "{{ taskToDelete?.title }}"?
            <br><br>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="cancelDeleteTask">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmDeleteTask" class="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            :disabled="deletingTask">
            <div v-if="deletingTask" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Deleting...
            </div>
            <span v-else>Delete Task</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
import CategoryModal from '@/components/dashboard/CategoryModal.vue'
import CategoryManager from '@/components/dashboard/CategoryManager.vue'
import ErrorMessage from '@/components/dashboard/ErrorMessage.vue'
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
import { toast } from '@/components/ui/toast'

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

// Category modal state
const showCategoryModal = ref(false)
const categorySubmitting = ref(false)
const categoryForm = ref({
  name: ''
})
const isCreatingCategoryFromTask = ref(false)

// Category manager modal state
const showCategoryManager = ref(false)

// Delete task dialog state
const showDeleteTaskDialog = ref(false)
const taskToDelete = ref<Task | null>(null)
const deletingTask = ref(false)

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedDueFilter = ref('')

const draggedTask = ref<Task | null>(null)
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const uniqueCategories = computed(() => {
  const categoryNames = tasks.value
    .filter(task => task.category !== null)
    .map(task => task.category!.name)
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
    if (selectedCategory.value === '__no_category__') {
      filtered = filtered.filter(task => task.category === null)
    } else {
      filtered = filtered.filter(task => task.category?.name === selectedCategory.value)
    }
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

  // Set default due date to today
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]

  taskForm.value = {
    title: '',
    description: '',
    category_id: '',
    due_date: todayString
  }
  showModal.value = true
}

const openEditModal = (task: Task) => {
  isEditing.value = true
  editingTaskId.value = task.id
  taskForm.value = {
    title: task.title,
    description: task.description,
    category_id: task.category ? task.category.id.toString() : '',
    due_date: task.due_date.split('T')[0]
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingTaskId.value = null
}

const openCategoryModal = () => {
  isCreatingCategoryFromTask.value = false
  categoryForm.value = {
    name: ''
  }
  showCategoryModal.value = true
}

const openCategoryModalFromTask = () => {
  isCreatingCategoryFromTask.value = true
  categoryForm.value = {
    name: ''
  }
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  isCreatingCategoryFromTask.value = false
}

// Category manager functions
const openCategoryManager = () => {
  showCategoryManager.value = true
}

const closeCategoryManager = () => {
  showCategoryManager.value = false
}

const openCategoryModalFromManager = () => {
  showCategoryManager.value = false
  openCategoryModal()
}

const deleteCategory = async (categoryId: number) => {
  try {
    const categoryToDelete = categories.value.find(category => category.id === categoryId)
    const categoryName = categoryToDelete?.name || 'Unknown Category'
    const tasksWithCategory = tasks.value.filter(task => task.category?.id === categoryId)

    await categoryApi.deleteCategory(categoryId)

    // Remove category from local state
    categories.value = categories.value.filter(category => category.id !== categoryId)

    // Update tasks that had this category to have no category (null)
    tasks.value = tasks.value.map(task => {
      if (task.category && task.category.id === categoryId) {
        return { ...task, category: null }
      }
      return task
    })

    // Clear category filter if the deleted category was selected
    if (selectedCategory.value &&
      categories.value.find(cat => cat.name === selectedCategory.value) === undefined) {
      selectedCategory.value = ''
    }

    toast({
      title: "Category Deleted",
      description: `"${categoryName}" has been deleted. ${tasksWithCategory.length} task${tasksWithCategory.length !== 1 ? 's' : ''} ${tasksWithCategory.length !== 1 ? 'have' : 'has'} been uncategorized.`,
      variant: "success",
    })

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete category'
    toast({
      title: "Error",
      description: error.value,
      variant: "destructive",
    })
  }
}

const submitCategory = async () => {
  categorySubmitting.value = true

  try {
    const trimmedName = categoryForm.value.name.trim()
    const newCategory = await categoryApi.createCategory(trimmedName)
    categories.value.push(newCategory)

    // If creating category from task modal, select it automatically
    if (isCreatingCategoryFromTask.value) {
      taskForm.value.category_id = newCategory.id.toString()
    }

    closeCategoryModal()
    toast({
      title: "Category Created",
      description: `"${trimmedName}" has been added to your categories.`,
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create category'
    toast({
      title: "Error",
      description: error.value,
      variant: "destructive",
    })
  } finally {
    categorySubmitting.value = false
  }
}

const submitTask = async () => {
  submitting.value = true

  try {
    const taskData = {
      title: taskForm.value.title,
      description: taskForm.value.description,
      due_date: taskForm.value.due_date,
      category_id: taskForm.value.category_id ? parseInt(taskForm.value.category_id) : null
    }

    if (isEditing.value && editingTaskId.value) {
      // Update existing task
      const updatedTask = await taskApi.updateTask(editingTaskId.value, taskData)
      const taskIndex = tasks.value.findIndex(t => t.id === editingTaskId.value)
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = updatedTask
      }
      toast({
        title: "Task Updated",
        description: `"${taskData.title}" has been updated successfully.`,
        variant: "success",
      })
    } else {
      // Create new task
      const newTask = await taskApi.createTask(taskData)
      tasks.value.push(newTask)
      toast({
        title: "Task Created",
        description: `"${taskData.title}" has been added to your tasks.`,
        variant: "success",
      })
    }

    closeModal()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save task'
    toast({
      title: "Error",
      description: error.value,
      variant: "destructive",
    })
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
    toast({
      title: updatedTask.completed ? "Task Completed" : "Task Reopened",
      description: `"${task.title}" has been ${updatedTask.completed ? 'completed' : 'reopened'}.`,
      variant: "success",
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update task status'
    toast({
      title: "Error",
      description: error.value,
      variant: "destructive",
    })
  }
}

const deleteTask = async (taskId: number) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (!task) return

  taskToDelete.value = task
  showDeleteTaskDialog.value = true
}

// Handle cancel delete
const cancelDeleteTask = () => {
  showDeleteTaskDialog.value = false
  taskToDelete.value = null
}

// Handle confirm delete
const confirmDeleteTask = async () => {
  if (!taskToDelete.value) return

  const taskTitle = taskToDelete.value.title
  deletingTask.value = true
  try {
    await taskApi.deleteTask(taskToDelete.value.id)
    tasks.value = tasks.value.filter(task => task.id !== taskToDelete.value!.id)
    showDeleteTaskDialog.value = false
    taskToDelete.value = null
    toast({
      title: "Task Deleted",
      description: `"${taskTitle}" has been deleted successfully.`,
      variant: "success",
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete task'
    toast({
      title: "Error",
      description: error.value,
      variant: "destructive",
    })
  } finally {
    deletingTask.value = false
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
