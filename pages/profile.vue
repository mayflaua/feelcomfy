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

          <div
            class="orders__list"
          >
            <ProfileOrder v-for="order in ordersList" :key="order.order_id" :order-info="order" />
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

// eslint-disable-next-line no-undef
definePageMeta({
  middleware: 'auth'
})
const orderStore = useOrdersStore()
const { user } = useAuth()
const { supabase } = useSupabase()
const currentTab = ref('orders')

const ordersList = computed(() => orderStore.orders)

onBeforeMount(() => orderStore.getOrders(user.value.id))

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
