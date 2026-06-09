<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {supabase} from "@/supabase.ts";
import {useSettingsStore} from "@/stores/settings.ts";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import type { User } from "@supabase/supabase-js";
import DailyGoal from "@/components/DailyGoal.vue";
import WeeklyGoal from "@/components/WeeklyGoal.vue";

const settings = useSettingsStore();
const user = ref<User | null>(null)

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    user.value = session.user
    await settings.fetchSettings()
  }
})
</script>


<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div>
      <Card>
        <CardHeader>
          <h1><strong>Profile</strong></h1>
        </CardHeader>
        <CardContent>
          <p><strong>Email:</strong> {{user?.email}}</p>
        </CardContent>
      </Card>
    </div>
    <div class="flex items-center gap-4 mt-8">
      <DailyGoal/>
      <WeeklyGoal/>
    </div>
  </div>
</template>
