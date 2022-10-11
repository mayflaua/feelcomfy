<template>
  <UILoader v-if="!_mounted" fullscreen v2 />
  <div v-else-if="isLoggedIn()" class="profile">
    <div class="profile__header">
      <div class="profile__title">
        {{ user?.user_metadata.name }}
      </div>
    </div>
    <div class="profile__body">
      <aside class="profile__aside">
        <ul class="aside__menu">
          <li>
            <nuxt-link active-class="menu__link--selected" class="menu__link" to="/profile/orders">
              Мои заказы
            </nuxt-link>
          </li>
          <li>
            <nuxt-link active-class="menu__link--selected" class="menu__link" to="/profile/preferences">
              Настройки
            </nuxt-link>
          </li>
        </ul>
      </aside>
      <slot class="profile__content-wrapper" />
    </div>
  </div>
  <LazyUINoUser v-else />
</template>

<script setup>
import useAuth from '@/composables/useAuth'

const { user, isLoggedIn } = useAuth()

const _mounted = ref(false)

onMounted(() => (_mounted.value = true))

</script>

<style lang="scss" scoped>
.profile {
  padding: 0 10px;

  @media (max-width: 768px) {
    padding: 0;
  }

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
          position: sticky;
          top: 2rem;
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
            text-decoration: none;

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
