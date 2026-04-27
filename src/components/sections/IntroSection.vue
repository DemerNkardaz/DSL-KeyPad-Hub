<script setup lang="ts">
import { backgroundRandomCharacters } from '../../data/random_character';
import Description from './Description.vue';

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

defineProps<{
	versionedTitle: string
}>()
</script>

<style lang="scss">
@use './intro-section.scss';
</style>

<template>
	<section class="intro-section">
		<div class="intro-section__background">
			<div class="intro-section__background__characters" v-html="scatterBackgroundCharacters()"></div>
			<div class="intro-section__background__gradient"></div>
		</div>
		<div class="intro-section__content">
			<div class="intro-section__content__random-character"></div>
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
