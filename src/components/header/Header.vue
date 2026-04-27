<script setup lang="ts">
import { baseUrl, isWindows, pageWidth } from '../../scripts/constants';
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
			<a :href="baseUrl" class="header-logo">
				<div class="header-logo-icon">
					<img src="/images/button_styled_icons/app.svg" alt="DSL KeyPad Logo">
				</div>
				<p class="header-logo-title" title="Diacritics-Spaces-Letters KeyPad">DSL KeyPad</p>
			</a>
		</div>
		<div class="header-resources-container">
			<a class="header-resource" href="https://github.com/DemerNkardaz/DSL-KeyPad" target="_blank" rel="noopener noreferrer" title="GitHub Repository">
				<img src="/images/resources/github-mark-white.svg" alt="GitHub">
			</a>
			<a v-if="pageWidth >= 550" class="header-resource" href="https://sourceforge.net/projects/dsl-keypad/" target="_blank" rel="noopener noreferrer" title="SourceForge Project Page">
				<img src="https://sourceforge.net/sflogo.php?type=18&group_id=3872678" alt="SourceForge">
			</a>
		</div>
		<div v-if="isWindows" class="header-buttons">
			<Button variant="download" :href="getDownloadUrl(version)" :icon="{ src: '/images/flat_icons/flat_update.svg', alt: 'Download Icon' }">
				{{ t('download') }}
			</Button>
		</div>
  </header>
</template>
