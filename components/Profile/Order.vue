<template>
  <div class="order-item">
    <div class="order-item__header">
      <p class="header__id">
        ID заказа {{ orderInfo.order_id }}
        <UIButton
          v-if="orderStatus ==='created'"
          class="submit-btn"
          text="Подтвердить получение"
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
        <div v-for="item in orderInfo.order" :key="item.id" class="list__item">
          <img :alt="item.title" :src="item.thumbnail_url" class="item__image">
          <div class="item__info">
            <div class="title">
              {{ item.title }}
            </div>
            <div v-if="item.model" class="model">
              <span>Модель:</span> <span>{{ item.model }}</span>
            </div>
            <div v-if="item.color" class="color">
              <span>Цвет:</span> <span>{{ item.color }}</span>
            </div>
            <div class="quantity">
              <span>Количество</span> <span>{{ item.qty }}</span>
            </div>
            <div class="price">
              <span>Стоимость</span> <span>{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useSupabase from '@/composables/useSupabase'

const { supabase } = useSupabase()

const props = defineProps({
  orderInfo: {
    type: Object,
    required: true
  }
})

const showGoods = ref(false)

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
  /* поменяй если чето со статусами поприкольнее сделаешь */
  return orderStatus.value === 'created' ? 'Создан' : 'Выдан покупателю'
})

const handleSubmitButton = async () => {
  await supabase.from('orders').update({ status: 'granted' }).eq('order_id', props.orderInfo.order_id)
  /* поменяй если чето со статусами поприкольнее сделаешь */
  orderStatus.value = 'че бы я сюда не вставил все равно заказ будет доставлен'
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

        .list__item {
          display: flex;
          gap: 20px;
          padding: 15px 0;
          margin: 0 20px;
          border-bottom: 1px solid $default;

          &:last-child {
            border: none;
          }

          .item__image {
            width: 90px;
            height: 100%;
          }

          .item__info {
            display: flex;
            flex-direction: column;
            gap: 6px;
            font-size: 0.9rem;
            color: $font;
            width: 100%;

            .title {
              font-size: 1rem;
              margin: 0 0 20px 0;
            }

            .model, .color, .quantity, .price {
              display: flex;

              span {
                color: $dark;
                width: max(90px, 17%);

                &:last-child {
                  color: $font;
                  width: 83%;
                }
              }
            }
          }

        }
      }
    }
  }
}

@media (max-width: 768px) {

}
</style>
