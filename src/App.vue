<script setup lang="ts">
import Header from './components/header/Header.vue'
import IntroSection from './components/sections/intro/IntroSection.vue'
import Main from './components/main/Main.vue'
import Footer from './components/footer/Footer.vue'

import { ref, onMounted, computed } from 'vue'
import { getLatestRelease } from './scripts/fetchRepostiryData'
import { formatTitle } from './scripts/utils'
import { useDocumentMeta } from './scripts/composables/useDocumentMeta'
import { useI18n } from 'vue-i18n'
import { useWindowSize } from './scripts/composables/useWindowSize'

const { t } = useI18n()
const { windowWidth } = useWindowSize()

const latestRelease = ref<any>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    latestRelease.value = await getLatestRelease()
  } catch (e) {
    error.value = String(e)
  }
})

useDocumentMeta()

const formattedTitle = computed(() => {
  if (latestRelease.value) {
    return formatTitle(windowWidth.value > 450 && latestRelease.value.name || 'DSL KeyPad', t)
  }
  return 'DSL KeyPad'
})
</script>

<style lang="scss" scoped>
</style>

<template>
	<Header :version="latestRelease?.tag_name ?? 'fetching...'" :window-width="windowWidth" />
	<IntroSection :versioned-title="formattedTitle" />
	<Main></Main>
	<Footer />
</template>
