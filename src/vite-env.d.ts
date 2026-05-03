declare module '*.mdx' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
  export const frontmatter: Record<string, unknown>
}
