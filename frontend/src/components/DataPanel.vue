<script setup lang="ts">
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

defineProps({
  title: String,
  label: String,
});
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      {{ title }}
    </CardHeader>

    <CardFooter>
      <slot name="label">
        <span class="text-base">
          {{ label }}
        </span>
      </slot>
    </CardFooter>
  </Card>
</template>