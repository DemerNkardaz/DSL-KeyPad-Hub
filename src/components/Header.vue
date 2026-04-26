<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchRepositoryData } from '../scripts/fetch_repository_data'

const latestRelease = ref<any>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    latestRelease.value = await fetchRepositoryData('releases/latest')
  } catch (e) {
    error.value = String(e)
  }
})
</script>

<template>
  <header>
    <h1>DSL KeyPad Hub</h1>

    <p>
      Welcome to the DSL KeyPad Hub! Here you can find the latest releases, tags, and commits for the DSL KeyPad project.
    </p>

    <p v-if="error">
      ❌ Error: {{ error }}
    </p>

    <p v-else-if="latestRelease">
      📦 Latest release: {{ latestRelease.name || latestRelease.tag_name }}
    </p>

    <p v-else>
      Loading...
    </p>
		<p>
			{{ $t('welcome') }}
		</p>
  </header>
</template>
