<template>
  <div class="order-item">
    <LazyProfileAddReview v-if="_showReviewModal" :item-id="_itemIdForReview" @close="_showReviewModal = false" />

    <div class="order-item__header">
      <p class="header__id">
        ID заказа {{ orderInfo.order_id }}
        <UIButton
          v-if="['created', 'not-paid'].includes(orderStatus)"
          :loading-state="confirmDeliveryState"
          :text="orderStatus === 'created' ? 'Подтвердить получение' : 'Перейти к оплате'"
          class="submit-btn"
          @click.prevent="handleSubmitButton"
        />
      </p>
    </div>
    <div class="order-item__body">
      <p class="body__status">
        <span>Статус</span><span>{{ orderStatusFormatted }}</span>
      </p>
      <p class="body__date">
        <span>Дата заказа:</span><span>{{ orderDate }}</span>
      </p>
      <p class="body__worth">
        <span>Сумма заказа:</span><span>{{ formatter.format(orderInfo.worth) }}</span>
      </p>
    </div>
    <div class="order-item__goods">
      <div class="goods__header" @click="showGoods = !showGoods">
        Товары ({{ orderInfo.order.length }})
        <svg
          :class="showGoods ? 'arrow--up' : ''"
          class="arrow"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.21967 9.21967C5.51256 8.92678 5.98744 8.92678 6.28033 9.21967L12 14.9393L17.7197 9.21967C18.0126 8.92678 18.4874 8.92678 18.7803 9.21967C19.0732 9.51256 19.0732 9.98744 18.7803 10.2803L12.5303 16.5303C12.2374 16.8232 11.7626 16.8232 11.4697 16.5303L5.21967 10.2803C4.92678 9.98744 4.92678 9.51256 5.21967 9.21967Z"
          />
        </svg>
      </div>
      <div v-if="showGoods" class="goods__list">
        <ProfileOrderProduct
          v-for="item in orderInfo.order"
          :key="item.id"
          :allow-reviews="orderInfo.status === 'granted'"
          :item="item"
          @add-review="handleAddReview"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { navigateTo } from '#app'
import useSupabase from '@/composables/useSupabase'
import { Order } from '~/types/orders'

const { supabase } = useSupabase()

const props = defineProps<{
  orderInfo: Order
}>()

const showGoods = ref(false)
const confirmDeliveryState = ref(false)

const _showReviewModal = ref(false)
const _itemIdForReview = ref(0)

const handleAddReview = (id): void => {
  _itemIdForReview.value = id
  _showReviewModal.value = true
}

const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
})

const orderDate = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(props.orderInfo.created_at))

const orderStatus = ref(props.orderInfo.status)
const orderStatusFormatted = computed(() => {
  if (orderStatus.value === 'not-paid') {
    return 'Не оплачен'
  } else if (orderStatus.value === 'created') {
    return 'Создан'
  } else {
    return 'Выдан покупателю'
  }
})

const handleSubmitButton = async () => {
  if (props.orderInfo.status === 'created') {
    confirmDeliveryState.value = true
    await supabase.from('orders').update({ status: 'granted' }).eq('order_id', props.orderInfo.order_id)
    orderStatus.value = 'granted'
    confirmDeliveryState.value = false
  } else if (props.orderInfo.status === 'not-paid') {
    await navigateTo({ name: 'order', query: { order: props.orderInfo.order_id } })
  }
}

</script>

<style lang="scss" scoped>
.order-item {
  display: flex;
  flex-direction: column;
  border: 1px solid $default;

  &__header {
    border-bottom: 1px solid $default;
    height: 50px;
    display: flex;

    .header__id {
      align-items: center;
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 1.3rem;
      font-weight: 500;
      margin: 0 15px;
    }

    .submit-btn {
      width: 13rem;
    }
  }

  &__body {
    border-bottom: 1px solid $default;

    .body__status,
    .body__date,
    .body__worth {
      display: flex;
      color: $dark;
      margin: 10px 0 10px 15px;

      span {
        width: 25%;
        color: $default;

        &:last-child {
          width: 75%;
          color: $font;
        }
      }
    }

    .body__status span:last-child {
      background: lighten($blue, 5);
      color: white;
      font-weight: 500;
      width: unset;
      padding: 3px 7px;
      border-radius: 30px;
    }
  }

  &__goods {

    .goods {
      &__header {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 15px;
        cursor: pointer;

        .arrow {
          fill: $blue;
          transition: transform 0.5s ease;

          &--up {
            transform: rotate(180deg);
          }
        }
      }

      &__list {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
