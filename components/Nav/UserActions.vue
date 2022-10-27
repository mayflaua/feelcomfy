<template>
  <div class="nav__user-actions">
    <nuxt-link class="user-actions__home dark-invert" exact-active-class="user-actions__home--current" to="/">
      <span>Главная</span>
    </nuxt-link>

    <NavThemeButton hide-on-768 />

    <a
      :class="$route.path.includes('/profile') && 'user-actions__pa--current'"
      class="user-actions__pa dark-invert"
      href="/profile"
      @click.prevent="handleAccountClick"
    >
      <span>{{
        isLoggedIn() ? user.user_metadata.name : "Войти"
      }}</span>
    </a>
    <nuxt-link
      class="user-actions__favorites dark-invert"
      exact-active-class="user-actions__favorites--current"
      to="/favorites"
    >
      <span>Избранное</span>
      <div v-if="favoritesCount !== '0'" class="favorites__icon dark-invert">
        {{ favoritesCount }}
      </div>
    </nuxt-link>
    <nuxt-link
      class="user-actions__cart dark-invert"
      exact-active-class="user-actions__cart--current"
      to="/cart"
    >
      <span>Корзина</span>
      <div v-if="cartCount !== '0'" class="cart__icon dark-invert">
        {{ cartCount }}
      </div>
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { navigateTo } from '#app'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import useAuth from '~/composables/useAuth'

const emit = defineEmits(['open-auth-modal'])

const { isLoggedIn, user } = useAuth()

const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

const cartCount = computed(() => {
  return cartStore.totalItems < 10
    ? cartStore.totalItems?.toString() || '0'
    : '9+'
})

const favoritesCount = computed(() => {
  return favoritesStore.totalFavorites < 10
    ? favoritesStore.totalFavorites?.toString() || '0'
    : '9+'
})

const handleAccountClick = async () => {
  if (!isLoggedIn()) {
    emit('open-auth-modal')
  } else {
    await navigateTo('/profile/orders')
  }
}
</script>

<style lang="scss" scoped>

.nav__user-actions {
  height: 100%;
  width: max-content;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    height: 50px;
    padding: 0 15px 0 0;

    align-self: flex-end;

    .change-theme {
      display: none;
    }
  }

  @media (max-width: 480px) {
    justify-content: space-evenly;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0;

    width: 100%;
    height: 60px;

    z-index: 4;
    background-color: $bg;
    box-shadow: 0 -1px 12px rgba(black, 0.2);

  }

  .user-actions {
    &__pa,
    &__favorites,
    &__cart,
    &__home {
      text-decoration: none;
      color: $font;
      font-weight: 500;
      font-size: 1.1rem;
      padding: 0 10px 0 35px;
      display: flex;
      justify-content: center;
      align-items: center;

      cursor: pointer;

      background-repeat: no-repeat;
      background-size: 24px;
      background-position: 5px center;

      &:hover {
        background-color: $light;
        border-radius: 5px;
      }

      @media (max-width: 1300px) {

        span {
          display: none;
        }
        padding: 0 25px;
        background-position: center;
      }

      @media (max-width: 480px) {
        height: 80%;

        &:hover {
          background-color: transparent;
        }

        &--current {
          span {
            color: $blue !important;
            font-weight: 600;
          }
        }

        span {
          display: inline;
          margin: 54px 0 0 0;
          font-size: 0.8rem;
          color: $dark;
        }
      }
    }

    &__home {
      display: none;
      background-image: url("~/assets/icons/home.png");
      @media (max-width: 480px) {
        display: flex;
      }
    }

    &__pa {
      background-image: url("~/assets/icons/login.webp");
      @media (max-width: 480px) {
        order: 4;
      }
    }

    &__favorites {
      background-image: url("~/assets/icons/favorites.webp");
      position: relative;

      .favorites__icon {
        position: absolute;
        width: 15px;
        height: 15px;
        bottom: 8px;
        left: 2px;
        background: red;
        border-radius: 50%;
        color: $bg;
        font-weight: 800;
        text-align: center;
        line-height: 15px;
        font-size: 0.8rem;

        @media (max-width: 1300px) {
          left: 9px;
        }

        @media (max-width: 480px) {
          left: 55px;
        }
      }
    }

    &__cart {
      background-image: url("~/assets/icons/cart.webp");
      position: relative;

      .cart__icon {
        position: absolute;
        width: 15px;
        height: 15px;
        bottom: 8px;
        left: 2px;
        background: $blue;
        border-radius: 50%;
        color: $bg;
        font-weight: 800;
        text-align: center;
        line-height: 15px;
        font-size: 0.8rem;

        @media (max-width: 1300px) {
          left: 9px;
        }

        @media (max-width: 480px) {
          left: 50px;
        }
      }
    }
  }
}

</style>
