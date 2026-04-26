<script setup lang="ts">
import Header from './components/header/Header.vue';

import { ref, onMounted } from 'vue'
import { fetchRepositoryData } from './scripts/fetch_repository_data';
import { formatTitle } from './scripts/utils';
import { useI18n } from 'vue-i18n'
import { useDocumentMeta } from './scripts/composable';
const { t } = useI18n()

const latestRelease = ref<any>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    latestRelease.value = await fetchRepositoryData('releases/latest')
  } catch (e) {
    error.value = String(e)
  }
})

useDocumentMeta()
</script>

<style lang="scss" scoped>
</style>

<template>
	<Header :version="latestRelease?.tag_name" />
	<div>
		{{  formatTitle(latestRelease?.name || 'DSL KeyPad', t)  }}
	</div>
</template>
