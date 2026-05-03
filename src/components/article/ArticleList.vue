<script setup lang="ts">
import { articlesRegistry, articlesMeta } from '@/content/articles';
import { locale } from '@/i18n';
import { baseUrl } from '@/scripts/constants';
import { inject } from 'vue';

function resolveImage(image: string | undefined, lang: string): string | undefined {
	if (!image) return undefined
	const hasExtension = /\.[a-z]+$/i.test(image)
	const filename = hasExtension ? image : `${image}_thumb.avif`
	return `${baseUrl}images/articles/${lang}/${filename}`
}

const state = inject<{ activeArticle: string | null }>('activeArticle')!
</script>

<style lang="scss" src="./ArticleList.scss" />

<template>
	<div class="article-list-container">
		<div class="article-list">
			<div class="article-list__item" v-for="article in articlesRegistry" :key="article" @click="state.activeArticle = article">
				<div class="article-list__item-image-container">
					<img  v-if="articlesMeta[article]?.[locale]?.image" :src="resolveImage(articlesMeta[article]?.[locale]?.image, locale)" :alt="articlesMeta[article]?.[locale]?.title || article" class="article-list__item-image" />
					<div v-else class="article-list__item-placeholder" :class="articlesMeta[article]?.[locale]?.class"><slot name="placeholder" /></div>
				</div>
				<div class="article-list__item-content">
					<h3 class="article-list__item-title">{{ articlesMeta[article]?.[locale]?.title || article }}</h3>
					<p class="article-list__item-description">{{ articlesMeta[article]?.[locale]?.description || 'No description available.' }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
