<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {Button} from "@/components/ui/button";
import {createSession, endSession, openSession} from "@/scripts/session.ts";

const elapsedSeconds = ref(0)
let intervalId: number | undefined
const isRunning = ref(false)

const key = Object.keys(localStorage).find(k => k.includes('sb-') && k.includes('-auth-token'))
const raw = key ? localStorage.getItem(key) : null
if (!raw) {
  throw "error"
}
const token = JSON.parse(raw).access_token;

function startTimer() {
  if (isRunning.value) return


  createSession(token).then(r => {
    console.log(r);
  })

  isRunning.value = true
  intervalId = window.setInterval(() => {
    elapsedSeconds.value++
  }, 1000)
}

function stopTimer() {
  if (isRunning.value) return
  if (intervalId !== undefined) {
    clearInterval(intervalId)
    intervalId = undefined
  }
  isRunning.value = false
}

function sessionEnd() {
  openSession(token).then((r) => {
    if (typeof r === "number") {
      return
    }
    const id = r.id;
    endSession(token, id).then(() => {
      if (typeof r === "number") {
        return;
      }
      elapsedSeconds.value = 0
      isRunning.value = false
    })
  })
}

onMounted(() => {
  openSession(token).then((r) => {
    if (typeof r === "number") {
      return;
    }

    const date : Date = new Date(r.createdAt);
    const now = new Date().getTime();
    console.log((now - date.getTime()) / 1000);
    elapsedSeconds.value =Math.floor( (now - date.getTime()) / 1000);

    isRunning.value = true
    intervalId = window.setInterval(() => {
      elapsedSeconds.value++
    }, 1000)
  })
})

onBeforeUnmount(() => {
  if (intervalId !== undefined) clearInterval(intervalId)
})

const hours = computed(() => Math.floor(elapsedSeconds.value / 3600))
const minutes = computed(() => Math.floor((elapsedSeconds.value % 3600) / 60))
const seconds = computed(() => elapsedSeconds.value % 60)
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-8">
    <h1 class="text-2xl font-bold">New Session</h1>
    <p class="scale-200">
      {{ String(hours).padStart(2, '0') }} :
      {{ String(minutes).padStart(2, '0') }} :
      {{ String(seconds).padStart(2, '0') }}
    </p>
    <div class="flex gap-2">
      <Button @click="startTimer()">Start Time</Button>
      <Button @click="stopTimer()">Stop Time</Button>
      <Button @click="sessionEnd()">End Session WIP</Button>
    </div>
    <RouterLink to="/dashboard" class="text-sm underline text-muted-foreground">Cancel</RouterLink>
  </div>
</template>
