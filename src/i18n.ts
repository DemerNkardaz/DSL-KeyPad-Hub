import { createI18n } from 'vue-i18n'
import { messages, getBrowserLocale } from './i18n/locales'

const supportedLocales = Object.keys(messages)

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getBrowserLocale(supportedLocales),
  fallbackLocale: 'en',
  messages
})

export const locale = i18n.global.locale
