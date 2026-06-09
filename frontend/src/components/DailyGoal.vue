<script setup lang="ts">
import {useSettingsStore} from "@/stores/settings.ts";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import DaysInput from "@/components/DaysInput.vue";
import { storeToRefs } from 'pinia'

const settings = useSettingsStore()
const { dailyGoalMins } = storeToRefs(settings)

function save() {
  settings.saveSettings({ dailyGoalMins: dailyGoalMins.value, activeDays: settings.activeDays })
}

</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <h1>Daily goal</h1>
    </CardHeader>
    <CardContent>
      <div>
        Study time per day
        <div class="flex flex-row gap-x-2">
          <Input type="number" v-model="dailyGoalMins"/>
          <p class="pt-2.5 text-gray-400">min</p>
        </div>
        <div>
      </div>
        <DaysInput/>
      </div>
      <div lang="pt-4">
        <Button type="button" @click="save">Save</Button>

      </div>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>