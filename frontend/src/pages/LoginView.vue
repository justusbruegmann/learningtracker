<script setup lang="ts">
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { supabase } from '../supabase'


//TODO: add reset password
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function signIn() {
  loading.value = true
  errorMsg.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    await router.push('/dashboard')
  }

  loading.value = false
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <Card>
      <card-header>
        <CardTitle>Login</CardTitle>
        <CardDescription>Log in and track your leaning Sessions</CardDescription>
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
          <div>
            <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
          </div>
          <div>
            <CardAction>
              <Button @click="signIn" :disabled="loading"  class="w-full">
                {{ loading ? 'Logging in...' : 'Login' }}
              </Button>

            </CardAction>
          </div>
        </div>
      </card-content>
      <CardFooter>Dont have an account?
        <CardAction>
          <Button @click="router.push('/register')" variant="link">Sign up</Button>
        </CardAction>
      </CardFooter>
    </Card>
  </div>
</template>
