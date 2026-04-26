<!-- Навигация по секциям статьи (не содержание, а самостоятельные блоки информации разной направленности) -->
<script setup lang="ts">
defineProps<{
	items: { href: string; label: string }[]
}>()
</script>

<template>
	<aside class="article-sidebar">
		<nav aria-label="Article sections">
			<ul>
				<li v-for="item in items" :key="item.href">
					<a :href="item.href">{{ item.label }}</a>
				</li>
			</ul>
		</nav>
	</aside>
</template>
