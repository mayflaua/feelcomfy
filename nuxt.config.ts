import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'FeelComfy - интернет магазин для программистов',
      link: [
        { rel: 'preconnect', href: 'https://ik.imagekit.io' },
        { rel: 'preconnect', href: 'https://ltxvxjjipthpwfyluwmj.supabase.co' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon/favicon.png' }

      ],
      meta: [
        {
          name: 'description',
          content: 'Интернет магазин для программистов со всем необходимым для комфортной' +
            ' разработки.'
        },
        {
          name: 'robots',
          content: 'all'
        },
        {
          name: 'keywords',
          content: 'интернет магазин, маркетплейс, низкие цены, для программистов'
        }
      ]
    }
  },
  modern: true,
  css: ['~/assets/style/main.scss'],
  modules: ['@pinia/nuxt', '@nuxt/image-edge', '@nuxtjs/color-mode'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/style/colors.scss" as *;'
        }
      }
    }
  },

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  build: {
    analyze: true,
    filenames: {
      chunk: () => '[name].[id].[contenthash].js'
    },
    transpile: ['pinia', 'v-viewer']
  },

  image: {
    provider: 'imagekit',
    imagekit: {
      baseURL: 'https://ik.imagekit.io/sweetie'
    },

    screens: {
      600: 600,
      450: 450
    }
  }
})
