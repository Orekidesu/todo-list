<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          <span class="text-yellow-400">TO</span><span class="text-green-800">DO</span> List Web App
        </h2>
        <h2 class="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/login" class="font-medium text-primary hover:text-primary/90">
            sign in to your existing account
          </router-link>
        </p>
      </div>

      <Card class="p-6">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div v-if="error" class="bg-destructive/10 border border-destructive rounded-md p-3">
            <p class="text-sm text-destructive">{{ error }}</p>
          </div>

          <div v-if="validationErrors" class="bg-destructive/10 border border-destructive rounded-md p-3">
            <ul class="text-sm text-destructive space-y-1">
              <li v-for="(fieldErrors, field) in validationErrors" :key="field">
                <span v-for="errorMsg in fieldErrors" :key="errorMsg">
                  {{ errorMsg }}
                </span>
              </li>
            </ul>
          </div>

          <div class="space-y-4">
            <div>
              <Label for="first_name">First name</Label>
              <Input id="first_name" v-model="form.first_name" type="text" autocomplete="name" required
                placeholder="Enter your first name" class="mt-1" :disabled="loading" />
            </div>
            <div>
              <Label for="last_name">Last name</Label>
              <Input id="last_name" v-model="form.last_name" type="text" autocomplete="name" required
                placeholder="Enter your last name" class="mt-1" :disabled="loading" />
            </div>

            <div>
              <Label for="email">Email address</Label>
              <Input id="email" v-model="form.email" type="email" autocomplete="email" required
                placeholder="Enter your email" class="mt-1" :disabled="loading" />
            </div>

            <div>
              <Label for="password">Password</Label>
              <Input id="password" v-model="form.password" type="password" autocomplete="new-password" required
                placeholder="Create a password" class="mt-1" :disabled="loading" />
              <p class="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <Label for="password_confirmation">Confirm password</Label>
              <Input id="password_confirmation" v-model="form.password_confirmation" type="password"
                autocomplete="new-password" required placeholder="Confirm your password" class="mt-1"
                :disabled="loading" />
            </div>
          </div>



          <Button type="submit" class="w-full" :disabled="loading">
            <div v-if="loading" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating account...
            </div>
            <span v-else>Create account</span>
          </Button>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RegisterForm {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
}

const { register, loading, error } = useAuth()
const validationErrors = ref<Record<string, string[]> | null>(null)

const form = reactive<RegisterForm>({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const handleRegister = async () => {
  validationErrors.value = null

  const result = await register({
    first_name: form.first_name,
    last_name: form.last_name,
    email: form.email,
    password: form.password,
    password_confirmation: form.password_confirmation
  })

  if (!result.success && result.errors) {
    validationErrors.value = result.errors
  }
}
</script>