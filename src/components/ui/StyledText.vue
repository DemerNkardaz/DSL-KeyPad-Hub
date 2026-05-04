<script setup lang="ts">
defineProps<{
	tag?: string
	color?: string
	italic?: boolean
	underline?: boolean
	strong?: boolean
}>()
</script>

<template>
	<component :is="tag || 'span'" :style="{ color, fontStyle: italic ? 'italic' : 'normal', textDecoration: underline ? 'underline' : 'none', fontWeight: strong ? 'bold' : 'normal' }">
		<slot />
	</component>
</template>
