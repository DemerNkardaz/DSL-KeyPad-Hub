<script setup lang="ts">
import { inject, computed, useSlots, type ComputedRef } from 'vue'
import { locale } from '@/i18n'
import { articlesMeta } from '@/content/articles'
import { createArticleUrl } from '@/scripts/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
	level?: 1 | 2 | 3 | 4 | 5 | 6
	text?: string
}>()

const slots = useSlots()

const articleState = inject<{ activeArticle: string | null }>('activeArticle')!
const parentSectionTitle = inject<ComputedRef<string>>('parentSectionTitle', computed(() => ''))

const textContent = computed(() =>
	props.text ||
	slots.default?.()
		.map(vnode => typeof vnode.children === 'string' ? vnode.children : '')
		.join('') ||
	''
)
const headerId = computed(() =>
	textContent.value.toLowerCase().replace(/\s+/g, '-')
)

const articleTitle = computed(() => {
	const id = articleState.activeArticle
	if (!id) return ''
	return articlesMeta[id]?.[locale.value]?.title ?? id
})

const headingUrl = computed(() => {
	if (!articleState.activeArticle || !textContent.value) return ''
	return createArticleUrl(
		locale.value,
		articleTitle.value,
		parentSectionTitle.value,
		textContent.value
	)
})

function onCopyLinkClick(e: MouseEvent) {
	if (e.button === 1) return
	e.preventDefault()
	navigator.clipboard.writeText(headingUrl.value)
}
</script>

<template>
	<div class="article-body__heading">
		<component :is="`h${level ?? 3}`" :id="headerId" class="article-body__heading__text">
			<template v-if="text">{{ text }}</template>
			<slot v-else />
		</component>
		<a :href="headingUrl" class="article-body__heading__link" @click="onCopyLinkClick" :title="t('copy_link')">
			<CopyLinkIcon class="article-body__heading__link__icon" />
		</a>
	</div>
</template>
