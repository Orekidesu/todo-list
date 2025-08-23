<template>
  <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Search Bar -->
      <div class="flex-1">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input :value="searchQuery" @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Search tasks..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
        </div>
      </div>

      <!-- Category Filter -->
      <div class="lg:w-48">
        <select :value="selectedCategory"
          @change="$emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option value="">All Categories</option>
          <option value="__no_category__">No Category</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <!-- Status Filter -->
      <div class="lg:w-48">
        <select :value="selectedStatus"
          @change="$emit('update:selectedStatus', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option value="">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      <!-- Due Date Filter -->
      <div class="lg:w-48">
        <select :value="selectedDueFilter"
          @change="$emit('update:selectedDueFilter', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option value="">All Due Dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due Today</option>
          <option value="week">Due This Week</option>
          <option value="month">Due This Month</option>
        </select>
      </div>

      <!-- Clear Filters -->
      <Button v-if="hasActiveFilters" variant="outline" @click="$emit('clearFilters')" class="lg:w-auto">
        Clear Filters
      </Button>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
      <span class="text-sm text-gray-600">Active filters:</span>
      <span v-if="searchQuery"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Search: "{{ searchQuery }}"
        <button @click="$emit('update:searchQuery', '')" class="ml-1 text-blue-600 hover:text-blue-800">×</button>
      </span>
      <span v-if="selectedCategory"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Category: {{ selectedCategory === '__no_category__' ? 'No Category' : selectedCategory }}
        <button @click="$emit('update:selectedCategory', '')"
          class="ml-1 text-green-600 hover:text-green-800">×</button>
      </span>
      <span v-if="selectedStatus"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Status: {{ selectedStatus === 'completed' ? 'Completed' : 'Incomplete' }}
        <button @click="$emit('update:selectedStatus', '')"
          class="ml-1 text-purple-600 hover:text-purple-800">×</button>
      </span>
      <span v-if="selectedDueFilter"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Due: {{ getDueFilterLabel(selectedDueFilter) }}
        <button @click="$emit('update:selectedDueFilter', '')"
          class="ml-1 text-yellow-600 hover:text-yellow-800">×</button>
      </span>
    </div>

    <!-- Results Count -->
    <div v-if="hasActiveFilters" class="mt-2 text-sm text-gray-600">
      Showing {{ filteredTasksCount }} of {{ totalTasksCount }} tasks
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineProps<{
  searchQuery: string
  selectedCategory: string
  selectedStatus: string
  selectedDueFilter: string
  uniqueCategories: string[]
  hasActiveFilters: boolean
  filteredTasksCount: number
  totalTasksCount: number
}>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:selectedCategory': [value: string]
  'update:selectedStatus': [value: string]
  'update:selectedDueFilter': [value: string]
  clearFilters: []
}>()

const getDueFilterLabel = (filter: string) => {
  const labels: Record<string, string> = {
    'overdue': 'Overdue',
    'today': 'Due Today',
    'week': 'Due This Week',
    'month': 'Due This Month'
  }
  return labels[filter] || filter
}
</script>
