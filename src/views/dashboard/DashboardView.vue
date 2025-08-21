<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-yellow-400">TO</span><span class="text-green-800">DO</span> List Web App
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Welcome, {{ user?.first_name + ' ' + user?.last_name }}!
            </span>
            <Button variant="outline" @click="handleLogout" :disabled="loading">
              <div v-if="loading" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Logging out...
              </div>
              <span v-else>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'

const { user, logout, loading } = useAuth()

const handleLogout = async () => {
  await logout()
}


</script>