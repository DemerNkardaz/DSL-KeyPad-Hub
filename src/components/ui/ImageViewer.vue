<script setup lang="ts">
defineProps<{
	src: string
	alt?: string
}>()

const emit = defineEmits<{
	(e: 'close'): void
}>()

function onBackdropClick(e: MouseEvent) {
	if (e.target === e.currentTarget) emit('close')
}
</script>

<style lang="scss" src="./ImageViewer.scss" />

<template>
	<Teleport to="body">
		<div class="image-viewer" @click="onBackdropClick">
			<div class="image-viewer__content">
				<button class="image-viewer__close" @click="emit('close')" >
					<CloseIcon class="image-viewer__close-icon" />
				</button>
				<img :src="src" :alt="alt || 'Image'" class="image-viewer__img" />
			</div>
		</div>
	</Teleport>
</template>
