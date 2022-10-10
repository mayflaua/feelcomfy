<template>
  <header class="header">
    <nav class="nav">
      <nuxt-link class="nav__logo" to="/">
        <ColorScheme>
          <nuxt-img
            :src="colorMode.preference === 'light' ? 'logo.png' :'logo-dark.png'"
            alt="logo"
            class="logo"
            format="webp"
            preload
          />
        </ColorScheme>
      </nuxt-link>
      <div class="nav__actions">
        <div class="nav__search-form">
          <input
            v-model.trim="searchQuery"
            class="search-form__input"
            placeholder="Найти товары"
            type="text"
            ui-input
            @blur="suggestionsList = []"
            @input="getSuggestions"
          >
          <button
            class="search-form__search-btn"
            @click="handleSearchClick(searchQuery)"
          >
            <span class="search-btn__icon dark-invert" />
          </button>
          <transition name="list">
            <div
              v-if="suggestionsList.length !== 0"
              :class="{'suggestions-list--disabled':
                fetchingSuggestions}"
              class="suggestions-list"
            >
              <transition-group name="list">
                <p v-for="item in suggestionsList" :key="item" class="suggestion" @click="handleSearchClick(item)">
                  {{ item }}
                </p>
              </transition-group>
            </div>
          </transition>
        </div>
        <div class="nav__user-actions">
          <ColorScheme>
            <button
              :class="colorMode.preference === 'light'
                ? 'theme-light'
                : 'theme-dark'"
              class="change-theme"
              @click="changeTheme"
            />
          </ColorScheme>
          <button class="nav__burger dark-invert" @click="sideMenuOpened = true">
            <span class="burger__line" />
          </button>
          <a class="user-actions__pa dark-invert" @click="handleAccountClick">{{
            auth.isLoggedIn() ? auth.user.user_metadata.name : "Войти"
          }}</a>
          <nuxt-link
            class="user-actions__favorites dark-invert"
            to="/favorites"
          >
            Избранное
            <div v-if="favoritesCount != '0'" class="favorites__icon dark-invert">
              {{ favoritesCount }}
            </div>
          </nuxt-link>
          <nuxt-link
            class="user-actions__cart dark-invert"
            to="/cart"
          >
            Корзина
            <div v-if="cartCount != '0'" class="cart__icon dark-invert">
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
          <button class="aside__close dark-invert" @click="sideMenuOpened = false">
            <span class="close__line" />
          </button>
          <div class="header__links">
            <!-- TODO: менять текст ссылки или ваще ее убирать если авторизован-->
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
                  class="arrow arrow--right dark-invert"
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
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '~/stores/cart'
import useAuth from '@/composables/useAuth'
import useSearch from '@/composables/useSearch'

export default {
  data: () => ({
    sideMenuOpened: false,
    favoritesStore: useFavoritesStore(),
    cartStore: useCartStore(),
    auth: useAuth(),
    search: useSearch(),
    suggestionsList: [],

    fetchingSuggestions: false,

    colorMode: useColorMode(),

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
        ? this.favoritesStore.totalFavorites?.toString() || '0'
        : '9+'
    },
    cartCount () {
      return this.cartStore.totalItems < 10
        ? this.cartStore.totalItems?.toString() || '0'
        : '9+'
    },

    color: () => this.colorMode.preference
  },

  methods: {
    changeTheme () {
      this.colorMode.preference === 'light'
        ? this.colorMode.preference = 'dark'
        : this.colorMode.preference = 'light'
    },
    handleAccountClick () {
      if (!this.auth.isLoggedIn()) {
        this.sideMenuOpened = false
        this.$emit('open-auth-modal')
      } else {
        this.$router.push('/profile/orders')
      }
    },

    handleSearchClick (query) {
      if (query) {
        this.$router.push({
          path: '/search',
          query: {
            q: query
          }
        })
        this.searchQuery = ''
      }
    },

    async getSuggestions () {
      if (this.searchQuery) {
        this.fetchingSuggestions = true
        this.suggestionsList = await this.search.fetchSuggestions(this.searchQuery)
        this.fetchingSuggestions = false
      } else {
        this.suggestionsList = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

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

      animation: .4s logo ease;

      @keyframes logo {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

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
    position: relative;

    &:hover {
      & > .search-form__input,
      & > .search-form__search-btn {
        border-color: $dark;
      }
    }

    .suggestions-list {
      overflow: auto;

      width: 100%;
      max-height: 300px;
      height: min-content;

      position: absolute;
      z-index: 1;
      top: 95%;
      left: 0;

      padding: 0.4rem 0 0 0;

      background-color: $light;
      border: 1px solid $default;
      border-radius: 0 0 3px 3px;

      &--disabled {
        opacity: 0.7;
        pointer-events: none;
      }

      .suggestion {
        font-size: 0.9rem;
        padding: 0.35rem 1rem;
        margin: 0;

        cursor: pointer;

        &:hover {
          background-color: lighten($blue, 10);
          color: white;
        }
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

        z-index: 2;
        position: relative;

        border: 1px solid $default;
        border-radius: 0;
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

        z-index: 2;
        position: relative;

        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border: 1px solid $default;
        outline: none;
        border-left: none;
        cursor: pointer;

        background-color: $light;

        .search-btn__icon {
          width: 100%;
          height: 100%;
          display: block;
          background: url("~/assets/icons/search.webp") no-repeat center/18px;
        }

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
        background-image: url("~/assets/icons/login.webp");
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
        }
      }
    }
  }

  .change-theme {
    min-width: 24px;
    height: 24px;
    margin: 0 10px 0 0;
    border: none;
    outline: none;

    opacity: 0.8;

    align-self: center;
    cursor: pointer;

    transition: opacity 0.2s ease;

    @keyframes theme-light {
      from {
        transform: rotate(1turn);
        opacity: 0;
      }
      to {
        transform: rotate(0.5turn);
        opacity: 0.8;
      }
    }
    @keyframes theme-dark {
      from {
        transform: rotate(0.5turn);
        opacity: 0;
      }
      to {
        transform: rotate(1turn);
        opacity: 0.8;
      }
    }

    &.theme-light {
      background: url('~/assets/icons/sun.png') transparent center/cover no-repeat;
      animation: 1s theme-light ease;
    }

    &.theme-dark {
      background: url('~/assets/icons/moon.png') transparent center/cover no-repeat;
      animation: 1s theme-dark ease;
    }

    &:hover {
      opacity: 1;
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

    li {
      border-right: 1px solid $light;
      flex-grow: 1;
      text-align: center;

      &:last-child {
        border-right: none;
      }
    }

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
