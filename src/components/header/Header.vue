<script setup lang="ts">
import { getDownloadUrl } from '../../scripts/utils';
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
				<p class="header-logo-title">DSL KeyPad</p>
			</a>
		</div>
		<div class="header-resources">Text</div>
		<div class="header-download">
			<button type="button">
				<a :href="getDownloadUrl(version)" target="_blank" rel="noopener noreferrer">
					Download
				</a>
			</button>
		</div>
  </header>
</template>
