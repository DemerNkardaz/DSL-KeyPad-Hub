<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { baseUrl } from '@/scripts/constants';
import Copyright from './Copyright.vue'

const { t } = useI18n()
const currentYear = new Date().getFullYear()

</script>

<style lang="scss" src="./footer.scss" />

<template>
	<footer class="content-footer">
		<Copyright :start-year="2024" :current-year="currentYear" />
		<div class="content-footer__game-links">
			<p>{{ t('games.play') }}:</p>
			<a :href="baseUrl + '?play=chess'">[ {{ t('games.chess') }} ]</a>
			<a :href="baseUrl + '?play=xiangqi'">[ {{ t('games.xiangqi') }} ]</a>
		</div>
	</footer>
</template>
