import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["~/assets/style/normalize.css", "~/assets/style/font.css"],
  
  modules: ["@pinia/nuxt"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/style/colors.scss" as *;'
        }
      }
    }
  }
});
