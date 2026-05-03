<script setup lang="ts">
import { locale } from '@/i18n'
import { resolveImage } from '@/scripts/utils'
import { ref } from 'vue'
import ImageViewer from '@/components/ui/ImageViewer.vue'

const props = defineProps<{
	src: string
	alt?: string
	caption?: string
	float?: 'left' | 'right' | 'none'
	align?: 'left' | 'center' | 'right'
	width?: string
	srcOrigin?: string
}>()

const viewerOpen = ref(false)
</script>

<style lang="scss" src="./ArticleImage.scss" />

<template>
	<figure
		class="article-image"
		:class="[ float && float !== 'none' ? `article-image--float-${float}` : '', align ? `article-image--align-${align}` : '', srcOrigin ? 'article-image--clickable' : '' ]"
		:style="{ width: width || 'auto' }"
		@click="srcOrigin ? viewerOpen = true : null">
		<img :src="resolveImage(src, locale, 'medium')" :alt="alt || caption || 'Article Image'" class="article-image__img" />
		<figcaption v-if="caption" class="article-image__caption">{{ caption }}</figcaption>
	</figure>

	<ImageViewer v-if="srcOrigin && viewerOpen" :src="resolveImage(`${src}.${srcOrigin}`, locale)!" :alt="alt || caption" @close="viewerOpen = false" />
</template>
