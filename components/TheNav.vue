<template>
  <header class="header">
    <nav class="nav">
      <nuxt-link class="nav__logo" to="/">
        <img
          alt="logo"
          class="logo"
          src="~/assets/icons/logo.webp"
        >
      </nuxt-link>
      <div class="nav__actions">
        <div class="nav__search-form">
          <input
            v-model.lazy.trim="searchQuery"
            class="search-form__input"
            placeholder="Найти товары"
            type="text"
          >
          <button class="search-form__search-btn" @click="handleSearchClick" />
        </div>
        <div class="nav__user-actions">
          <button class="nav__burger" @click="sideMenuOpened = true">
            <span class="burger__line" />
          </button>
          <a class="user-actions__pa" @click="handleAccountClick">{{
            auth.isLoggedIn() ? auth.user.user_metadata.name : "Войти"
          }}</a>
          <nuxt-link
            class="user-actions__favorites"
            to="/favorites"
          >
            Избранное
            <div v-if="favoritesCount != '0'" class="favorites__icon">
              {{ favoritesCount }}
            </div>
          </nuxt-link>
          <nuxt-link
            class="user-actions__cart"
            to="/cart"
          >
            Корзина
            <div v-if="cartCount != '0'" class="cart__icon">
              {{ cartCount }}
            </div>
          </nuxt-link>
        </div>
      </div>
    </nav>
    <div class="categories">
      <ul class="list">
        <li v-for="item in categoriesList" :key="item.name">
          <nuxt-link :to="item.link" class="list__item">
            {{
              item.title
            }}
          </nuxt-link>
        </li>
      </ul>
    </div>
    <transition name="menu">
      <aside
        v-show="sideMenuOpened"
        class="aside-menu"
        @click.self="sideMenuOpened = false"
      >
        <header class="aside__header">
          <button class="aside__close" @click="sideMenuOpened = false">
            <span class="close__line" />
          </button>
          <div class="header__links">
            <a
              class="header__links-link"
              @click="handleAccountClick"
            >Войти / Зарегистрироваться</a>
          </div>
        </header>
        <div class="aside__categories">
          <div class="aside__categories-folder">
            <div
              class="title"
              @click="asideCategoriesOpened = !asideCategoriesOpened"
            >
              Категории
              <svg
                :class="asideCategoriesOpened ? 'arrow--up' : ''"
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
            <transition-group name="aside-categories">
              <nuxt-link
                v-for="item in categoriesList"
                v-show="asideCategoriesOpened"
                :key="item.name"
                :to="item.name"
                class="aside__categories-item"
              >
                {{ item.title }}
                <svg
                  class="arrow arrow--right"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.21967 9.21967C5.51256 8.92678 5.98744 8.92678 6.28033 9.21967L12 14.9393L17.7197 9.21967C18.0126 8.92678 18.4874 8.92678 18.7803 9.21967C19.0732 9.51256 19.0732 9.98744 18.7803 10.2803L12.5303 16.5303C12.2374 16.8232 11.7626 16.8232 11.4697 16.5303L5.21967 10.2803C4.92678 9.98744 4.92678 9.51256 5.21967 9.21967Z"
                  />
                </svg>
              </nuxt-link>
            </transition-group>
          </div>
        </div>
      </aside>
    </transition>
  </header>
</template>

<script>
import { useFavoritesStore } from '~/stores/favorites'
import { useCartStore } from '~/stores/cart'
import useAuth from '@/composables/useAuth'

