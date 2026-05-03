<script setup lang="ts">
import { provide, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

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

<style lang="scss" src="./article.scss" />

<template>
	<div>
		<article class="content-article">
			<header class="article-header">
				<div>
					<h2>{{ title }}</h2>
					<p v-if="displayTime">{{ displayTime.value }}&nbsp;{{ t(`articles.${displayTime.unit}`) }}</p>
				</div>
				<p v-if="description">{{ description }}</p>
			</header>
			<nav v-if="state.sections.length">
				<ul>
					<li v-for="item in state.sections" :key="item.id">
						<button @click="state.activeSection = item.id">{{ item.label }}</button>
					</li>
				</ul>
			</nav>
			<main class="article-body">
				<slot />
			</main>
		</article>
	</div>
</template>
