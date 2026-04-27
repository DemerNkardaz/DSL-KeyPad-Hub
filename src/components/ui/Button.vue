<script setup lang="ts">
import { pathWithBase } from '../../scripts/utils';

defineProps<{
	variant: 'download' | 'external' | 'action'
	href?: string
	icon?: { src: string, alt: string }
}>()

const emit = defineEmits<{
	(e: 'click'): void
}>()
</script>

<style lang="scss" scoped>
@use './button.scss';
</style>

<template>
	<a v-if="variant === 'download'" :href="href" class="btn" download>
		<span v-if="icon" class="button-icon">
			<img :src="pathWithBase(icon.src)" :alt="icon.alt" />
		</span>
		<span class="button-label"><slot /></span>
	</a>

	<a v-else-if="variant === 'external'" :href="href" class="btn" target="_blank" rel="noopener noreferrer">
		<span v-if="icon" class="button-icon">
			<img :src="pathWithBase(icon.src)" :alt="icon.alt" />
		</span>
		<span class="button-label"><slot /></span>
	</a>

	<button v-else type="button" class="btn" @click="emit('click')">
		<span v-if="icon" class="button-icon">
			<img :src="pathWithBase(icon.src)" :alt="icon.alt" />
		</span>
		<span class="button-label"><slot /></span>
	</button>
</template>
