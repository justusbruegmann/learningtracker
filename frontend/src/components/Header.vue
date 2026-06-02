<script setup>
import {Button} from "@/components/ui/button"
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()
const route = useRoute()


async function signOut() {
  await supabase.auth.signOut()
  await router.push('/login')
}
</script>

<template>
  <header>
    <div class="flex justify-between items-center pb-5">
      <span class="pt-2 pl-8">Studyflow</span>

      <nav>
        <Button
            variant="link"
            :class="{ 'underline': route.path === '/dashboard' }"
            @click="router.push('/dashboard')"
        >Dashboard</Button>

        <Button
            variant="link"
            :class="{ 'underline': route.path === '/session' }"
            @click="router.push('/session/new')"
        >Sessions</Button>
      </nav>

      <Button class="mt-2 mr-8 w-24" @click="signOut">Logout</Button>
    </div>

  </header>
</template>

<style scoped>

</style>