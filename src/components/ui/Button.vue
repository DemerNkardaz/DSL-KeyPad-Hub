<script setup lang="ts">
import { pathWithBase } from '../../scripts/utils';

defineProps<{
	variant: 'download' | 'external' | 'action'
	href?: string
	icon?: { src: string, alt: string }
	btnClass?: string
	btnStyle?: string
}>()

const emit = defineEmits<{
	(e: 'click'): void
}>()
</script>

<style lang="scss" src="./button.scss" />

<template>
	<a v-if="variant === 'download'" :href="href" :class="'btn' + (btnClass ? ` ${btnClass}` : '') " :style="btnStyle" download>
		<span v-if="icon" class="btn__icon">
			<img :src="pathWithBase(icon.src)" :alt="icon.alt" />
		</span>
		<span class="btn__label"><slot /></span>
	</a>

	<a v-else-if="variant === 'external'" :href="href" :class="'btn' + (btnClass ? ` ${btnClass}` : '') " :style="btnStyle" target="_blank" rel="noopener noreferrer">
		<span v-if="icon" class="btn__icon">
			<img :src="pathWithBase(icon.src)" :alt="icon.alt" />
		</span>
		<span class="btn__label"><slot /></span>
	</a>

	<button v-else type="button" :class="'btn' + (btnClass ? ` ${btnClass}` : '') " :style="btnStyle" @click="emit('click')">
		<span v-if="icon" class="btn__icon">
			<img :src="pathWithBase(icon.src)" :alt="icon.alt" />
		</span>
		<span class="btn__label"><slot /></span>
	</button>
</template>
