<script setup lang="ts">
import { getDownloadUrl } from '../../scripts/utils';
import Button from '../ui/Button.vue';

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps<{
	version: string
}>()
</script>

<style lang="scss" scoped>
@use './header.scss';
</style>

<template>
  <header class="content-header">
		<div>
			<a href="/" class="header-logo">
				<div class="header-logo-icon">
					<img src="/images/button_styled_icons/app.svg" alt="DSL KeyPad Logo">
				</div>
				<p class="header-logo-title" title="Diacritics-Spaces-Letters KeyPad">DSL KeyPad</p>
			</a>
		</div>
		<div class="header-resources">
			Text
		</div>
		<div class="header-buttons">
			<Button variant="download" :href="getDownloadUrl(version)" :icon="{ src: '/images/flat_icons/flat_update.svg', alt: 'Download Icon' }">
				{{ t('download') }}
			</Button>
		</div>
  </header>
</template>
