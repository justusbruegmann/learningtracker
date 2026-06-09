<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  labels: string[];
  values: number[];
}>();

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: "Learning time (mins)",
      data: props.values,
      backgroundColor: "#3b82f6",
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#afafaf", // legend text color
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#afafaf", // x-axis labels color
      },
    },
    y: {
      ticks: {
        color: "#afafaf", // y-axis labels color
      },
    },
  },
};
</script>

<template>
  <div class="h-64 w-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>