<template>
  <Swiper
    :autoplay="{
      delay: 3500,
      pauseOnMouseEnter: true,
    }"
    :initial-slide="2"
    :loop="true"
    :modules="modules"
    :navigation="true"
    :slides-per-view="1"
    class="banner-carousel"
  >
    <SwiperSlide v-for="(banner, i) in banners" :key="banner.image">
      <nuxt-link :to="banner.path" no-prefetch>
        <nuxt-img
          :alt="banner.alt"
          :loading="i !== 2 ? 'lazy' : 'eager'"
          :preload="i === 2"
          :src="banner.image"
          format="webp"
          height="400"
          quality="90"
          sizes="xxl:1400px xl:1100px lg:900px md:650px sm:500px xs:200px"
          width="990"
        />
      </nuxt-link>
    </SwiperSlide>
  </Swiper>
</template>

<script setup>

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

const modules = [Navigation, Autoplay]

const { data: banners } = await useFetch('/api/banners')
</script>

<style lang="scss" scoped>
.banner-carousel {
  width: 100%;
  margin: 0 auto;

  --swiper-navigation-size: 40px;
  --swiper-navigation-color: #eee;

  @media (max-width: 768px) {
    --swiper-navigation-size: 20px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 20px;
  }
}

</style>
