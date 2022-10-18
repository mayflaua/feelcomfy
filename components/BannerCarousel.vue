<template>
  <Splide :options="options" class="banner-carousel">
    <SplideSlide v-for="banner in banners" :key="banner.image">
      <nuxt-link :to="banner.path">
        <nuxt-img :alt="banner.alt" :provider="banner.provider" :src="banner.image" format="webp" quality="100" />
      </nuxt-link>
    </SplideSlide>
  </Splide>
</template>

<script setup>

import { Splide, SplideSlide } from '@splidejs/vue-splide'
import '@splidejs/vue-splide/css'

const options = {
  type: 'loop',
  perPage: 1,
  gap: '1rem',
  padding: '4%',
  pagination: false,
  arrows: true,
  autoplay: true,
  interval: 5000,
  pauseOnHover: true
}

const banners = await $fetch('/api/banners')
</script>

<style lang="scss" scoped>
.banner-carousel {
  width: 100%;
  margin: 0 auto;
}

.splide__slide img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
}
</style>
