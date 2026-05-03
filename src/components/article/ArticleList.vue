<script setup lang="ts">
import { articlesRegistry, articlesMeta } from '@/content/articles'
import { locale } from '@/i18n'
import { resolveImage } from '@/scripts/utils'
import { inject, ref, computed } from 'vue'

const state = inject<{ activeArticle: string | null }>('activeArticle')!
const isCompact = computed(() => !!state.activeArticle)

const listEl = ref<HTMLElement>()
function scroll(dir: 'left' | 'right') {
	if (!listEl.value) return
	listEl.value.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
}

let startX = 0

function onTouchStart(e: TouchEvent) {
	startX = e.touches[0].clientX
}

function onTouchEnd(e: TouchEvent) {
	const diff = startX - e.changedTouches[0].clientX
	if (Math.abs(diff) > 50) scroll(diff > 0 ? 'right' : 'left')
}

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style lang="scss" src="./ArticleList.scss" />

<template>
	<div class="article-list-container" :class="{ 'article-list-container--compact': isCompact }">
		<button v-if="isCompact" class="article-list__scroll-btn article-list__scroll-btn--left" @click="scroll('left')">
			<ArrowIcon class="article-list__scroll-btn-icon rotate-180" />
		</button>
		<div class="article-list" ref="listEl" @touchstart="onTouchStart" @touchend="onTouchEnd">
			<div class="article-list__item" v-for="article in articlesRegistry" :key="article" @click="state.activeArticle = article" :class="{ 'article-list__item--active': state.activeArticle === article }">
				<div class="article-list__item-image-container">
					<img v-if="articlesMeta[article]?.[locale]?.image" :src="resolveImage(articlesMeta[article]?.[locale]?.image, locale)" :alt="articlesMeta[article]?.[locale]?.title || article" class="article-list__item-image" />
					<div v-else class="article-list__item-placeholder" :class="articlesMeta[article]?.[locale]?.class"><slot name="placeholder" /></div>
				</div>
				<div class="article-list__item-content">
					<h3 class="article-list__item-title">{{ articlesMeta[article]?.[locale]?.title || article }}</h3>
					<p class="article-list__item-description">{{ articlesMeta[article]?.[locale]?.description || 'No description available.' }}</p>
				</div>
			</div>
		</div>
		<button v-if="isCompact" class="article-list__scroll-btn article-list__scroll-btn--right" @click="scroll('right')">
			<ArrowIcon class="article-list__scroll-btn-icon" />
		</button>
	</div>
</template>
