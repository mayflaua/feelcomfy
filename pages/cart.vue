<template>
  <div class="cart">
    <p class="cart__title">Ваша корзина</p>
    <div class="cart__body">
      <div class="items">
        <CartItem
          class="items__item"
          v-for="item in cartItems"
          :key="item.id"
          :itemInfo="item"
        />
      </div>
      <div class="order"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~~/stores/cart";
const cartStore = useCartStore();
const cartItems = ref([]);
const cartStored = reactive(await cartStore.getCartFromDatabase());

const getCardsInfo = async () => {
  const ids = cartStored.map((item) => item.id);
  const res: any = await $fetch(`/api/cards?ids=${ids.join("+")}`);
  res.forEach((item) => {
    if (cartStored.length !== 0) {
      const qty = cartStored.find((i) => i.id == item.id).qty;
      cartItems.value.push({
        ...item,
        qty,
      });
    }
  });
};

onMounted(() => getCardsInfo());
</script>

<style lang="scss" scoped>
@import "~/assets/style/main.scss";
.cart {
  width: 90%;
  margin: 0 auto;
  &__title {
    font-size: 1.1em;
    font-weight: 500;
  }

  &__body {
    border: 1px solid $default;
    border-radius: 5px;
  }

  .items {
    padding: 10px;
    &__item {
      border-bottom: 1px solid $default;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
