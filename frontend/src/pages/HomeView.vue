<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-6">
    <h1 class="text-4xl font-bold">StudyFlow</h1>
    <p class="text-muted-foreground">Track your study sessions effortlessly.</p>
    <div class="flex gap-3">
      <RouterLink to="/login" class="px-4 py-2 bg-primary text-primary-foreground rounded-md">
        Sign in
      </RouterLink>
      <RouterLink to="/register" class="px-4 py-2 border rounded-md hover:bg-accent transition-colors">
        Sign up
      </RouterLink>
    </div>
  </div>
</template>
