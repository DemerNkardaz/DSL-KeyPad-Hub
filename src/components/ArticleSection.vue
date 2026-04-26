<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <section class="article-section">
    <h2 v-if="title">{{ title }}</h2>
    <div>
      <slot />
    </div>
  </section>
</template>
