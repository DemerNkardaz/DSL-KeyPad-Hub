import { watch } from "vue"
import { useI18n } from "vue-i18n"

export function useDocumentMeta() {
  const { t, locale } = useI18n()

  watch(locale, (l) => {
    document.documentElement.lang = l
  }, { immediate: true })

  watch(
    () => t('title'),
    (title) => {
      document.title = title
    },
    { immediate: true }
  )
}
