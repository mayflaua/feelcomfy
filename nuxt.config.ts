import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://ik.imagekit.io' }
      ]
    }
  },
  modern: true,
  css: ['~/assets/style/normalize.css', '~/assets/style/font.css'],

  modules: ['@pinia/nuxt', '@nuxt/image-edge'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/style/colors.scss" as *;'
        }
      }
    }
  },

  build: {
    analyze: true,
    filenames: {
      chunk: () => '[name].[id].[contenthash].js'
    },
    transpile: ['pinia']
  },

  image: {
    provider: 'imagekit',
    imagekit: {
      baseURL: 'https://ik.imagekit.io/sweetie/images'
    },
    domains: ['ltxvxjjipthpwfyluwmj.supabase.co'],
    screens: {
      600: 600,
      450: 450
    }
  }
})
