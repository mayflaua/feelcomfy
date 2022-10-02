import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'FeelComfy - интернет магазин для программистов',
      link: [
        { rel: 'preconnect', href: 'https://ik.imagekit.io' },
        { rel: 'preconnect', href: 'https://ltxvxjjipthpwfyluwmj.supabase.co' }
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
        },
        {
          httpEquiv: 'content-language',
          content: 'ru'
        },
        {}
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
