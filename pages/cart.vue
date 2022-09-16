<template>
  <div class="cart-wrapper">
    <div class="title-wrapper" v-if="!isCartLoading">
      <p class="cart__title" v-if="totalItemsFormatted">
        Ваша корзина
        <span class="cart__cart-counter">{{ totalItemsFormatted }}</span>
      </p>
      <div class="cart--empty" v-else>
        <p class="cart__title">В корзине пока нет товаров</p>
        <p class="cart__subtitle">
          Начните с подборок на главной странице или найдите нужный товар через
          поиск
        </p>
        <UIButton value="На главную" path="/" />
      </div>
    </div>
    <div class="cart">
      <UILoader text="Загружаю корзину" v-if="isCartLoading" />

      <div class="cart__body" v-if="totalItemsFormatted && !isCartLoading">
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
      </div>
      <div class="order" v-if="totalItemsFormatted && !isCartLoading">
        <div class="order__free-delivery">
          <div class="free-delivery__indicator">
            <CircleProgress
              :size="35"
              :border-width="3"
              :border-bg-width="3"
              fill-color="rgb(22,202,78)"
              :percent="freeDeliveryPercent"
              class="circle"
            />
          </div>
          <div class="free-delivery__text">
            <p class="free-delivery__title">
              <span v-if="!isFreeDelivery">Бесплатно доставим ваш заказ </span>
              <span v-else>Вам доступна бесплатная доставка до двери</span>
            </p>
            <p class="free-delivery__subtitle" v-if="!isFreeDelivery">
              Ещё
              {{ formatter.format(freeDeliveryCondition - totalCartWorth) }} для
              бесплатной доставки до двери
            </p>
          </div>
        </div>
        <div class="order__info">
          <p class="info__title">Ваш заказ</p>
          <p class="info__goods">
            Товары ({{ cartStore.totalItems }}):
            <span>{{ formatter.format(totalCartWorth) }}</span>
          </p>
          <p class="info__delivery" v-if="!isFreeDelivery">
            Доставка: <span>{{ formatter.format(1000) }}</span>
          </p>
          <p class="info__total">
            Итого:
            <span>{{ formatter.format(totalCartWorthWithDelivery) }}</span>
          </p>
          <p class="info__saving" v-if="summarySavings">
            Вы экономите {{ formatter.format(summarySavings) }}
          </p>
          <UIButton
            value="Перейти к оформлению"
            path="/"
            class="info__button"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";
import { useCartStore } from "~~/stores/cart";
const { user } = useAuth();
const { supabase } = useSupabase();

// FIXME: unauthorized access
defineComponent({
  CircleProgress,
});

/* min order worth for free delivery */
const freeDeliveryCondition = 8000;
const totalCartWorth = computed(() => {
  return cartItems.value.reduce(
    (acc, curr) => acc + curr.qty * curr.final_price,
    0
  );
});
const totalCartWorthWithDelivery = computed(() => {
  return totalCartWorth.value + (isFreeDelivery.value ? 0 : 1000);
});
const summarySavings = computed(() => {
  return cartItems.value.reduce(
    (acc, curr) =>
      curr.old_price
        ? acc + curr.qty * (curr.old_price - curr.final_price)
        : acc,
    0
  );
});
/* currency formatter */
const formatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

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
  const allCheckedBeforeClick = allChecked.value;
  for (let key of Object.keys(checkboxes.value)) {
    checkboxes.value[key] = allCheckedBeforeClick ? false : true;
  }
};
const isCartLoading = ref(true);

const totalItemsFormatted = computed(() => {
  /* format "товар" in the right form depending on the totalItems value */
  /* indicates empty cart when returns false */
  const items = cartStore.totalItems;
  if (items == 0) {
    return false;
  } else if (items.toString().endsWith("1")) {
    return `, ${items} товар`;
  } else if (["2", "3", "4"].includes(items.toString().slice(-1))) {
    return `, ${items} товара`;
  } else {
    return `, ${items} товаров`;
  }
});

const freeDeliveryPercent = computed(() => {
  /* returns the percentage of total cart worth from free delivery condition */

  return Math.min((totalCartWorth.value / freeDeliveryCondition) * 100, 100);
});

const isFreeDelivery = computed(() => {
  /* return boolean value indicates if free delivery available */
  return freeDeliveryPercent.value == 100;
});

const getCardsInfo = async () => {
  /* fetch all items from db with stored ids if they exist*/
  if (cartStored) {
    const ids = cartStored.map((item) => item.pk_id);

    const { data: res } = await supabase
      .from("goods")
      .select()
      .in("pk_id", ids);
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
    isCartLoading.value = false;
  } else {
    /* else stop loading and show empty cart element */
    isCartLoading.value = false;
  }
};

const handleDeleteEvent = (id: number) => {
  /* remove deleted item from the static render array */
  cartItems.value.splice(
    cartItems.value.findIndex((item) => item.id == id),
    1
  );
};

onBeforeMount(() => getCardsInfo());
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
  &__title {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 15px 0;
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
    flex-grow: 2;
  }

  &--empty {
    text-align: center;
    background: url("~/assets/images/empty-cart-bg.png") no-repeat top/8rem;
    padding: 100px 6px 0 6px;

    .cart__subtitle {
      font-size: 0.9rem;
    }

    .cart__title {
      border: none;
    }
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

.order {
  width: 25%;
  padding: 8px 12px;
  border: 1px solid $default;
  border-radius: 5px;

  &__free-delivery {
    display: flex;
    gap: 5px;
    border-bottom: 1px solid $default;
    padding: 10px 0;
    .free-delivery {
      &__title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 500;
      }
      &__subtitle {
        margin: 10px 0 0 0;
        font-size: 0.7rem;
        color: $dark;
      }
      &__indicator {
        position: relative;
        .circle {
          background: url("data:image/svg+xml,%3csvg width='24' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3cpath fill-rule='evenodd' clip-rule='evenodd' d='M19.2425 7.22388C19.6618 7.49073 19.7854 8.04701 19.5186 8.46636L11.7593 18.4832C11.605 18.7256 11.3443 18.8798 11.0576 18.8982C10.7708 18.9165 10.4925 18.7969 10.3086 18.5762L5.3086 12.5762C4.99039 12.1943 5.04198 11.6268 5.42383 11.3086C5.80568 10.9904 6.37319 11.042 6.6914 11.4238L10.9024 16.477L18 7.49998C18.2669 7.08064 18.8231 6.95702 19.2425 7.22388Z' fill='%2316CA4E'/%3e %3c/svg%3e")
            no-repeat center/contain;
        }
      }
    }
  }

  &__info {
    .info {
      &__title {
        font-weight: 500;
        margin: 10px 0;
      }

      &__goods,
      &__delivery,
      &__total {
        display: flex;
        justify-content: space-between;
      }
      &__total span {
        font-size: 1.1rem;
        font-weight: 500;
      }
      &__saving {
        text-align: right;
        color: rgb(22, 202, 78);
        font-size: 0.7rem;
        margin: -10px 0 15px 0;
      }
      &__button {
        border-radius: 6px;
        display: block;
      }
    }
  }
}

@media (max-width: 768px) {
  .cart {
    width: 100%;
    flex-direction: column;
    align-items: stretch;

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

  .order {
    width: 100%;
    border: none;

    &__free-delivery {
      gap: 15px;
    }
  }
}
</style>
