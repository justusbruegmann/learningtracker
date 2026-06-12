<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {getSessions} from "@/scripts/session.ts";
import DataPanel from "@/components/DataPanel.vue";
import WeeklySessionChart from "@/components/WeeklySessionChart.vue";

import {useSettingsStore} from "@/stores/settings";
import {Progress} from "@/components/ui/progress";


const key = Object.keys(localStorage).find(k => k.includes('sb-') && k.includes('-auth-token'))
const raw = key ? localStorage.getItem(key) : null
if (!raw) {
  throw "error"
}
const token = JSON.parse(raw).access_token;

const sessions = ref<any>([])
const settings = useSettingsStore();

onMounted(() => {
  getSessions(token).then(session => {
    if (typeof session === "number") {
      return
    }
    sessions.value = session;

  })
})

const todaySessions = computed(() => {
  const today = new Date();
  return sessions.value.filter((session: any) => {
    const created = new Date(session.createdAt);
    return (
        created.getFullYear() === today.getFullYear() &&
        created.getMonth() === today.getMonth() &&
        created.getDate() === today.getDate()
    );
  });
});

const todayLearningTime = computed(() => {
  let sum: number = 0;
  todaySessions.value.map((session: any) => {
    sum += session.durationSecs;
  })
  return sum;
})

const weekSessions = computed(() => {
  const today = new Date();
  const startOfWeek = new Date(today);
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;

  startOfWeek.setDate(today.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  return sessions.value.filter((session: any) => {
    const created = new Date(session.createdAt);
    return created >= startOfWeek && created <= endOfToday;
  });
});

const weeklyLearningTime = computed(() => {
  return weekSessions.value.reduce((sum: any, session: any) => {
    return sum + (session.durationSecs || 0);
  }, 0);
});

const dailyProgress = computed(() => {
  return Math.min(100, ((todayLearningTime.value / 60) / settings.dailyGoalMins)*100);
});

const weeklyProgress = computed(() => {
  return Math.min(100, ((weeklyLearningTime.value / 60) / settings.weeklyGoalMins)*100);
});

const weeklyChartData = computed(() => {
  const today = new Date();
  const startOfWeek = new Date(today);
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  startOfWeek.setDate(today.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const totals = [0, 0, 0, 0, 0, 0, 0];

  sessions.value.forEach((session: any) => {
    const created = new Date(session.createdAt);
    if (created < startOfWeek) return;

    const index = created.getDay() === 0 ? 6 : created.getDay() - 1;
    totals[index] += (session.durationSecs ?? 0) / 60;
  });

  return {
    labels,
    totals,
  };
});

</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1>Total </h1>
    <section class="mt-4 flex flex-row gap-4">

      <DataPanel title="Learning time today">
        <template #label>
          <div class="flex items-end gap-1">
      <span class="text-3xl font-bold leading-none">
        {{ String(Math.floor(todayLearningTime / 60)) }}
      </span>
            <span class="text-sm text-muted-foreground pb-1">
        min
      </span>
          </div>
        </template>
      </DataPanel>
      <DataPanel title="Daily goal Progress">
        <template #label>
          <div class="w-full">
            {{ String(Math.floor(todayLearningTime / 60)) + '/' + String(settings.dailyGoalMins)+ 'min' }}
            <Progress :model-value="dailyProgress" class="w-full"/>
          </div>
        </template>
      </Datapanel>
      <DataPanel title="Learning time this week">
        <template #label>
          <div class="flex items-end gap-1">
      <span class="text-3xl font-bold leading-none">
        {{ String(Math.floor(weeklyLearningTime / 60)) }}
      </span>
            <span class="text-sm text-muted-foreground pb-1">
        min
      </span>
          </div>
        </template>
      </DataPanel>
      <DataPanel title="Weekly goal Progress">
        <template #label>
          <div class="w-full">
            {{ String(Math.floor(weeklyLearningTime / 60)) + '/' + String(settings.weeklyGoalMins)+ 'min' }}
            <Progress :model-value="weeklyProgress" class="w-full"/>
          </div>
        </template>
      </DataPanel>
    </section>
    <section class="mt-8">
      <h3>This Week</h3>
      <WeeklySessionChart :labels="weeklyChartData.labels" :values="weeklyChartData.totals"/>
    </section>
  </div>
</template>
