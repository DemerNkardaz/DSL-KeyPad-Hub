<script setup lang="ts">
import { type Component, computed, type ConcreteComponent } from 'vue';
import { pathWithBase } from '../../scripts/utils';

const props = defineProps<{
	variant: 'download' | 'external' | 'action'
	href?: string
	icon?: { src: string, alt: string } | Component | ConcreteComponent | string
	btnStyle?: string
}>()

const isComponentIcon = computed(() =>
  typeof props.icon === 'function' || (typeof props.icon === 'object' && !('src' in props.icon))
)

const emit = defineEmits<{
	(e: 'click'): void
}>()
</script>

<style lang="scss" src="./button.scss" />

<template>
	<a v-if="variant === 'download'" :href="href" class="btn" :style="btnStyle" download>
		<span v-if="icon" class="btn__icon">
			<component :is="icon" v-if="isComponentIcon" />
			<img v-else :src="pathWithBase((icon as any).src)" :alt="(icon as any).alt" />
		</span>
		<span class="btn__label"><slot /></span>
	</a>

	<a v-else-if="variant === 'external'" :href="href" class="btn" :style="btnStyle" target="_blank" rel="noopener noreferrer">
		<span v-if="icon" class="btn__icon">
			<component :is="icon" v-if="isComponentIcon" />
			<img v-else :src="pathWithBase((icon as any).src)" :alt="(icon as any).alt" />
		</span>
		<span class="btn__label"><slot /></span>
	</a>

	<button v-else type="button" class="btn" :style="btnStyle" @click="emit('click')">
		<span v-if="icon" class="btn__icon">
			<component :is="icon" v-if="isComponentIcon" />
			<img v-else :src="pathWithBase((icon as any).src)" :alt="(icon as any).alt" />
		</span>
		<span class="btn__label"><slot /></span>
	</button>
</template>
