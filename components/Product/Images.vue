<template>
  <div class="product-images">
    <swiper
      :modules="modules"
      :navigation="true"
      :space-between="10"
      :style="{
        '--swiper-navigation-color': '#6e6edf',
        '--swiper-pagination-color': '#6e6edf',
      }"
      :thumbs="{ swiper: thumbsSwiper }"
      class="swiper-main"
    >
      <SwiperSlide>
        <nuxt-img :src="`images/${mainImage}`" @click="openImage" />
      </SwiperSlide>
      <SwiperSlide v-for="img in images" :key="img">
        <nuxt-img :src="`images/${img}`" @click="openImage" />
      </SwiperSlide>
    </swiper>
    <swiper
      :direction="thumbsDirection"
      :free-mode="true"
      :modules="modules"
      :slides-per-view="4"
      :space-between="10"
      :watch-slides-progress="true"
      class="swiper-thumbs"
      @swiper="setThumbsSwiper"
    >
      <SwiperSlide>
        <nuxt-img :src="`images/${mainImage}`" />
      </SwiperSlide>
      <SwiperSlide v-for="img in images" :key="img">
        <nuxt-img :src="`images/${img}`" />
      </SwiperSlide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation, Thumbs } from 'swiper'
import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'

import { api as viewerApi } from 'v-viewer'
import { useMediaQuery } from '@vueuse/core'

const props = defineProps({
  mainImage: {
    type: String,
    required: true
  },
  images: {
    type: Array,
    default: () => []
  }
})

const modules = [Navigation, Thumbs, FreeMode]
const thumbsSwiper = ref(null)
const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper
}
const isMobileResolution = useMediaQuery('(max-width: 420px)')
const thumbsDirection = computed(() => isMobileResolution.value ? 'horizontal' : 'vertical')

const openImage = () => {
  const images = [`https://ik.imagekit.io/sweetie/images/${props.mainImage}`]
  if (props.images.length !== 0) {
    images.push(...props.images.map(i => (i = `https://ik.imagekit.io/sweetie/images/${i}`)))
  }
  viewerApi({ images })
}

</script>

<style lang="scss" scoped>
.product-images {
  width: 500px;
  height: 500px;

  display: flex;
  flex-direction: row-reverse;
  gap: 1rem;

  @media (max-width: 768px) {
    margin: 0 auto;
    width: 100%;
  }

  @media (max-width: 420px) {
    flex-direction: column;
  }

  .swiper {
    width: 100%;
    height: 100%;

    &-slide {
      background-size: contain;
      background-position: center;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

    }
  }

  .swiper-main {
    height: 100%;
    width: 80%;

    @media (max-width: 420px) {
      height: 80%;
      width: 100%;
    }
  }

  .swiper-thumbs {
    height: 100%;
    width: 20%;
    box-sizing: border-box;
    padding: 10px 0;

    @media (max-width: 420px) {
      height: 20%;
      width: 100%;
    }

    .swiper-slide {
      width: 100%;
      height: 100%;
      opacity: 0.6;

      &-thumb-active {
        opacity: 1;
        border: 2px solid $blue;
      }
    }
  }
}
</style>
