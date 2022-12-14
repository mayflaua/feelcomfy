<template>
  <teleport to="body">
    <div class="wrapper">
      <transition-group mode="out-in" name="list">
        <div v-for="(item, i) in queue" :key="item.name" class="popup">
          <div class="image-wrapper">
            <nuxt-img
              :src="`images/${item.url}`"
              class="popup__image"
              format="webp"
              height="100%"
              quality="40"
              width="60px"
            />
          </div>
          <div class="popup__desc">
            <div class="popup__title">
              {{
                (item.event === "add"
                  ? "Товар добавлен в корзину"
                  : "Товар удален из корзины")
              }}
            </div>
            <div class="popup__name">
              {{ item.name }}
            </div>
          </div>
          <div class="popup__controls">
            <button class="popup__close" @click="close(i)">
              <svg
                class="dark-invert"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g data-name="Layer 2">
                  <g data-name="close">
                    <rect
                      height="24"
                      opacity="0"
                      transform="rotate(180 12 12)"
                      width="24"
                    />
                    <path
                      d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
                    />
                  </g>
                </g>
              </svg>
            </button>
            <nuxt-link class="popup__go-to-cart" to="/cart">
              К корзине
            </nuxt-link>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { useNuxtApp } from '#app'
import { onMounted, Ref, ref } from 'vue'
import type { ShowFn, ShowOptions } from '~/types/popup'

const queue:Ref<ShowOptions[]> = ref([])
const SHOW_TIME = 2000

let timer:ReturnType<typeof setTimeout> | null = null

const show: ShowFn = ({ name, url, event }) => {
  queue.value.push({ name, url, event })
  timer = setTimeout(() => queue.value.shift(), SHOW_TIME)
}

const close = (index: number): void => {
  queue.value.splice(index, 1)
  if (timer) { clearTimeout(timer) }
}

const { $emitter } = useNuxtApp()

onMounted(() => {
  if ($emitter) { $emitter.on('show-popup', show) }
})
</script>

<style lang="scss" scoped>
.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.wrapper {
  max-width: min(100%, 500px);

  display: flex;
  flex-direction: column;

  position: fixed;
  margin: 0 auto;
  top: 10px;
  left: 0;
  right: 0;
  z-index: 20;

  @media (max-width: 500px) {
    font-size: 0.8rem;
    overflow-wrap: anywhere;
  }
}

.popup {
  width: 100%;
  height: 100px;
  padding: 10px;
  margin: 0 0 15px 0;

  background: $light;
  box-shadow: 0 6px 6px rgba(black, 0.2);

  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;

  &__title {
    font-size: 1.2em;
    font-weight: 600;
    color: $font;
    text-align: center;
  }

  &__desc {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-around;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    align-self: stretch;
    justify-content: space-around;
  }

  &__close,
  &__go-to-cart {
    border: none;
    cursor: pointer;
  }

  &__go-to-cart {
    font-size: 0.9rem;
    width: 6rem;
    font-weight: 600;
    color: white;
    background-color: $blue;
    padding: 5px 8px;
    text-decoration: none;
    text-align: center;
  }
}
</style>
