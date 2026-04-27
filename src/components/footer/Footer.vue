<script setup lang="ts">
import Copyright from './Copyright.vue'

const currentYear = new Date().getFullYear()
</script>

<style lang="scss">
@use './footer.scss';
</style>

<template>
	<footer class="content-footer">
		<Copyright :start-year="2024" :current-year="currentYear" />
	</footer>
</template>
