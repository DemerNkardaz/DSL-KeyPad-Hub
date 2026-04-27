<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

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
			<div class="intro-section__background__characters"></div>
			<div class="intro-section__background__gradient"></div>
		</div>
		<div class="intro-section__content">
			<div class="intro-section__content__random-character"></div>
			<h1 class="intro-section__content__header">
				{{ versionedTitle }}
			</h1>
			<div class="intro-section__content__description">
				<span v-html="t('description.text')"></span>
				<span class="italic title-small" v-html="t('description.requirement')"></span>
			</div>
		</div>
		<div class="intro-section__decorative-footer-container">
			<div class="intro-section__decorative-footer-wrapper">
				<div class="intro-section__decorative-footer"></div>
			</div>
		</div>
	</section>
</template>
