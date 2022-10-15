<template>
  <aside
    class="aside-menu"
    @click.self="$emit('close-aside')"
  >
    <header class="aside__header">
      <button class="aside__close dark-invert" @click="$emit('close-aside')">
        <span class="close__line" />
      </button>
      <div v-if="!isLoggedIn()" class="header__links">
        <a
          class="header__links-link"
          @click="$emit('open-auth-modal')"
        >Войти / Зарегистрироваться</a>
      </div>
      <NavThemeButton />
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
</template>

<script setup>

const { isLoggedIn } = useAuth()

const emit = defineEmits(['close-aside', 'open-auth-modal'])

const asideCategoriesOpened = ref(false)

const categoriesList = await $fetch('/api/categories')

</script>

<style lang="scss" scoped>
.aside-categories-enter-from,
.aside-categories-leave-to {
  opacity: 0;
}

.aside-categories-leave-active,
.aside-categories-enter-active {
  transition: all 0.2s;
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

      cursor: pointer;

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
      margin: 0 10px 0 auto;

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

    cursor: pointer;

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

</style>
