<script setup lang="ts">
import ArticleHeader from './ArticleHeader.vue'
import ArticleBody from './ArticleBody.vue'
import ArticleNavigation from './ArticleNavigation.vue';

defineProps<{
  title: string
	description?: string
	item?: {
		href: string
		label: string
	}[]
}>()

</script>

<template>
	<div>
		<article class="article">
			<ArticleHeader :title="title" :description="description" />
			<ArticleNavigation v-if="item" :items="item" />
			<ArticleBody>
				<slot />
			</ArticleBody>
		</article>
	</div>
</template>
