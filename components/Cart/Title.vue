<template>
  <div class="cart__title">
    <div class="title-wrapper">
      <h1 class="cart__title">
        Ваша корзина
        <span class="cart__cart-counter">{{ totalItemsFormatted }}</span>
      </h1>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { computed, ComputedRef } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const totalItemsFormatted: ComputedRef<string | false> = computed(() => {
  /* format "товар" in the right form depending on the totalItems value */
  /* indicates empty cart when returns false */
  const items = cartStore.totalItems
  if (items === 0) {
    return false
  } else if (items.toString().endsWith('1')) {
    return `, ${items} товар`
  } else if (['2', '3', '4'].includes(items.toString().slice(-1))) {
    return `, ${items} товара`
  } else {
    return `, ${items} товаров`
  }
})

</script>

<style lang="scss" scoped>
.cart__title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 15px 0;

  @media (max-width: 768px) {
    text-align: center;
    border-bottom: 1px solid $default;
    padding: 0 0 10px 0;
  }
}
</style>
