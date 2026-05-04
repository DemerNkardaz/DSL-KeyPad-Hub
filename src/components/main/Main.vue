<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ArticleList from '../article/ArticleList.vue'
import { computed, provide, reactive, shallowRef, watchEffect } from 'vue'
import ArticlePage from '../article/ArticlePage.vue'
import { locale } from '@/i18n'
import { articlesModules, findArticleIdByName } from '@/content/articles'
import { urlParams } from '@/scripts/constants'

const { t } = useI18n()

const state = reactive({
  activeArticle: null as string | null
})

provide('activeArticle', state)

const urlArticleName = urlParams.get('a')?.toLowerCase().replace(/\+/g, ' ') ?? null
const urlSectionParam = urlParams.get('s')?.toLowerCase().replace(/\+/g, ' ') ?? null
const urlHeaderParam = urlParams.get('h')?.toLowerCase().replace(/\+/g, ' ') ?? null

if (urlArticleName) {
  const resolvedId = findArticleIdByName(urlArticleName)
  if (resolvedId) state.activeArticle = resolvedId
}

const articleModule = shallowRef<any>(null)

watchEffect(() => {
  const id = state.activeArticle
  if (!id) {
    articleModule.value = null
    return
  }

  const path = `./${id}/${locale.value}.mdx`
  articleModule.value = articlesModules[path] || null

  if (!articleModule.value) {
    console.warn(`Article module not found for path: ${path}`)
  }
})

const ArticleComponent = computed(() => articleModule.value?.default)
const frontmatter = computed(() => articleModule.value?.frontmatter)
const readingTime = computed(() => articleModule.value?.readingTime)

const pendingSection = computed(() => urlSectionParam)
const pendingHeader = computed(() => urlHeaderParam)
provide('pendingSection', pendingSection)
provide('pendingHeader', pendingHeader)
</script>


<style lang="scss" src="./main.scss" />

<template>
  <main class="content-main">
    <div class="content-main__features">{{ t('features') }}</div>
    <div class="content-main__content">
      <ArticleList />
      <ArticlePage
        v-if="ArticleComponent && frontmatter"
        :title="frontmatter.title"
        :description="frontmatter.longDescription || frontmatter.description"
        :reading-time="readingTime"
        @close="state.activeArticle = null">
        <component :is="ArticleComponent" />
      </ArticlePage>
      <slot />
    </div>
  </main>
</template>
