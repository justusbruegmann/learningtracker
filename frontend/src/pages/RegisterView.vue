<script setup lang="ts">
import {Button} from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

import { ref} from 'vue'
import {useRouter} from 'vue-router'
import { supabase } from '../supabase.ts'

const router = useRouter()

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function signUp() {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  if (!(password.value === passwordConfirm.value)) {
    errorMsg.value = 'Passwords do not match'
    return;
  }

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    successMsg.value = 'Check your email to confirm your account!'
  }

  loading.value = false
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <Card>
      <card-header>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create an account and start tracking your learning sessions</CardDescription>
      </card-header>
      <card-content>
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input v-model="email" id="email" type="email" placeholder="Max@example.com" />
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input v-model="password" id="password" type="password" placeholder="Password" />
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="passwordRepeat">Repeat Password</Label>
            <Input v-model="passwordConfirm" id="passwordRepeat" type="password" placeholder="Password" />
          </div>
          <div>
            <CardAction>
              <Button @click="signUp" type="submit" :d="loading" class="w-full">
                {{ loading ? 'Signing up...' : 'Sign up' }}
              </Button>
            </CardAction>
          </div>
          <div>
            <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
            <p v-if="successMsg" style="color: green">{{ successMsg }}</p>
          </div>
        </div>
      </card-content>
      <CardFooter>Have an account already?
        <CardAction>
          <Button @click="router.push('/login')" variant="link">Sign in</Button>
        </CardAction>
      </CardFooter>
    </Card>
  </div>
</template>
