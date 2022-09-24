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
          заказы
        </div>
        <div v-else class="profile__preferences">
          настройки
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { definePageMeta } from 'nuxt/dist/pages/runtime'
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'
import useSupabase from '@/composables/useSupabase'

definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const { supabase: db } = useSupabase()

const currentTab = ref('orders')
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

        .aside__menu {
          list-style: none;
          padding: 0;

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
    }
  }
}
</style>
