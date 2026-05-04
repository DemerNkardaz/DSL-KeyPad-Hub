<script setup lang="ts">
import { computed, useAttrs } from 'vue';

const presets = {
	ref: { color: '#fa8e6e', italic: true, underline: false, strong: false },
	var: { color: '#b3b3b3', italic: true, underline: false, strong: false, wrap: ['› ', ''] },
	varRef: {
		color: '#b3b3b3', italic: true, underline: false, strong: false,
		wrap: ['&', ''], wrapColor: '#fa8e6e', wrapItalic: true, wrapUnderline: false, wrapStrong: false
	},
	cls: { color: '#27ff9f', italic: true, underline: false, strong: false },
	typ: { color: '#e2ca2e', italic: true, underline: false, strong: false, wrap: ["<", ">"] },
	fnc: { color: '#66d9ef', italic: true, underline: false, strong: false },
	kwd: { color: '#f92672', italic: false, underline: false, strong: false },
	str: { color: '#e6db74', italic: false, underline: false, strong: false },
	qstr: { color: '#e6db74', italic: false, underline: false, strong: false, wrap: ['"', '"'], wrapInside: true },
	opt: { color: '#009ff7', italic: true, underline: false, strong: false },
} as const

const props = defineProps<{
	tag?: string
	color?: string
	text?: string
	preset?: keyof typeof presets
}>()

const attrs = useAttrs()

const resolved = computed(() => {
	const base = props.preset ? presets[props.preset] : {} as any
	return {
		color: props.color !== undefined ? props.color : base.color,
		italic: 'italic' in attrs || base.italic || false,
		underline: 'underline' in attrs || base.underline || false,
		strong: 'strong' in attrs || base.strong || false,
		wrap: 'wrap' in attrs || base.wrap || null,
		wrapInside: 'wrapInside' in attrs || base.wrapInside || false,
		wrapColor: base.wrapColor,
		wrapItalic: 'wrapItalic' in attrs || base.wrapItalic || false,
		wrapUnderline: 'wrapUnderline' in attrs || base.wrapUnderline || false,
		wrapStrong: 'wrapStrong' in attrs || base.wrapStrong || false,
	}
})

const contentStyle = computed(() => ({
	color: resolved.value.color,
	fontStyle: resolved.value.italic ? 'italic' : 'normal',
	textDecoration: resolved.value.underline ? 'underline' : 'none',
	fontWeight: resolved.value.strong ? 'bold' : 'normal',
}))

const wrapStyle = computed(() => ({
	color: resolved.value.wrapColor,
	fontStyle: resolved.value.wrapItalic ? 'italic' : 'normal',
	textDecoration: resolved.value.wrapUnderline ? 'underline' : 'none',
	fontWeight: resolved.value.wrapStrong ? 'bold' : 'normal',
}))

const showWrapBefore = computed(() => resolved.value.wrap && resolved.value.wrap[0] !== '')
const showWrapAfter = computed(() => resolved.value.wrap && resolved.value.wrap[1] !== '')
</script>

<template>
	<span v-if="showWrapBefore && !resolved.wrapInside" :style="wrapStyle">{{ resolved.wrap![0] }}</span>
	<component :is="tag || 'span'" :style="contentStyle">
		<span v-if="showWrapBefore && resolved.wrapInside" :style="wrapStyle">{{ resolved.wrap![0] }}</span>
		<template v-if="text">{{ text }}</template>
		<template v-else><slot /></template>
		<span v-if="showWrapAfter && resolved.wrapInside" :style="wrapStyle">{{ resolved.wrap![1] }}</span>
	</component>
	<span v-if="showWrapAfter && !resolved.wrapInside" :style="wrapStyle">{{ resolved.wrap![1] }}</span>
</template>
