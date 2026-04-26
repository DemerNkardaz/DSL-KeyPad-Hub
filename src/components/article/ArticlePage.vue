<script setup lang="ts">
import ArticleHeader from './ArticleHeader.vue'
import ArticleBody from './ArticleBody.vue'
import ArticleNavigation from './ArticleNavigation.vue';

defineProps<{
  title: string
  description?: string
}>()


const items = [
  { href: '#intro', label: 'Intro' },
  { href: '#install', label: 'Installation' },
  { href: '#usage', label: 'Usage' }
]
</script>

<template>
	<div>
		<article class="article">
			<ArticleHeader :title="title" :description="description" />
			<ArticleNavigation :items="items" />
			<ArticleBody>
				<slot />
			</ArticleBody>
		</article>
	</div>
</template>
