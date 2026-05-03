<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ArticleList from '../article/ArticleList.vue'
import { computed, provide, reactive, shallowRef, watch } from 'vue'
import ArticlePage from '../article/ArticlePage.vue'
import { locale } from '@/i18n'

const { t } = useI18n()

const state = reactive({
  activeArticle: null as string | null
})

provide('activeArticle', state)

const articleModule = shallowRef<any>(null)

watch(() => state.activeArticle, async (id) => {
  if (!id) {
    articleModule.value = null
    return
  }
  articleModule.value = await import(`@/content/articles/${id}/${locale.value}.mdx`)
}, { immediate: true })

const ArticleComponent = computed(() => articleModule.value?.default)
const frontmatter = computed(() => articleModule.value?.frontmatter)
const readingTime = computed(() => articleModule.value?.readingTime)
</script>

<style lang="scss" src="./main.scss" />

<template>
  <main class="content-main">
    <div class="content-main__features">{{ t('features') }}</div>
    <div class="content-main__content">
      <ArticleList />
      <ArticlePage v-if="ArticleComponent && frontmatter" :title="frontmatter.title" :description="frontmatter.description" :reading-time="readingTime">
        <component :is="ArticleComponent" />
      </ArticlePage>
      <slot />
    </div>
  </main>
</template>
