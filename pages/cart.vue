<template>
  <div class="cart">
    <p class="cart__title">
      Ваша корзина
      <span v-if="!totalItemsFormatted"> пуста</span>
      <span class="cart__cart-counter">{{ totalItemsFormatted }}</span>
    </p>

    <UILoader text="Загружаю корзину" v-if="isCartLoading" />

    <div class="cart__body" v-else-if="totalItemsFormatted">
      <div class="cart__info">
        <UICheckbox
          class="info__checkbox"
          :checked="allChecked"
          @click="handleCheckAllClick"
        />
        <span class="info__checkbox-text" v-if="allChecked">Снять все</span>
        <span class="info__checkbox-text" v-else>Выбрать все</span>        
      </div>
      <div class="items">
        <CartItem
          class="items__item"
          v-for="(item, i) in cartItems"
          :key="item.id"
          :itemInfo="item"
          @delete="handleDeleteEvent"
        >
          <UICheckbox
            class="item__checkbox"
            :checked="checkboxes[i]"
            :defaultValue="defaultCheckboxValue"
            @changed="(val) => (checkboxes[i] = val)"
          />
        </CartItem>
      </div>
      <div class="order"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~~/stores/cart";
/* items appear with this checkbox value at render */
const defaultCheckboxValue = true;
const checkboxes = ref({});
/* boolean value indicates if all checkboxes are checked */
const allChecked = computed(() =>
  Object.values(checkboxes.value).every(Boolean)
);

const cartStore = useCartStore();
/* dynamic array with cards */
const cartItems = ref([]);
/* static array with stored cart ids and qtys */
const cartStored = await cartStore.getCartFromDatabase();
const handleCheckAllClick = () => {
  const allCheckedBeforeClick = allChecked.value 
  for (let key of Object.keys(checkboxes.value)) {
    checkboxes.value[key] = allCheckedBeforeClick ? false : true;
  }
};
const isCartLoading = ref(true);

const totalItemsFormatted = computed(() => {
  /* format "товар" in the right form depending on the totalItems value */
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
  /* fetch all items from api with stored ids */
  const ids = cartStored.map((item) => item.id);
  const res: any = await $fetch(`/api/cards?ids=${ids.join("+")}`);

  isCartLoading.value = false;
  /* create an object with all fetched cards infos */
  res.forEach((item, i) => {
    if (cartStored.length !== 0) {
      /* and initial checkbox values object */
      checkboxes.value[i] = defaultCheckboxValue;
      const qty = cartStored.find((i) => i.id == item.id).qty;
      cartItems.value.push({
        ...item,
        qty,
      });
    }
  });
};

const handleDeleteEvent = (id: number) => {
  /* remove deleted item from the static render array */
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
    margin: 0;
  }

  &__info {
    display: flex;
    gap: 10px;
    padding: 20px;
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
    display: flex;
    flex-direction: column;
    gap: 20px;
    &__item {
      border-bottom: 1px solid $default;

      .item__checkbox {
        align-self: center;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .cart {
    width: 100%;

    .items {
      padding: 0;
    }

    &__title {
      text-align: center;
      border-bottom: 1px solid $default;
      padding: 0 0 10px 0;
    }

    &__info {
      padding: 10px;
    }

    &__body {
      border: none;
    }
  }
}
</style>
