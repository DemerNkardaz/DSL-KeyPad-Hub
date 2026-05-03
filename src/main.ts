import { createApp } from 'vue'
import './styles/main.scss'
import './styles/auxiliary.scss'
import './styles/keyframes.scss'
import App from './App.vue'
import { i18n } from './i18n'
import { MDXProvider } from '@mdx-js/vue'

const app = createApp(App)

app.use(i18n)
app.component('MdxVueProvider', MDXProvider)

app.mount('#app')
