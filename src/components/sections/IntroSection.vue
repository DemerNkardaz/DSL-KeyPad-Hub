<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { backgroundRandomCharacters, randomCharacters } from '../../data/random_character';
import { randomObjectKey } from '../../scripts/utils';
import { locale } from '../../i18n';

import Description from './Description.vue';

type AppLocale = keyof Omit<typeof randomCharacters[keyof typeof randomCharacters], 'item'>

const currentLocale = ref<AppLocale>(locale.value as AppLocale);
const scatterEl = ref<HTMLElement | null>(null);

const randomCharacterEntryID = randomObjectKey(randomCharacters);
const randomCharacterItem = randomCharacters[randomCharacterEntryID].item;
const randomCharacterLocales = randomCharacters[randomCharacterEntryID][currentLocale.value];

let intervalId: number | undefined;

const titleParts = computed(() => {
		const parts = []
		let lastIndex = 0
		const re = /\{([^|]+)\|([^}]+)\}/g
		for (const match of randomCharacterLocales.title.matchAll(re)) {
				if (match.index > lastIndex) {
						parts.push({ type: 'text', value: randomCharacterLocales.title.slice(lastIndex, match.index) })
				}
				parts.push({ type: 'span', text: match[1], title: match[2] })
				lastIndex = match.index + match[0].length
		}
		if (lastIndex < randomCharacterLocales.title.length) {
				parts.push({ type: 'text', value: randomCharacterLocales.title.slice(lastIndex) })
		}
		return parts
})

const subtitleLinks = computed(() => {
    const matches = [...randomCharacterLocales.subtitle.matchAll(/\[([^\]@]+)@([^\]]+)\]/g)]
    return matches.map(m => ({ text: m[1], url: m[2] }))
})

function scatterBackgroundCharacters(characters: string[] | string = backgroundRandomCharacters): string {
	if (Array.isArray(characters)) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		characters = characters[randomIndex];
	}

	const chars = [...characters];
	const totalChars = chars.length;

	const positions: { x: number; y: number; radius: number; }[] = [];
	const minDistanceBase = 8;
	const maxAttempts = 100;

	function hasCollision(x: number, y: number, fontSize: number): boolean {
		const charRadius = fontSize * 1.2;

		for (const pos of positions) {
			const dx = x - pos.x;
			const dy = y - pos.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			const requiredDistance = minDistanceBase + charRadius + pos.radius;

			if (distance < requiredDistance) {
				return true;
			}
		}
		return false;
	}

	function generatePosition(index: number, fontSize: number, attemptNumber: number): { x: number, y: number } {
		let x, y;
		const padding = fontSize * 2;

		if (attemptNumber < maxAttempts * 0.6) {
			const gridSize = Math.ceil(Math.sqrt(totalChars * 1.5));
			const cellWidth = (100 - padding * 2) / gridSize;
			const cellHeight = (100 - padding * 2) / gridSize;

			const cellIndex = (index * 7 + attemptNumber * 3) % (gridSize * gridSize);
			const cellRow = Math.floor(cellIndex / gridSize);
			const cellCol = cellIndex % gridSize;

			const jitterX = (Math.random() - 0.5) * cellWidth * 0.8;
			const jitterY = (Math.random() - 0.5) * cellHeight * 0.8;

			x = padding + cellCol * cellWidth + cellWidth / 2 + jitterX;
			y = padding + cellRow * cellHeight + cellHeight / 2 + jitterY;

		} else if (attemptNumber < maxAttempts * 0.85) {
			const rings = Math.ceil(Math.sqrt(totalChars / 2));
			const angleOffset = (index * 137.5 + attemptNumber * 45) % 360;
			const ringIndex = (index + attemptNumber) % rings;
			const radiusPercent = (ringIndex + 1) / rings;
			const maxRadius = 45

			const angle = angleOffset * Math.PI / 180;
			const radius = 10 + radiusPercent * maxRadius;

			x = 50 + radius * Math.cos(angle);
			y = 50 + radius * Math.sin(angle);

		} else {
			x = padding + Math.random() * (100 - padding * 2);
			y = padding + Math.random() * (100 - padding * 2);
		}

		x = Math.max(padding, Math.min(100 - padding, x));
		y = Math.max(padding, Math.min(100 - padding, y));

		return { x, y };
	}

	const html = chars.map((char, index) => {
		const fontSize = 2 + Math.random() * 2;
		const charRadius = fontSize * 1.2;
		let position = null;

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			const pos = generatePosition(index, fontSize, attempt);

			if (!hasCollision(pos.x, pos.y, fontSize)) {
				position = pos;
				positions.push({
					x: pos.x,
					y: pos.y,
					radius: charRadius
				});
				break;
			}
		}

		if (!position) {
			for (let attempt = 0; attempt < 50; attempt++) {
				const padding = fontSize * 1.5;
				const pos = {
					x: padding + Math.random() * (100 - padding * 2),
					y: padding + Math.random() * (100 - padding * 2)
				};

				if (!hasCollision(pos.x, pos.y, fontSize * 0.8)) {
					position = pos;
					positions.push({
						x: pos.x,
						y: pos.y,
						radius: charRadius
					});
					break;
				}
			}
		}

		if (!position) {
			position = {
				x: 10 + Math.random() * 80,
				y: 10 + Math.random() * 80
			};
			positions.push({
				x: position.x,
				y: position.y,
				radius: charRadius
			});
		}

		const rotation = Math.random() * 360;

		return `<span style="position: absolute; left: ${position.x.toFixed(2)}%; top: ${position.y.toFixed(2)}%; font-size: ${fontSize.toFixed(2)}rem; transform: rotate(${rotation.toFixed(2)}deg); transform-origin: center; white-space: nowrap;">${char}</span>`;
	}).join('');
	return html;
}

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

defineProps<{
	versionedTitle: string
}>()
</script>

<style lang="scss" src="./intro-section.scss" />

<template>
	<section class="intro-section">
		<div class="intro-section__background">
			<div class="intro-section__background__characters" ref="scatterEl" v-html="scatterBackgroundCharacters()"></div>
			<div class="intro-section__background__gradient"></div>
		</div>
		<div class="intro-section__content">
			<div class="intro-section__content__random-character">
				<p class="intro-section__content__random-character__symbol">{{ randomCharacterItem }}</p>
				<p class="intro-section__content__random-character__subtitle">
					<span>
						<template v-for="part of titleParts">
							<span v-if="part.type === 'span'" class="underline-dot question" :title="part.title">{{ part.text }}</span>
							<template v-else>{{ part.value }}</template>
						</template>
					</span>
					<br>
					<span v-if="subtitleLinks.length">
						[
						<template v-for="(link, i) of subtitleLinks">
							<template v-if="i > 0">, </template>
							<a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.text }}</a>
						</template>
						]
					</span>
					<span v-else>
						[
						{{ randomCharacterLocales.subtitle }}
						]
					</span>
				</p>
			</div>
			<h1 class="intro-section__content__header">
				{{ versionedTitle }}
			</h1>
			<div class="intro-section__content__description">
				<Description />
			</div>
		</div>
		<div class="intro-section__decorative-footer-container">
			<div class="intro-section__decorative-footer-wrapper">
				<div class="intro-section__decorative-footer"></div>
			</div>
		</div>
	</section>
</template>
