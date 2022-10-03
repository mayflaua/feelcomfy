<template>
  <div class="cart-wrapper">
    <div v-if="cartStore.cartReady" class="title-wrapper">
      <h1 v-if="totalItemsFormatted" class="cart__title">
        Ваша корзина
        <span class="cart__cart-counter">{{ totalItemsFormatted }}</span>
      </h1>
      <div v-else class="cart--empty">
        <p class="cart__title">
          В корзине пока нет товаров
        </p>
        <p class="cart__subtitle">
          Начните с подборок на главной странице или найдите нужный товар через
          поиск
        </p>
        <LazyUIButton path="/" text="На главную" />
      </div>
    </div>
    <div class="cart">
      <LazyUILoader v-if="!cartStore.cartReady" />

      <div v-if="totalItemsFormatted && cartStore.cartReady" class="cart__body">
        <div class="cart__info">
          <LazyUICheckbox
            :checked="cartStore.allChecked"
            class="info__checkbox"
            @click="cartStore.handleCheckAllClick"
          />
          <span v-if="cartStore.allChecked" class="info__checkbox-text">Снять все</span>
          <span v-else class="info__checkbox-text">Выбрать все</span>
        </div>
        <div class="items">
          <LazyCartItem
            v-for="(item) in cartItems"
            :key="item.id"
            :item-info="item"
            class="items__item"
          />
        </div>
      </div>
      <div v-if="totalItemsFormatted && cartStore.cartReady" class="order">
        <div class="order__free-delivery">
          <div class="free-delivery__indicator">
            <CircleProgress
              :border-bg-width="3"
              :border-width="3"
              :percent="cartStore.freeDeliveryPercent"
              :size="35"
              class="circle"
              fill-color="rgb(22,202,78)"
            />
          </div>
          <div class="free-delivery__text">
            <p class="free-delivery__title">
              <span v-if="!cartStore.isFreeDelivery">{{
                cartStore.totalSelectedItemsWorth !== 0
                  ? "Бесплатно доставим ваш заказ"
                  : "Выберите товары"
              }}</span>
              <span v-else>Вам доступна бесплатная доставка до двери</span>
            </p>
            <p v-if="!cartStore.isFreeDelivery" class="free-delivery__subtitle">
              Ещё
              {{
                formatter.format(
                  cartStore.freeDeliveryCondition - cartStore.totalSelectedItemsWorth
                )
              }}
              для бесплатной доставки до двери
            </p>
          </div>
        </div>
        <div v-if="cartStore.totalSelectedItemsWorth !== 0" class="order__info">
          <p class="info__title">
            Ваш заказ
          </p>
          <p class="info__goods">
            Товары ({{ cartStore.totalItems }}):
            <span>{{
              formatter.format(cartStore.totalSelectedItemsWorth)
            }}</span>
          </p>
          <p v-if="!cartStore.isFreeDelivery" class="info__delivery">
            Доставка: <span>{{ formatter.format(1000) }}</span>
          </p>
          <p class="info__total">
            Итого:
            <span>{{
              formatter.format(cartStore.totalCartWorthWithDelivery)
            }}</span>
          </p>
          <p v-if="cartStore.summarySavings" class="info__saving">
            Вы экономите {{ formatter.format(cartStore.summarySavings) }}
          </p>
          <LazyUIButton
            :loading-state="makeOrderState"
            class="info__button"
            path=""
            text="Перейти к оформлению"
            @click="handleMakeOrderClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import useAuth from '../composables/useAuth'
import useSupabase from '../composables/useSupabase'
import { useCartStore } from '~~/stores/cart'

useHead({
  title: 'Корзина - FeelComfy'
})

const CircleProgress = defineAsyncComponent({
  loader: () => import('vue3-circle-progress')
})

const { user } = useAuth()
const { supabase } = useSupabase()

const makeOrderState = ref(false)

// FIXME: unauthorized access
/* currency formatter */
const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
})

const cartStore = useCartStore()
/* dynamic array with cards */
const cartItems = computed(() => cartStore.cart)

const totalItemsFormatted = computed(() => {
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

const handleMakeOrderClick = async () => {
  if (cartStore.totalSelectedItemsWorth !== 0) {
    makeOrderState.value = true
    /* make orders list from selected items */
    const order = []
    cartItems.value.forEach((item) => {
      // eslint-disable-next-line no-unused-expressions
      item.checked
        ? order.push({
          id: item.pk_id,
          qty: item.qty,
          price: item.final_price
        })
        : null
    })
    /* insert order to database and get its order_id */
    await supabase.from('orders').insert({
      user_id: user.value.id,
      order
    })
    const orderID = await supabase
      .from('orders')
      .select('order_id')
      .order('created_at', { ascending: false })
      .limit(1)

    /* redirect to order confirmation page */
    await navigateTo({
      path: '/order',
      query: { order: orderID.data[0].order_id }
    })
    makeOrderState.value = false
  }
}

// created()
await cartStore.getCartFromDatabase()

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
    background: url("~/assets/images/empty-cart-bg.webp") no-repeat top/8rem;
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
          background: url("data:image/svg+xml,%3csvg width='24' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3cpath fill-rule='evenodd' clip-rule='evenodd' d='M19.2425 7.22388C19.6618 7.49073 19.7854 8.04701 19.5186 8.46636L11.7593 18.4832C11.605 18.7256 11.3443 18.8798 11.0576 18.8982C10.7708 18.9165 10.4925 18.7969 10.3086 18.5762L5.3086 12.5762C4.99039 12.1943 5.04198 11.6268 5.42383 11.3086C5.80568 10.9904 6.37319 11.042 6.6914 11.4238L10.9024 16.477L18 7.49998C18.2669 7.08064 18.8231 6.95702 19.2425 7.22388Z' fill='%2316CA4E'/%3e %3c/svg%3e") no-repeat center/contain;
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
