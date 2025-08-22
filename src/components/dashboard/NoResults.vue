<template>
  <div class="text-center py-12">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
    <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks match your filters</h3>
    <p class="mt-1 text-sm text-gray-500">Try adjusting your search criteria or clear the filters.</p>
    <div class="mt-6">
      <Button variant="outline" @click="$emit('clearFilters')">
        Clear All Filters
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineEmits<{
  clearFilters: []
}>()
</script>
