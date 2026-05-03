<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useScatteredCharacters } from '@/scripts/composables/useScatteredCharacters';
import { toRef } from 'vue'

const props = defineProps<{
	customCharacters?: string
}>()

const { placedChars } = useScatteredCharacters(
  toRef(props, 'customCharacters')
)


const scatterEl = ref<HTMLElement | null>(null);
let intervalId: number | undefined;

function animateScatterCollapse(element: HTMLElement, duration = 20000): void {
	const collapseAnim = element.animate([
		{ width: '100%' },
		{ width: '0%' }
	], {
		duration: duration,
		easing: 'cubic-bezier(0.4, 0, 1, 1)',
		fill: 'forwards'
	});

	collapseAnim.onfinish = () => {
		const spans = element.querySelectorAll('span');
		spans.forEach(span => {
			const currentLeft = parseFloat(span.style.left);
			span.style.left = `${100 - currentLeft}%`;
		});

		element.animate([
			{ width: '0%' },
			{ width: '100%' }
		], {
			duration: duration,
			easing: 'cubic-bezier(0, 0, 0.6, 1)',
			fill: 'forwards'
		});
	};
}

function initScatterCollapse(): void {
	if (!scatterEl.value) return;

	const startDelay = 20000;

	setTimeout(() => {
		if (!scatterEl.value) return;

		animateScatterCollapse(scatterEl.value, 20000);

		intervalId = setInterval(() => {
			if (scatterEl.value) {
				animateScatterCollapse(scatterEl.value, 20000);
			}
		}, 40000);
	}, startDelay);
}

onMounted(() => {
	initScatterCollapse();
});

onBeforeUnmount(() => {
	if (intervalId) clearInterval(intervalId);
});

</script>

<style scoped lang="scss">
.background-scattered-characters-wrapper {
	position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>

<template>
	<div class="background-scattered-characters-wrapper" ref="scatterEl">
		<span
			v-for="(item, i) in placedChars"
			:key="i"
			:style="{
				position: 'absolute',
				left: item.x.toFixed(2) + '%',
				top: item.y.toFixed(2) + '%',
				fontSize: item.fontSize.toFixed(2) + 'rem',
				transform: `rotate(${item.rotation.toFixed(2)}deg)`,
				transformOrigin: 'center',
				whiteSpace: 'nowrap',
			}"
		>{{ item.char }}</span>
	</div>
</template>
