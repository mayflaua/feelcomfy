<template>
  <div class="wrapper">
    <nuxt-link :to="passive ? '' : props.path" class="wrapper__title">
      {{ title }}
      <svg
        v-if="!passive"
        class="arrow dark-invert"
        fill="none"
        height="36"
        viewBox="0 0 24 24"
        width="36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M9.18945 16.4983C8.91426 16.1887 8.94215 15.7146 9.25174 15.4394L13.1211 12L9.25173 8.56055C8.94215 8.28536 8.91426 7.81131 9.18945 7.50172C9.46464 7.19213 9.93869 7.16425 10.2483 7.43943L14.7483 11.4394C14.9084 11.5818 15 11.7858 15 12C15 12.2142 14.9084 12.4182 14.7483 12.5605L10.2483 16.5605C9.93869 16.8357 9.46464 16.8079 9.18945 16.4983Z"
          fill="black"
          fill-rule="evenodd"
        />
      </svg>
    </nuxt-link>

    <div v-if="!slider" class="cards">
      <CardsContainer>
        <UICard v-for="card in cards" :key="card.pk_id" :product="card" />
      </CardsContainer>
    </div>

    <Swiper
      v-else
      :breakpoints="{
        350: {
          slidesPerView: 2
        },
        800: {
          slidesPerView: 3
        },
        1100: {
          slidesPerView: 4
        },
        1300: {
          slidesPerView: 5
        }
      }"
      :free-mode="true"
      :modules="modules"
      :slides-per-view="1"
      :space-between="10"
      class="cards-slider"
      navigation
    >
      <SwiperSlide v-for="card in cards" :key="card.pk_id">
        <Card :card="card" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'

const modules = [Navigation, FreeMode]
const props = defineProps({
  path: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Заголовок'
  },
  slider: {
    type: Boolean,
    default: false
  },
  passive: {
    type: Boolean,
    default: false
  },
  cards: {
    type: Array,
    required: true
  }
})

</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: fit-content;
  margin: 30px 0;

  &__title {
    width: fit-content;
    margin: 0 0 30px 0;

    font-size: 1.6rem;
    font-weight: 500;
    color: $font;
    text-decoration: none;

    display: flex;
    align-items: center;
    gap: 5px;

    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .cards-slider {
    --swiper-navigation-size: 40px;
    --swiper-navigation-color: black;

    @media (max-width: 768px) {
      --swiper-navigation-size: 20px;
    }
  }

}
</style>
