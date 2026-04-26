<script setup lang="ts">
defineProps<{
	title: string
}>()
</script>

<template>
  <header>
		<div>
			<a href="/">
				<div>
					<img src="/images/button_styled_icons/app.svg" alt="DSL KeyPad Logo">
				</div>
				<p>{{ title }}</p>
			</a>
		</div>
		<div></div>
		<div></div>
    <!-- <h1>DSL KeyPad Hub</h1>

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
		</p> -->
  </header>
</template>
