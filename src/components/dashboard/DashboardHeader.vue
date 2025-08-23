<template>
  <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <div class="container mx-auto flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
      <!-- Logo/Brand -->
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">

          <div class="hidden sm:block">
            <h1 class="text-xl font-bold">
              <span class="text-yellow-400">TO</span><span class="text-green-800">DO</span> List Web App
            </h1>
          </div>
        </div>
      </div>

      <!-- Desktop Navigation -->
      <div class="ml-auto flex items-center space-x-4">
        <!-- User Info - Hidden on small screens -->
        <div class="hidden md:flex items-center space-x-3">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <span class="text-sm font-medium text-white">
              {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
            </span>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">
              {{ user?.first_name }} {{ user?.last_name }}
            </p>
            <p class="text-xs text-gray-500">{{ user?.email }}</p>
          </div>
        </div>

        <!-- Mobile User Avatar - Visible on small screens -->
        <div class="md:hidden flex items-center">
          <Button variant="ghost" size="sm" class="h-8 w-8 rounded-full p-0">
            <div
              class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <span class="text-xs font-medium text-white">
                {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
              </span>
            </div>
          </Button>
        </div>

        <!-- Logout Button -->
        <Button variant="outline" size="sm" @click="$emit('logout')" :disabled="loading"
          class="relative overflow-hidden transition-all duration-200 hover:shadow-md">
          <div v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span class="hidden sm:inline">Signing out...</span>
            <span class="sm:hidden">...</span>
          </div>
          <div v-else class="flex items-center">
            <svg class="h-4 w-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
              </path>
            </svg>
            <span class="hidden sm:inline">Sign Out</span>
          </div>
        </Button>
      </div>
    </div>

    <!-- Mobile User Info Bar - Visible on small screens when needed -->
    <div class="md:hidden border-t bg-gray-50/50 px-4 py-2">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-900">
            {{ user?.first_name }} {{ user?.last_name }}
          </p>
          <p class="text-xs text-gray-500">{{ user?.email }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <div class="h-2 w-2 rounded-full bg-green-500"></div>
          <span class="text-xs text-gray-500">Online</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
  email_verified_at?: string | undefined
  created_at: string
  updated_at: string
}

defineProps<{
  user: AuthUser | null
  loading: boolean
}>()

defineEmits<{
  logout: []
}>()
</script>
