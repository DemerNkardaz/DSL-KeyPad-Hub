<script setup lang="ts">
import { provide, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/Button.vue'

const { t } = useI18n()
const state = reactive({
	activeSection: null as string | null,
	sections: [] as { id: string, label: string }[]
})

provide('activeSection', state)

const props = defineProps<{
	title: string
	description?: string
	readingTime?: number
}>()

const displayTime = computed(() => {
	if (!props.readingTime) return null
	const lessThanOneMinute = props.readingTime < 1
	return {
		value: lessThanOneMinute ? Math.round(props.readingTime * 60) : Math.round(props.readingTime),
		unit: lessThanOneMinute ? 'seconds' : 'minutes'
	}
})
</script>

<style lang="scss" src="./ArticlePage.scss" />

<template>
	<article class="article-container">
		<header class="article-header">
			<div class="article-header__title">
				<h2 class="article-header__title-text">{{ title }}</h2>
				<div class="article-header__time" v-if="displayTime">
					<TimeIcon class="article-header__time-icon" />
					<span class="article-header__time-value">{{ displayTime.value }}&nbsp;{{ t(`articles.${displayTime.unit}`) }}</span>
				</div>
			</div>
			<p class="article-header__description" v-if="description">{{ description }}</p>
		</header>
		<div class="article-content">
			<div class="article-sidebar" v-if="state.sections.length">
				<nav class="article-nav" v-if="state.sections.length">
					<ul class="article-nav__list">
						<li class="article-nav__item" v-for="item in state.sections" :key="item.id">
							<Button variant="action" class="article-nav__item__button" :class="{ 'article-nav__item__button--active': item.id === state.activeSection }" @click="state.activeSection = item.id">
								{{ item.label }}
							</Button>
						</li>
					</ul>
				</nav>
			</div>
			<main class="article-body">
				<slot />
			</main>
		</div>
	</article>
</template>
