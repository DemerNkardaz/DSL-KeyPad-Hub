<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style lang="scss" src="./main.scss" />

<template>
	<main class="content-main">
		<div class="content-main__features">{{ t('features') }}</div>
		<div class="content-main__content">
			<slot />
		</div>
	</main>
</template>
