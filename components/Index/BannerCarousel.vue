<template>
  <div class="wrapper">
    <nuxt-img
      v-if="!_swiperInitialized"
      :src="banners[2].image"
      class="image--fallback"
      format="webp"
      height="400"
      preload
      quality="40"
      sizes="xxl:1400px xl:1100px lg:900px md:650px sm:500px xs:200px"
      width="990"
    />
    <Swiper
      v-show="_swiperInitialized"
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
      @init="handleSwiperInit"
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
  </div>
</template>

<script setup>

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

const modules = [Navigation, Autoplay]
const _swiperInitialized = ref(false)
const handleSwiperInit = () => {
  _swiperInitialized.value = true
}
const { data: banners } = await useFetch('/api/banners')
</script>

<style lang="scss" scoped>

.image--fallback {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

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
