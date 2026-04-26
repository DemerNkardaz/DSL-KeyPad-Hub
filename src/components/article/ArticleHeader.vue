<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <header class="article-header">
    <h1>{{ title }}</h1>
    <p v-if="description">{{ description }}</p>
  </header>
</template>
