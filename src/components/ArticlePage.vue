<script setup lang="ts">
import ArticleHeader from './ArticleHeader.vue'
import ArticleBody from './ArticleBody.vue'

defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <article class="article">
    <ArticleHeader :title="title" :description="description" />
    <ArticleBody>
      <slot />
    </ArticleBody>
  </article>
</template>
