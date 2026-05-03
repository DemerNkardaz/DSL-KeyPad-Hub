<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <header class="article-header">
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
  </header>
</template>
