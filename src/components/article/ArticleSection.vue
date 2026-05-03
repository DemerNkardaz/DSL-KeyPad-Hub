<script setup lang="ts">
import { inject, onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sectionEl = ref<HTMLElement>()

const props = defineProps<{ title: string, id?: string }>()

const state = inject<{ activeSection: string | null, sections: { id: string, label: string }[] }>('activeSection')!

const headerId = (props.id || props.title)?.toLocaleLowerCase()
const sectionId = `${t('articles.id_section')}-${headerId}`

const isActive = computed(() => state.activeSection === sectionId)

onMounted(() => {
	state.sections.push({ id: sectionId, label: props.title })
	if (state.sections.length === 1) {
		state.activeSection = sectionId
	}
})

onUnmounted(() => {
	state.sections = state.sections.filter(s => s.id !== sectionId)
})

function onBeforeEnter(el: Element) {
	(el as HTMLElement).style.height = '0'
	;(el as HTMLElement).style.overflow = 'hidden'
}

function onEnter(el: Element, done: () => void) {
	const h = (el as HTMLElement).scrollHeight
	;(el as HTMLElement).style.transition = 'height 0.3s ease, opacity 0.3s ease'
	;(el as HTMLElement).style.opacity = '0'
	requestAnimationFrame(() => {
		;(el as HTMLElement).style.height = h + 'px'
		;(el as HTMLElement).style.opacity = '1'
	})
	setTimeout(done, 300)
}

function onAfterEnter(el: Element) {
	;(el as HTMLElement).style.height = 'auto'
	;(el as HTMLElement).style.overflow = ''
	;(el as HTMLElement).style.transition = ''
}

function onBeforeLeave(el: Element) {
	;(el as HTMLElement).style.height = (el as HTMLElement).scrollHeight + 'px'
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
	<Transition @before-enter="onBeforeEnter" @enter="onEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave" @leave="onLeave" @after-leave="onAfterLeave">
		<section ref="sectionEl" :id="sectionId" class="article-body__section" v-show="isActive">
			<h3 v-if="title" :id="headerId">{{ title }}</h3>
			<hr>
			<div>
				<slot />
			</div>
		</section>
	</Transition>
</template>
