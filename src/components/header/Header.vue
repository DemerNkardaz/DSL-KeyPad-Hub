<script setup lang="ts">
import { baseUrl, isWindows } from '@/scripts/constants';
import { getDownloadUrl } from '@/scripts/utils';
import Button from '@/components/ui/Button.vue';

import UpdateIcon from '@/assets/images/flat_icons/flat_update.svg'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps<{
	version: string
	windowWidth: number
}>()
</script>

<style lang="scss" src="./header.scss" />

<template>
  <header class="content-header">
		<div class="content-header__logo-wrapper">
			<a :href="baseUrl" class="content-header__logo">
				<div class="content-header__logo-icon">
					<img src="/images/button_styled_icons/app.svg" alt="DSL KeyPad Logo">
				</div>
				<p v-if="windowWidth >= 550" class="content-header__logo-title" title="Diacritics-Spaces-Letters KeyPad">DSL&nbsp;KeyPad</p>
			</a>
		</div>
		<div class="content-header__resources-container">
			<a class="content-header__resource" href="https://github.com/DemerNkardaz/DSL-KeyPad" target="_blank" rel="noopener noreferrer" title="GitHub Repository">
				<img src="/images/resources/github-mark-white.svg" alt="GitHub">
			</a>
			<a v-if="windowWidth >= (isWindows ? 750 : 400)" class="content-header__resource" href="https://sourceforge.net/projects/dsl-keypad/" target="_blank" rel="noopener noreferrer" title="SourceForge Project Page">
				<img src="https://sourceforge.net/sflogo.php?type=18&group_id=3872678" alt="SourceForge">
			</a>
		</div>
		<div v-if="isWindows" class="content-header__buttons">
			<Button variant="download" :href="getDownloadUrl(version)" :icon="{ src: '/images/flat_icons/flat_update.svg', alt: 'Download Icon' }">
				{{ t('download') }}
			</Button>
		</div>
  </header>
</template>
