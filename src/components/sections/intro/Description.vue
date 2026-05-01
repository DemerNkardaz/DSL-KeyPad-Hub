<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isWindows } from '../../../scripts/constants';

const { t } = useI18n()

const	titles = {
	latin: 'Ænglisċ sprǣċ, Français, Tiếng Việt, Hànyǔ Pīnyīn, Norrœnt mál, Føroyskt mál, Bokmål, Español, Język polski, Čeština, Limba Română, [ … ]',
	cyrillic: 'Словѣньскъ ѩꙁꙑкъ, Ли́мба Рꙋмѫнѣскъ, Українська мова, Қазақ тілі, Забони тоҷикӣ, Аԥсуа бызшәа (Аҧсуа бызꚗа), Итәмәӈин крвэԓхатас, Хуэйзў йүян, Азәрбајҹанҹа, Башҡорт теле, Чӑваш чӗлхи, Эвэды̄ турэ̄н, [ … ]',
	runes: 'ᚨᛒᛞᛖᚠᚷᚺᛁᛇᛃᚲᛚᛗᚾᛜᛟᛈᚱᛊᛏᚦᚹᛉ ᚪᚫᚳᛠᚸᚻᛄᛡᛤᛣᛝᚩᛢᛋᛥᚣ [ … ]',
	glagolitic: 'Ⰳⰾⰰⰳⱁⰾⰻⱌⰰ [ … ]',
	math: '∅≠≈−∸±∓∔⩱⩲×÷⋇⩫≦≱⨊∈∆∇∭∯⨋ [ … ]',
	alchemy: '🜁🜃🜂🜄🝇🝢🜲🜅🜆🜊🜋🜍🜎🜏🜷🝁🝋🝛🜠🜑☿☉ [ … ]',
	other: '☯︎⚋⚊☰☱☲☳☴☵☶☷䷀䷁䷂䷃, ♔♕♖♗♘♙, ₠₳₡€₣₩¥₫₮₸, ℀℁⅍℅℆℄⅊, ⸻ ⸺ — –, «»„"", ⸮¡¿‽⸘, ⮄⮆⮅⮇⬱⇶ [ … ]',
}
</script>

<template>
  <i18n-t keypath="description.unicode" tag="p">
    <template #latin>
      <span class="underline-dot question" :title="titles.latin">{{ t('labels.latin') }}</span>
    </template>
    <template #cyrillic>
      <span class="underline-dot question" :title="titles.cyrillic">{{ t('labels.cyrillic') }}</span>
    </template>
    <template #runes>
      <span class="underline-dot question" :title="titles.runes">{{ t('labels.runes') }}</span>
    </template>
    <template #glagolitic>
      <span class="underline-dot question" :title="titles.glagolitic">{{ t('labels.glagolitic') }}</span>
    </template>
    <template #math>
      <span class="underline-dot question" :title="titles.math">{{ t('labels.math') }}</span>
    </template>
    <template #alchemy>
      <span class="underline-dot question" :title="titles.alchemy">{{ t('labels.alchemy') }}</span>
    </template>
    <template #other>
      <span class="underline-dot question" :title="titles.other">{{ t('labels.other') }}</span>
    </template>
  </i18n-t>

  <p class="italic title-small">
    <i18n-t keypath="description.requirement">
      <template #link>
        <a class="a-golden" href="https://www.autohotkey.com/" target="_blank" rel="noopener noreferrer">AutoHotkey v2</a>
      </template>
      <template #download>
        <span v-if="isWindows"> (&hairsp;<a class="a-golden" href="https://www.autohotkey.com/download/ahk-v2.exe" download>{{ t('labels.download') }}</a>&hairsp;)</span>
      </template>
    </i18n-t>
  </p>
</template>
