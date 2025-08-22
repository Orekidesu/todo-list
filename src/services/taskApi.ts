import api from './api'
import type { Task, Category, User } from '@/data/dummyData'

// API Response interfaces
interface ApiResponse<T> {
  data: T
  message: string
}

interface TaskResponse {
  id: number
  title: string
  description: string
  due_date: string
  is_completed?: boolean
  user: User
  category: Category
}

interface CategoryResponse {
  id: number
  name: string
  tasks?: TaskResponse[]
}

// Task API functions
export const taskApi = {
  // Get all tasks
  async getTasks(): Promise<Task[]> {
    try {
      const response = await api.get<ApiResponse<TaskResponse[]>>('/tasks')
      return response.data.data.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        completed: task.is_completed || false,
        user: task.user,
        category: task.category,
      }))
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  },

  // Create a new task
  async createTask(taskData: {
    title: string
    description: string
    due_date: string
    category_id: number
  }): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<TaskResponse>>('/tasks', {
        ...taskData,
        is_completed: false,
      })

      const task = response.data.data
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        completed: task.is_completed || false,
        user: task.user,
        category: task.category,
      }
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  },

  // Update an existing task
  async updateTask(
    taskId: number,
    taskData: {
      title: string
      description: string
      due_date: string
      category_id: number
    },
  ): Promise<Task> {
    try {
      const response = await api.put<ApiResponse<TaskResponse>>(`/tasks/${taskId}`, taskData)

      const task = response.data.data
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        completed: task.is_completed || false,
        user: task.user,
        category: task.category,
      }
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },

  // Toggle task completion status
  async toggleTaskComplete(taskId: number, completed: boolean): Promise<Task> {
    try {
      const response = await api.patch<ApiResponse<TaskResponse>>(`/tasks/${taskId}/toggle`, {
        is_completed: completed,
      })

      const task = response.data.data
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        completed: task.is_completed || false,
        user: task.user,
        category: task.category,
      }
    } catch (error) {
      console.error('Error toggling task completion:', error)
      throw error
    }
  },

  // Delete a task
  async deleteTask(taskId: number): Promise<void> {
    try {
      await api.delete(`/tasks/${taskId}`)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  },
}

// Category API functions
export const categoryApi = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<ApiResponse<CategoryResponse[]>>('/categories')
      return response.data.data.map((category) => ({
        id: category.id,
        name: category.name,
      }))
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  // Create a new category
  async createCategory(name: string): Promise<Category> {
    try {
      const response = await api.post<ApiResponse<CategoryResponse>>('/categories', {
        name,
      })

      const category = response.data.data
      return {
        id: category.id,
        name: category.name,
      }
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },
}
