<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-primary hover:text-primary/90">
            create a new account
          </router-link>
        </p>
      </div>

      <Card class="p-6">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="bg-destructive/10 border border-destructive rounded-md p-3">
            <p class="text-sm text-destructive">{{ error }}</p>
          </div>

          <div class="space-y-4">
            <div>
              <Label for="email">Email address</Label>
              <Input id="email" v-model="form.email" type="email" autocomplete="email" required
                placeholder="Enter your email" class="mt-1" :disabled="loading" />
            </div>

            <div>
              <Label for="password">Password</Label>
              <Input id="password" v-model="form.password" type="password" autocomplete="current-password" required
                placeholder="Enter your password" class="mt-1" :disabled="loading" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" v-model="form.remember" name="remember-me" type="checkbox"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
              <Label for="remember-me" class="ml-2 text-sm">
                Remember me
              </Label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary hover:text-primary/90">
                Forgot your password?
              </a>
            </div>
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            <div v-if="loading" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
            <span v-else>Sign in</span>
          </Button>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

const { login, loading, error } = useAuth()

const form = reactive<LoginForm>({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  await login({
    email: form.email,
    password: form.password
  })
}
</script>