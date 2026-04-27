<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Copyright from './Copyright.vue'

const { t } = useI18n()
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
