<script setup lang="ts">
defineProps<{
	versionedTitle: string
}>()
</script>

<style lang="scss" scoped>
@use './intro-section.scss';
</style>

<template>
	<section class="intro-section">
		<div class="intro-section-background">
			<div class="intro-section-background-characters"></div>
			<div class="intro-section-background-gradient"></div>
		</div>
		<div class="intro-section-content">
			<div class="intro-section-random-character"></div>
			<div class="intro-section-header">{{ versionedTitle }}</div>
			<div class="intro-section-description"></div>
		</div>
		<div class="intro-section-decorative-footer-container">
			<div class="intro-section-decorative-footer-wrapper">
				<div class="intro-section-decorative-footer"></div>
			</div>
		</div>
	</section>
</template>
