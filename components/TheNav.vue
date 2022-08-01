<template>
  <header class="header">
    <nav class="nav">
      <nuxt-link to="/" class="nav__logo">
        <img class="logo" src="~/public/icons/logo.png" alt="logo" />
      </nuxt-link>
      <div class="nav__search-form">
        <input
          type="text"
          class="search-form__input"
          placeholder="Найти товары"
        /><button class="search-form__search-btn">Найти</button>
      </div>
      <div class="nav__user-actions">
        <nuxt-link to="/login" class="user-actions__login">Войти</nuxt-link>
        <nuxt-link to="/favorites" class="user-actions__favorites"
          >Избранное</nuxt-link
        >
        <nuxt-link to="/card" class="user-actions__cart">Корзина</nuxt-link>
      </div>
    </nav>
    <div class="categories">
      <ul class="list">
        <li><nuxt-link class="list__item">Мыши</nuxt-link></li>
        <li><nuxt-link class="list__item">Клавиатуры</nuxt-link></li>
        <li><nuxt-link class="list__item">Кресла</nuxt-link></li>
        <li><nuxt-link class="list__item">Столы</nuxt-link></li>
        <li><nuxt-link class="list__item">Мониторы</nuxt-link></li>
        <li><nuxt-link class="list__item">Мерч</nuxt-link></li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "~/assets/style/main.scss";
.header {
  width: 100%;
  margin: 15px 0 0 0;

  color: $font;
}

.nav {
  display: flex;
  height: 40px;

  &__logo {
    width: 25%;

    .logo {
      width: 80%;
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

    .search-form {
      &__input {
        width: 85%;
        height: 100%;

        border: 1px solid $default;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-right: none;
        outline: none;

        padding: 5px 15px;
      }

      &__search-btn {
        width: 15%;
        height: 100%;

        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border: 1px solid $default;
        outline: none;
        border-left: none;

        background: $light;
      }
    }
  }

  &__user-actions {
    width: 25%;
    display: flex;
    justify-content: space-around;
    .user-actions {
      &__login,
      &__favorites,
      &__cart {
        text-decoration: none;
        color: $font;
        font-weight: 500;
        font-size: 1.1em;
        padding: 0 10px 0 35px;
        display: flex;
        justify-content: center;
        align-items: center;

        background-repeat: no-repeat;
        background-size: 24px;
        background-position: 5px center;

        &:hover {
          background-color: $light;
          border-radius: 5px;
        }
      }

      &__login {
        background-image: url("~/icons/login.png");
      }
      &__favorites {
        background-image: url("~/icons/favorites.png");
      }
      &__cart {
        background-image: url("~/icons/cart.png");
      }
    }
  }
}

.categories {
  width: 100%;
  margin: 20px 0 0 0;

  .list {
    list-style: none;
    display: flex;
    justify-content: space-around;

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
