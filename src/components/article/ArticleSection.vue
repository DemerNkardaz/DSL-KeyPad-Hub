<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ title: string, id?: string }>()

const state = inject<{ activeSection: string | null, sections: { id: string, label: string }[] }>('activeSection')!

const sectionId = `${t('articles.id_section')}-${(props.id || props.title)?.toLocaleLowerCase()}`

onMounted(() => {
  state.sections.push({ id: sectionId, label: props.title })
})

onUnmounted(() => {
  state.sections = state.sections.filter(s => s.id !== sectionId)
})
</script>

<template>
	<section :id="sectionId" class="article-body__section">
		<h3 v-if="title" :id="sectionId">{{ title }}</h3>
		<hr>
		<div>
			<slot />
		</div>
	</section>
</template>
