import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export const alias: Record<string, string> = {
  '~~': r('.'),
  '~~/*': r('./*'),
  '@@': r('.'),
  '@@/*': r('./*'),
  '~': r('.'),
  '~/*': r('./*'),
  '@': r('.'),
  '@/*': r('./*'),
  assets: r('assets'),
  'assets/*': r('assets/*'),
  public: r('public'),
  'public/*': r('public/*'),
  '#app': r('node_modules/nuxt/dist/app'),
  '#app/*': r('node_modules/nuxt/dist/app/*'),
  'vue-demi': r('node_modules/nuxt/dist/app/compat/vue-demi'),
  pinia: r('node_modules/pinia/dist/pinia'),
  '#image': r('node_modules/@nuxt/image-edge/dist/runtime'),
  '#image/*': r('node_modules/@nuxt/image-edge/dist/runtime/*'),
  '#color-mode-options': r('.nuxt/color-mode-options'),
  '#head': r('node_modules/nuxt/dist/head/runtime'),
  '#head/*': r('node_modules/nuxt/dist/head/runtime/*'),
  '#imports': r('.nuxt/imports.d.ts'),
  '#build': r('.nuxt'),
  '#build/*': r('.nuxt/*'),
  '#components': r('.nuxt/components')
}
