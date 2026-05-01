<script setup lang="ts">
import { computed, ref } from 'vue';
import { randomCharacters, type RandomCharacter } from '../../../data/randomCharacter';
import { randomObjectKey } from '../../../scripts/utils';
import { locale } from '../../../i18n';

import Description from './Description.vue';
import BackgroundScatteredCharacters from './BackgroundScatteredCharacters.vue';

type AppLocale = keyof Omit<typeof randomCharacters[keyof typeof randomCharacters], 'item'>

type TextPart = { type: 'text', value: string }
type SpanPart = { type: 'span', text: string, title: string }
type LinkPart = { type: 'link', text: string, url: string }
type SupPart = { type: 'sup', text: string }
type Part = TextPart | SpanPart | LinkPart | SupPart

const currentLocale = ref<AppLocale>(locale.value as AppLocale);

const characterEntryID = randomObjectKey(randomCharacters);
const characterEntry = randomCharacters[characterEntryID] as RandomCharacter;

function parseString(raw: string): Part[] {
    const parts: Part[] = []
    let lastIndex = 0
    const re = /\{([^|]+)\|([^}]+)\}|\[([^\]@]+)@([^\]]+)\]|\^([^^]+)\^/g
    for (const match of raw.matchAll(re)) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', value: raw.slice(lastIndex, match.index) })
        }
        if (match[1]) {
            parts.push({ type: 'span', text: match[1], title: match[2] })
        } else if (match[3]) {
            parts.push({ type: 'link', text: match[3], url: match[4] })
        } else {
            parts.push({ type: 'sup', text: match[5] })
        }
        lastIndex = match.index + match[0].length
    }
    if (lastIndex < raw.length) {
        parts.push({ type: 'text', value: raw.slice(lastIndex) })
    }
    return parts
}

const titleParts = computed(() => parseString(characterEntry[currentLocale.value].title))
const subtitleParts = computed(() => parseString(characterEntry[currentLocale.value].subtitle))


defineProps<{
	versionedTitle: string
}>()
</script>

<style lang="scss" src="./intro-section.scss" />

<template>
	<section class="intro-section">
		<div class="intro-section__background">
			<div class="intro-section__background__characters">
				<component v-if="characterEntry.component" :is="characterEntry.component" v-bind="characterEntry.componentProps" />
				<BackgroundScatteredCharacters v-else :custom-characters="characterEntry.customCharacters" />
			</div>
			<div class="intro-section__background__gradient"></div>
		</div>
		<div class="intro-section__content">
			<div class="intro-section__content__random-character">
				<p class="intro-section__content__random-character__symbol" :style="characterEntry.style || null">{{ characterEntry.item }}</p>
					<p class="intro-section__content__random-character__caption">
						<span>
							<template v-for="part of titleParts">
								<span v-if="part.type === 'span'" class="underline-dot question" :title="part.title">{{ part.text }}</span>
								<a v-else-if="part.type === 'link'" :href="part.url" target="_blank" rel="noopener noreferrer">{{ part.text }}</a>
								<sup v-else-if="part.type === 'sup'">{{ part.text }}</sup>
								<template v-else-if="part.type === 'text'">{{ part.value }}</template>
							</template>
						</span>
						<br>
						<span>
							[
							<template v-for="part of subtitleParts">
								<template v-if="part.type === 'link'">
										<a :href="part.url" target="_blank" rel="noopener noreferrer">{{ part.text }}</a>
								</template>
								<sup v-else-if="part.type === 'sup'">{{ part.text }}</sup>
								<template v-else-if="part.type === 'text'">{{ part.value }}</template>
							</template>
							]
						</span>
					</p>
			</div>
			<h1 class="intro-section__content__header">
				{{ versionedTitle }}
			</h1>
			<div class="intro-section__content__description">
				<Description />
			</div>
		</div>
		<div class="intro-section__decorative-footer-container">
			<div class="intro-section__decorative-footer-wrapper">
				<div class="intro-section__decorative-footer"></div>
			</div>
		</div>
	</section>
</template>
