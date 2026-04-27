<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style lang="scss">
@use './main.scss';
</style>

<template>
	<main class="content-main">
		<div class="content-main__features">{{ t('features') }}</div>
		<slot />
	</main>
</template>
