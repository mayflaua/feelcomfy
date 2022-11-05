<template>
  <div class="cart__info">
    <LazyUICheckbox
      :model-value="cartStore.allChecked"
      class="info__checkbox"
      @click="cartStore.handleCheckAllClick"
    >
      <span class="info__checkbox-text">
        {{ cartStore.allChecked ? 'Снять все': 'Выбрать все' }}
      </span>
    </LazyUICheckbox>

    <button
      v-show="cartStore.anyChecked"
      class="remove-selected-btn dark-invert"
      @click="cartStore.removeCheckedItems"
    >
      Удалить выбранные
    </button>
  </div>
  <CartItemsBlock />
</template>

<script lang="ts" setup>

import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

</script>

<style lang="scss" scoped>
.cart__info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;

  .remove-selected-btn {
    margin-left: auto;
    opacity: 0.6;
    background: url("~/assets/icons/bin.webp") transparent no-repeat left/contain;
    border: none;
    outline: none;
    padding-left: 20px;
    font-size: 0.8rem;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
