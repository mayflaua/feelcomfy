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
          <div class="orders__filter" ui-switcher>
            <div
              :class="currentFilterTab === 'all' && 'active'"
              ui-switcher-button
              @click="currentFilterTab = 'all'"
            >
              Все заказы
            </div>
            <div
              :class="currentFilterTab === 'active' && 'active'"
              ui-switcher-button
              @click="currentFilterTab = 'active'"
            >
              Активные
            </div>
            <div
              :class="currentFilterTab === 'delivered' && 'active'"
              ui-switcher-button
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
          <p class="preferences__title">
            Мои данные
          </p>
          <form class="preferences__form" @submit.prevent="handleSaveClick">
            <div class="form__fio">
              <div>
                <label class="label" for="last-name">Фамилия</label>
                <input
                  v-model="formFields.data.lastName"
                  name="last-name"
                  placeholder="Фамилия"
                  required
                  type="text"
                  ui-input
                >
              </div>

              <div>
                <label class="label" for="name">Имя</label>
                <input
                  v-model="formFields.data.name"
                  name="name"
                  placeholder="Имя"
                  required
                  type="text"
                  ui-input
                >
              </div>

              <div>
                <label class="label" for="middle-name">Отчество</label>
                <input
                  v-model="formFields.data.middleName"
                  name="middle-name"
                  placeholder="Отчество"
                  type="text"
                  ui-input
                >
              </div>
            </div>

            <div class="form__contacts">
              <div>
                <label class="label" for="name">Электронная почта</label>
                <input
                  v-model="formFields.email"
                  name="name"
                  placeholder="Электронная почта"
                  required
                  type="email"
                  ui-input
                >
              </div>

              <div>
                <label class="label" for="middle-name">Номер телефона</label>
                <input
                  v-model="formFields.data.phone"
                  name="middle-name"
                  placeholder="Номер телефона"
                  required
                  type="phone"
                  ui-input
                >
              </div>
            </div>

            <div class="form__gender">
              <p class="gender__label">
                Пол
              </p>
              <div class="gender__switcher" ui-switcher>
                <div
                  :class="formFields.data.gender === 'male' && 'active'"
                  class="switcher__male"
                  ui-switcher-button
                  @click="formFields.data.gender = 'male'"
                >
                  Мужской
                </div>
                <div
                  :class="formFields.data.gender === 'female' && 'active'"
                  class="switcher__female"
                  ui-switcher-button
                  @click="formFields.data.gender = 'female'"
                >
                  Женский
                </div>
              </div>
            </div>

            <div class="form__birthday">
              <p class="label">
                Дата рождения
              </p>
              <input
                v-model="formFields.data.birthday"
                class="input__birthday"
                min="2018-01-01"
                name="birthday"
                type="date"
                ui-input
              >
            </div>

            <div class="form__buttons">
              <button class="buttons__logout" @click="signOut">
                Выйти из системы
              </button>
              <LazyUIButton
                class="buttons__save"
                text="Сохранить"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useAuth from '@/composables/useAuth'
import useSupabase from '@/composables/useSupabase'
import { useOrdersStore } from '~/stores/orders'

const { supabase } = useSupabase()

const orderStore = useOrdersStore()
const { user, signOut } = useAuth()
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

// TODO: loading indicator
const handleSaveClick = async () => {
  await supabase.auth.update({
    ...formFields
  })
}

const formFields = reactive({
  email: user.value.email,
  data: {
    name: user.value.user_metadata.name,
    phone: user.value.user_metadata.phone || '',
    lastName: user.value.user_metadata?.lastName || '',
    middleName: user.value.user_metadata?.middleName || '',
    gender: user.value.user_metadata?.gender || '',
    birthday: user.user_metadata?.birthday || ''
  }
})

await orderStore.getOrders(user.value.id)

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
            margin: 20px 0;
            @media (max-width: 768px) {
              margin: 20px auto;
            }
          }
        }
      }

      &__preferences {
        border: 1px solid $light;
        padding: 0 20px 20px;

        .preferences {

          &__title {
            font-size: 1.4rem;
            font-weight: 500;
          }

          &__form {
            color: darken($dark, 20);

            .form {
              &__fio,
              &__contacts {
                display: flex;
                gap: 10px;
                margin: 20px 0 0 0;
                padding: 0 0 35px 0;
                border-bottom: 1px solid $light;

                @media (max-width: 500px) {
                  flex-direction: column;
                }

                .label {
                  margin: 0 0 3px 0;
                  display: inline-block;
                }
              }

              &__birthday {
                margin: 20px 0 0 0;

                input {
                  width: 150px;
                }
              }

              &__buttons {
                margin: 20px 0 0 0;
                display: flex;
                justify-content: space-between;

                .buttons {
                  &__logout {
                    border: none;
                    outline: none;
                    background: none;
                    cursor: pointer;

                    font-size: 1.05rem;
                    font-weight: 500;
                  }

                  &__save {
                    border-radius: 20px;
                  }
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
  .profile__body {
    flex-direction: column;

    .profile__content-wrapper,
    .profile__aside {
      width: 100%;
    }
  }
}
</style>
