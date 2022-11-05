<template>
  <div class="cart-items">
    <CartItem
      v-for="item in cartStore.cart"
      :key="item.pk_id"
      :item-info="item"
      class="cart-items__item"
    />
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
</script>

<style lang="scss" scoped>
.cart-items {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__item {
    border-bottom: 1px solid $default;

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
