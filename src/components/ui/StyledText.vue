<script setup lang="ts">
defineProps<{
	tag?: string
	color?: string
	italic?: boolean
	underline?: boolean
	strong?: boolean
	text?: string
}>()
</script>

<template>
	<component :is="tag || 'span'" :style="{ color, fontStyle: italic ? 'italic' : 'normal', textDecoration: underline ? 'underline' : 'none', fontWeight: strong ? 'bold' : 'normal' }">
		<template v-if="text">{{ text }}</template>
		<template v-else>
			<slot />
		</template>
	</component>
</template>
