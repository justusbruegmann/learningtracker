<script setup lang="ts">
import {CardHeader, Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"

import {ref} from "vue"
import {useSettingsStore} from "@/stores/settings";

const settings = useSettingsStore()

const weeklyGoal = ref<number>(settings.weeklyGoalMins);

function save() {
  settings.saveSettings({ weeklyGoalMins: weeklyGoal.value })
}
</script>

<template>
  <Card class="w-full max-h-72">
    <CardHeader>
      <h1>Weekly goal</h1>
    </CardHeader>
    <CardContent>
      <h4>Weekly Goal</h4>
      <div class="flex flex-row gap-2">
        <Input v-model="weeklyGoal"/>
        <p class="pt-2.5 text-gray-400">min</p>
      </div>
      <br>
      <br>
      <br>

      <div>
        <Button @click="save">Save</Button>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>