<script setup lang="ts">
import { useSettingsStore } from '../stores/settings'
import { ref } from 'vue'

const days = [
  { label: 'Mo', value: 1 },
  { label: 'Tu', value: 2 },
  { label: 'We', value: 3 },
  { label: 'Th', value: 4 },
  { label: 'Fr', value: 5 },
  { label: 'Sa', value: 6 },
  { label: 'Su', value: 0 },
]

const settings = useSettingsStore()


const activeDays = ref(settings.activeDays)

function toggleDay(value: number) {
  if (activeDays.value.includes(value)) {
    activeDays.value = activeDays.value.filter(d => d !== value)
  } else {
    activeDays.value.push(value)
  }
  settings.activeDays = activeDays.value  // Store updaten
}
</script>

<template>
  <div>
    <p class="label">Active study days</p>
    <div class="days">
      <button
          v-for="day in days"
          :key="day.value"
          :class="['day', { active: activeDays.includes(day.value) }]"
          @click="toggleDay(day.value)"
      >
        {{ day.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}
.days {
  display: flex;
  gap: 6px;
}
.day {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #444;
  background: transparent;
  color: #aaa;
  font-size: 12px;
  cursor: pointer;
}
.day.active {
  background: #EEEDFE;
  border-color: #AFA9EC;
  color: #3C3489;
  font-weight: 500;
}
</style>