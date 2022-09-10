<template>
  <div class="cart">
    <p class="cart__title">
      Ваша корзина
      <span v-if="!totalItemsFormatted"> пуста</span>
      <span class="cart__cart-counter">{{ totalItemsFormatted }}</span>
    </p>
    <UILoader text="Загружаю корзину" v-if="isCartLoading" />
    <div class="cart__body" v-else-if="totalItemsFormatted">
      <div class="items">
        <CartItem
          class="items__item"
          v-for="item in cartItems"
          :key="item.id"
          :itemInfo="item"
          @delete="handleDeleteEvent"
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

const isCartLoading = ref(true);

const totalItemsFormatted = computed(() => {
  const items = cartStore.totalItems;
  if (items == 0) {
    return;
  } else if (items.toString().endsWith("1")) {
    return `, ${items} товар`;
  } else if (["2", "3", "4"].includes(items.toString().slice(-1))) {
    return `, ${items} товара`;
  } else {
    return `, ${items} товаров`;
  }
});

const getCardsInfo = async () => {
  const ids = cartStored.map((item) => item.id);
  const res: any = await $fetch(`/api/cards?ids=${ids.join("+")}`);
  isCartLoading.value = false;
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

const handleDeleteEvent = (id: number) => {
  cartItems.value.splice(
    cartItems.value.findIndex((item) => item.id == id),
    1
  );
};

onMounted(() => getCardsInfo());
</script>

<style lang="scss" scoped>
@import "~/assets/style/main.scss";
.cart {
  width: 90%;
  margin: 0 auto;
  &__title {
    font-size: 1.2rem;
    font-weight: 600;
  }

  &__cart-counter {
    font-weight: 400;
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
