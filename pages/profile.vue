<template>
  <div class="profile">
    <div class="profile__header">
      <div class="profile__title">
        {{ user.user_metadata.name }}
      </div>
    </div>
    <div class="profile__body">
      <aside class="profile__aside">
        <ul class="aside__menu">
          <li
            :class="currentTab === 'orders' && 'menu__link--selected'"
            class="menu__link"
          >
            <a @click="currentTab = 'orders'">Мои заказы</a>
          </li>
          <li
            :class="currentTab === 'preferences' && 'menu__link--selected'"
            class="menu__link"
          >
            <a @click="currentTab = 'preferences'">Настройки</a>
          </li>
        </ul>
      </aside>
      <div class="profile__content-wrapper">
        <div v-if="currentTab === 'orders'" class="profile__orders">
          <p class="orders__title">
            Мои заказы
          </p>
          <div class="orders__filter">
            <div
              :class="currentFilterTab === 'all' && 'filter__button--active'"
              class="filter__button"
              @click="currentFilterTab = 'all'"
            >
              Все заказы
            </div>
            <div
              :class="currentFilterTab === 'active' && 'filter__button--active'"
              class="
              filter__button"
              @click="currentFilterTab = 'active'"
            >
              Активные
            </div>
            <div
              :class="currentFilterTab === 'delivered' && 'filter__button--active'"
              class="
              filter__button"
              @click="currentFilterTab = 'delivered'"
            >
              Подтвержденные
            </div>
          </div>
          <div
            class="
              orders__list"
          >
            <LazyProfileOrder v-for="order in ordersList" :key="order.order_id" :order-info="order" />
          </div>
        </div>
        <div v-else class="profile__preferences">
          настройки
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'
import useSupabase from '@/composables/useSupabase'

import { useOrdersStore } from '~/stores/orders'

const orderStore = useOrdersStore()
const { user } = useAuth()
const { supabase } = useSupabase()
const currentTab = ref('orders')
const currentFilterTab = ref('all')

definePageMeta({
  middleware: 'auth'
})
useHead({
  title: 'Личный кабинет'
})

const ordersList = computed(() => {
  if (currentFilterTab.value === 'all') {
    return orderStore.orders
  } else if (currentFilterTab.value === 'active') {
    return orderStore.orders.filter(order => order.status === 'created')
  } else {
    return orderStore.orders.filter(order => order.status !== 'created')
  }
})

await orderStore.getOrders(user.value.id)

</script>

<style lang="scss" scoped>
.profile {
  padding: 0 10px;

  &__header {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid $default;
    padding: 0 0 10px 0;

    .profile__title {
      font-size: 1.4rem;
      font-weight: 500;
    }
  }

  &__body {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;

    .profile {
      &__aside {
        width: 25%;

        @media(max-width: 768px) {
          width: 100%;
        }

        .aside__menu {
          list-style: none;
          padding: 0;

          @media (max-width: 768px) {
            display: flex;
            justify-content: space-evenly;
          }

          .menu__link {
            margin: 10px 0;
            color: $dark;
            font-size: 0.95rem;
            cursor: pointer;

            &:hover {
              color: black;
            }

            &--selected {
              font-weight: 500;
              color: black;
            }
          }
        }
      }

      &__content-wrapper {
        width: 75%;
      }

      &__orders {
        .orders {
          &__title {
            font-size: 1.4rem;
            font-weight: 600;
          }

          &__list {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          &__filter {
            display: flex;
            border: 1px solid lighten($default, 12);
            width: fit-content;

            margin: 20px 0;

            @media (max-width: 768px) {
              margin: 20px auto;
            }

            .filter__button {
              padding: 8px 15px;
              border-right: 1px solid lighten($default, 12);
              cursor: pointer;
              font-size: 0.9rem;

              &:last-child {
                border: none;
              }

              &--active {
                background-color: darken($light, 4);
              }
            }
          }

        }
      }
    }
  }
}

@media (max-width: 768px) {
  .profile__body {
    flex-direction: column;

    .profile__content-wrapper,
    .profile__aside {
      width: 100%;
    }
  }
}
</style>
