<template>
  <div class="order">
    <div class="order__free-delivery">
      <div class="free-delivery__indicator">
        <ClientOnly>
          <CircleProgress
            :border-bg-width="3"
            :border-width="3"
            :percent="cartStore.freeDeliveryPercent"
            :size="35"
            class="circle"
            empty-color="#fff"
            fill-color="rgb(22,202,78)"
          />
        </ClientOnly>
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
          {{ _f.format(cartStore.freeDeliveryDifference) }}
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
        <span>
          {{ _f.format(cartStore.totalSelectedItemsWorth) }}
        </span>
      </p>
      <p v-if="!cartStore.isFreeDelivery" class="info__delivery">
        Доставка: <span>{{ _f.format(1000) }}</span>
      </p>
      <p class="info__total">
        Итого:
        <span>{{
          _f.format(cartStore.totalCartWorthWithDelivery)
        }}</span>
      </p>
      <p v-if="cartStore.summarySavings" class="info__saving">
        Вы экономите {{ _f.format(cartStore.summarySavings) }}
      </p>
      <LazyUIButton
        :loading-state="makeOrderState || cartStore._updating"
        class="info__button"
        path=""
        text="Перейти к оформлению"
        @click="handleMakeOrderClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>

import { navigateTo } from '#app'
import { defineAsyncComponent, ref } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useOrdersStore } from '~/stores/orders'
import type { OrderProductCompressed } from '~/types/orders'

const CircleProgress = defineAsyncComponent({
  loader: () => import('vue3-circle-progress')
})

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
/* currency formatter */
const _f = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
})

const makeOrderState = ref(false)

const handleMakeOrderClick = async (): Promise<void> => {
  if (cartStore.totalSelectedItemsWorth !== 0 && cartStore.cart) {
    makeOrderState.value = true
    /* make orders list from selected items */
    const order: OrderProductCompressed[] = []
    cartStore.cart.forEach(item => (
      item.checked
        ? order.push({
          id: item.pk_id,
          qty: item.qty,
          price: item.final_price,
          units_in_stock: item.units_in_stock
        })
        : null
    ))
    /* insert order to database and get its order_id */
    const orderID = await ordersStore.makeOrder(order)

    /* redirect to order confirmation page */
    await navigateTo({
      path: '/order',
      query: { order: orderID }
    })
    makeOrderState.value = false
  }
}

</script>

<style lang="scss" scoped>
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
  .order {
    width: 100%;
    border: none;

    &__free-delivery {
      gap: 15px;
    }
  }
}
</style>