export default {
  data: () => ({
    sideMenuOpened: false,
    favoritesStore: useFavoritesStore(),
    cartStore: useCartStore(),
    auth: useAuth(),

    searchQuery: '',

    categoriesList: [
      {
        name: 'mouse',
        title: 'Мыши',
        link: ''
      },
      {
        name: 'keyboards',
        title: 'Клавиатуры',
        link: ''
      },
      {
        name: 'chairs',
        title: 'Кресла',
        link: ''
      },
      {
        name: 'tables',
        title: 'Столы',
        link: ''
      },
      {
        name: 'monitors',
        title: 'Мониторы',
        link: ''
      },
      {
        name: 'merch',
        title: 'Мерч',
        link: ''
      }
    ],
    asideCategoriesOpened: false
  }),

  computed: {
    favoritesCount () {
      return this.favoritesStore.totalFavorites < 10
        ? this.favoritesStore.totalFavorites.toString()
        : '9+'
    },
    cartCount () {
      return this.cartStore.totalItems < 10
        ? this.cartStore.totalItems.toString()
        : '9+'
    }
  },

  methods: {
    handleAccountClick () {
      if (!this.auth.isLoggedIn()) {
        this.sideMenuOpened = false
        this.$emit('open-auth-modal')
      } else {
        this.$router.push('/profile')
      }
    },

    handleSearchClick () {
      if (this.searchQuery) {
        this.$router.push({
          path: '/search',
          query: {
            q: this.searchQuery
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.menu-enter-from,
.menu-leave-to {
  transform: translateX(-100%);
}

.menu-leave-active,
.menu-enter-active {
  transition: transform 0.5s ease;
}

.aside-categories-enter-from,
.aside-categories-leave-to {
  opacity: 0;
}

.aside-categories-leave-active,
.aside-categories-enter-active {
  transition: all 0.2s;
}

.header {
  width: 100%;
  margin: 15px 0 0 0;

  color: $font;
}

.aside-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: $light;
  z-index: 10;

  .aside__header {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $font;
    background: $bg;
    padding: 0 15px;

    .aside__close {
      background: none;
      position: relative;
      outline: none;
      border: none;
      width: 30px;
      height: 40px;
      padding: 0;

      .close__line {
        width: 100%;
        height: 4px;
        background: black;
        position: absolute;
        top: calc(50% - 2px);
        left: 0;

        border-radius: 2px;

        transform-origin: 50% 50%;
        transform: rotate(45deg);

        &:before {
          border-radius: 2px;

          content: "";
          width: 100%;
          height: 4px;
          background: black;
          position: absolute;
          left: 0;

          transform: rotate(-90deg);
        }
      }
    }

    .header__links {
      &-link {
        cursor: pointer;
        color: $font;
        text-decoration: underline;
        font-weight: 500;
        margin: 0 5px;
      }
    }
  }

  .aside__categories {
    width: 100%;
    background: $bg;
    margin: 10px 0;
    font-size: 1.1rem;
    font-weight: 500;

    .arrow {
      fill: $blue;
      transition: transform 0.5s ease;

      &--up {
        transform: rotate(180deg);
      }

      &--right {
        transform: rotate(-90deg);
      }
    }

    .title {
      width: 100%;
      color: $blue;
      height: 50px;
      padding: 0 35px;
      border-bottom: 1px solid $light;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-item {
      display: block;
      text-decoration: none;
      padding: 0 35px;
      border-bottom: 1px solid $light;

      width: 100%;
      height: 40px;
      color: $font;

      display: flex;
      justify-content: space-between;
      align-items: center;

      .arrow {
        fill: rgba(black, 0.4);
      }
    }
  }
}

.nav {
  display: flex;
  min-height: 40px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  &__logo {
    @media (max-width: 768px) {
      width: 100%;
    }

    .logo {
      height: 40px;
      margin: 0 15px 0 0;

      @media (max-width: 768px) {
        margin: 0 auto 15px auto;
        display: block;
      }
    }
  }

  &__actions {
    display: flex;
    width: 70%;
    justify-content: space-around;

    @media (max-width: 768px) {
      width: 100%;
      flex-direction: column-reverse;
    }
  }

  &__search-form {
    width: 50%;
    height: 100%;
    display: flex;

    &:hover {
      & > .search-form__input,
      & > .search-form__search-btn {
        border-color: $dark;
      }
    }

    @media (max-width: 768px) {
      width: 98%;
      padding: 0 10px;
      flex-direction: row-reverse;
      height: 40px;
      justify-content: center;
    }

    .search-form {
      &__input {
        width: 100%;
        height: 100%;

        border: 1px solid $default;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-right: none;
        outline: none;

        padding: 5px 15px;

        @media (max-width: 768px) {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left: none;
          border-right: 1px solid $default;
          width: 90%;
        }
      }

      &__search-btn {
        width: 40px;

        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border: 1px solid $default;
        outline: none;
        border-left: none;
        cursor: pointer;

        background: $light url("~/assets/icons/search.png") no-repeat center/18px;

        @media (max-width: 768px) {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          border-right: none;
          border-left: 1px solid $default;
          background-color: transparent;

          width: 10%;
        }
      }
    }
  }

  &__user-actions {
    width: 25%;
    height: 100%;
    display: flex;
    justify-content: space-around;

    @media (max-width: 768px) {
      height: 50px;
      align-self: flex-end;
      justify-content: flex-end;
      padding: 0 15px 0 0;
      width: 100%;
    }

    .nav__burger {
      display: none;
      background: none;
      position: relative;
      outline: none;
      border: none;
      width: 30px;
      height: 40px;
      padding: 0;

      cursor: pointer;

      align-self: center;

      margin: 0 auto 0 15px;

      .burger__line {
        width: 100%;
        height: 4px;
        background: black;
        position: absolute;
        top: calc(50% - 2px);
        left: 0;

        border-radius: 2px;

        &:after,
        &:before {
          border-radius: 2px;

          content: "";
          width: 100%;
          height: 4px;
          background: black;
          position: absolute;
          top: calc(50% - 10px);
          left: 0;
        }

        &:after {
          top: calc(50% + 6px);
        }
      }

      @media (max-width: 768px) {
        display: block;
      }
    }

    .user-actions {
      &__pa,
      &__favorites,
      &__cart {
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
          font-size: 0;
          padding: 0 25px;
          background-position: center;
        }

        @media (max-width: 768px) {
        }
      }

      &__pa {
        background-image: url("~/assets/icons/login.png");
      }

      &__favorites {
        background-image: url("~/assets/icons/favorites.png");
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
        }
      }

      &__cart {
        background-image: url("~/assets/icons/cart.png");
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
        }
      }
    }
  }
}

.categories {
  width: 100%;
  margin: 20px 0 0 0;

  @media (max-width: 768px) {
    display: none;
  }

  .list {
    list-style: none;
    display: flex;
    justify-content: space-around;
    padding: 0;

    &__item {
      text-decoration: none;
      color: $font;
      padding: 7px 15px;

      &:hover {
        border-bottom: 2px solid black;
      }
    }
  }
}
</style>
