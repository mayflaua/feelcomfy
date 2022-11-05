<template>
  <div>
    <UILoader v-if="!_mounted" fullscreen v2 />

    <UINoUser v-else-if="!isLoggedIn()" />
    <div v-show="cartStore.cartReady && _mounted" class="cart-wrapper">
      <CartIsEmpty v-if="cartStore.cartReady && cartStore.totalItems === 0" />
      <CartTitle v-if="cartStore.cartReady && cartStore.totalItems" />

      <div v-if="cartStore.totalItems !== 0" class="cart">
        <div class="cart__body">
          <CartItemsWrapper />
        </div>
        <CartOrderBlock />
      </div>

      <ClientOnly>
        <UITitledWrapper
          v-if="lastViewedCards.length !== 0"
          :cards="lastViewedCards"
          passive
          slider
          title="Вы недавно смотрели"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RemovableRef, useLocalStorage } from '@vueuse/core'
import { useHead } from '@vueuse/head'
import { onMounted, Ref, ref } from 'vue'
import useAuth from '../composables/useAuth'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import type { ProductWithRating } from '~/types/product'

const productsStore = useProductsStore()
const cartStore = useCartStore()

useHead({
  title: 'Корзина - FeelComfy'
})

const _mounted: Ref<boolean> = ref(false)

const { isLoggedIn } = useAuth()

// created()
await cartStore.getCartFromDatabase()
const lastViewedList: RemovableRef<Number[]> = useLocalStorage('last-viewed', [])
let lastViewedCards: Array<ProductWithRating> = []

if (lastViewedList.value.length !== 0) {
  lastViewedCards = await productsStore.getProductsByIds(lastViewedList.value)
  // sort cards array by actual sequence in storage
  lastViewedCards.sort((a, b) => lastViewedList.value.indexOf(a.pk_id) -
    lastViewedList.value.indexOf(b.pk_id))
}
onMounted(() => (_mounted.value = true))

</script>

<style lang="scss" scoped>

.cart {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;

  &-wrapper {
    padding: 0 10px;
  }

  &__cart-counter {
    font-weight: 400;
  }

  &__body {
    border: 1px solid $default;
    border-radius: 5px;
    flex-grow: 2;
  }

}

@media (max-width: 768px) {
  .cart {
    width: 100%;
    flex-direction: column;
    align-items: stretch;

    &__info {
      padding: 10px;
    }

    &__body {
      border: none;
    }
  }

}
</style>
