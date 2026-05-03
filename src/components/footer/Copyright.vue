<script setup lang="ts">
import { i18n } from '@/i18n';

const locale = i18n.global.locale.value

defineProps<{
	startYear: number
	currentYear: number
}>()
</script>

<template>
	<div class="content-footer__copyright">
		<span v-if="locale.startsWith('ru')">
			&COPY;&emsp14;Я&#769;лла&nbsp;Нкарда&#769;з,&emsp14;{{ startYear }}–{{ currentYear }}
		</span>
		<span v-else>
			&COPY;&emsp14;{{ startYear }}–{{ currentYear }}&emsp14;Yalla Nkardaz
		</span>
	</div>
</template>
