<script setup lang="ts">
import { locale } from '@/i18n'
import { articlesMeta } from '@/content/articles'
import { createArticleUrl } from '@/scripts/utils'
import { inject, onMounted, onUnmounted, computed, useSlots, type ComputedRef, nextTick, provide } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineOptions({ name: 'ArticleSection' })

const props = defineProps<{ title: string, id?: string, isSubSection?: boolean }>()

const state = inject<{ activeSection: string | null, sections: { id: string, label: string }[] }>('activeSection')!
const articleState = inject<{ activeArticle: string | null }>('activeArticle')!

const headerId = (props.id || props.title)?.toLocaleLowerCase().replace(/\s+/g, '-')
const sectionId = `${t(`articles.id_${props.isSubSection ? 'subsection' : 'section'}`)}-${headerId}`

const isActive = computed(() => props.isSubSection || state.activeSection === sectionId)

const slots = useSlots()
const slotNodes = computed(() => slots.default?.() ?? [])

const groupedNodes = computed(() => {
	const groups: { isSection: boolean, nodes: any[] }[] = []
	for (const vnode of slotNodes.value) {
		const isSection = (vnode.type as any)?.name === 'ArticleSection'
		if (isSection) {
			groups.push({ isSection: true, nodes: [vnode] })
		} else {
			const last = groups[groups.length - 1]
			if (last && !last.isSection) {
				last.nodes.push(vnode)
			} else {
				groups.push({ isSection: false, nodes: [vnode] })
			}
		}
	}
	return groups
})

const pendingSection = inject<ComputedRef<string | null>>('pendingSection', computed(() => null))
const pendingHeader = inject<ComputedRef<string | null>>('pendingHeader', computed(() => null))

if (!props.isSubSection) {
	provide('parentSectionTitle', computed(() => props.title))
}
const parentSectionTitle = inject<ComputedRef<string>>('parentSectionTitle', computed(() => ''))

const articleTitle = computed(() => {
	const id = articleState.activeArticle
	if (!id) return ''
	return articlesMeta[id]?.[locale.value]?.title ?? id
})

const sectionUrl = computed(() => {
	if (!articleState.activeArticle) return ''
	return createArticleUrl(
		locale.value,
		articleTitle.value,
		props.isSubSection ? parentSectionTitle.value : props.title,
		props.isSubSection ? props.title : undefined
	)
})

function onCopyLinkClick(e: MouseEvent) {
	if (e.button === 1) return
	e.preventDefault()
	navigator.clipboard.writeText(sectionUrl.value)
}

const scrollToPendingHeader = () => {
	const headerQuery = pendingHeader.value
	if (!headerQuery) return

	requestAnimationFrame(() => {
		const sectionEl = document.getElementById(sectionId)
		if (!sectionEl) return

		const headers = sectionEl.querySelectorAll('h1, h2, h3, h4, h5, h6')
		const target = Array.from(headers).find(h =>
			h.id.toLowerCase().includes(headerQuery.toLowerCase()) ||
			h.textContent?.toLowerCase().includes(headerQuery.toLowerCase())
		)

		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	})
}

onMounted(() => {
	if (!props.isSubSection) {
		state.sections.push({ id: sectionId, label: props.title })

		if (state.sections.length === 1) {
			state.activeSection = sectionId
		}

		nextTick(() => {
			const pending = pendingSection.value
			if (!pending) return

			const asIndex = parseInt(pending)
			const target = !isNaN(asIndex)
				? state.sections[asIndex]
				: state.sections.find(s => s.id.toLowerCase().includes(pending.toLowerCase()))

			if (target) {
				state.activeSection = target.id
			}
		})
	}
})

onUnmounted(() => {
	if (!props.isSubSection) {
		state.sections = state.sections.filter(s => s.id !== sectionId)
	}
})

function onBeforeEnter(el: Element) {
	(el as HTMLElement).style.height = '0'
	;(el as HTMLElement).style.overflow = 'hidden'
	;(el as HTMLElement).style.opacity = '0'
}

function onEnter(el: Element, done: () => void) {
	const html = el as HTMLElement

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			const h = html.scrollHeight
			html.style.transition = 'height 0.3s ease, opacity 0.3s ease'
			html.style.height = h + 'px'
			html.style.opacity = '1'
		})
	})

	const onEnd = () => {
		el.removeEventListener('transitionend', onEnd)
		done()
	}
	el.addEventListener('transitionend', onEnd)

	setTimeout(done, 400)
}

function onAfterEnter(el: Element) {
	;(el as HTMLElement).style.height = 'auto'
	;(el as HTMLElement).style.overflow = ''
	;(el as HTMLElement).style.transition = ''
	scrollToPendingHeader()
}

function onBeforeLeave(el: Element) {
	(el as HTMLElement).style.height = (el as HTMLElement).scrollHeight + 'px'
	;(el as HTMLElement).style.overflow = 'hidden'
}

function onLeave(el: Element, done: () => void) {
	;(el as HTMLElement).style.transition = 'height 0.3s ease, opacity 0.3s ease'
	requestAnimationFrame(() => {
		;(el as HTMLElement).style.height = '0'
		;(el as HTMLElement).style.opacity = '0'
	})
	setTimeout(done, 300)
}

function onAfterLeave(el: Element) {
	;(el as HTMLElement).style.height = ''
	;(el as HTMLElement).style.opacity = ''
	;(el as HTMLElement).style.transition = ''
	;(el as HTMLElement).style.overflow = ''
}
</script>

<template>
	<Transition
		@before-enter="onBeforeEnter"
		@enter="onEnter"
		@after-enter="onAfterEnter"
		@before-leave="onBeforeLeave"
		@leave="onLeave"
		@after-leave="onAfterLeave"
	>
		<section
			v-show="isActive"
			:id="sectionId"
			class="article-body__section"
			:class="{ 'article-body__section__sub': isSubSection }"
		>
			<div class="article-body__section-title">
				<h3 class="article-body__section-title__text" v-if="title" :id="headerId">{{ title }}</h3>
				<a :href="sectionUrl" class="article-body__section-title__link" @click="onCopyLinkClick" :title="t('copy_link')">
					<CopyLinkIcon class="article-body__section-title__link__icon" />
				</a>
			</div>
			<hr>
			<template v-for="(group, i) in groupedNodes" :key="i">
				<component :is="group.nodes[0]" v-if="group.isSection" />
				<section class="article-body__section__content" v-else>
					<component :is="vnode" v-for="(vnode, j) in group.nodes" :key="j" />
				</section>
			</template>
		</section>
	</Transition>
</template>
