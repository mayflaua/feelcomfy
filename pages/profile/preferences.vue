<template>
  <NuxtLayout name="profile">
    <div v-if="_mounted && authState" class="profile__preferences">
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
          <button class="buttons__logout" @click="handleSigninOut">
            Выйти из системы
          </button>
          <LazyUIButton
            :loading-state="saveState"
            class="buttons__save"
            text="Сохранить"
            type="submit"
          />
        </div>
      </form>
    </div>
    <UILoader v-else v2 />
  </NuxtLayout>
</template>

<script setup>
// TODO: signOut не удаляет сессию из localStorage или что то ее пересоздает после удаления
import useSupabase from '@/composables/useSupabase'
import useAuth from '@/composables/useAuth'

useHead({
  title: 'Настройки'
})

const { supabase } = useSupabase()

const { user, signOut } = useAuth()

const saveState = ref(false)
const handleSaveClick = async () => {
  saveState.value = true
  await supabase.auth.update({
    ...formFields
  })
  saveState.value = false
}

const handleSigninOut = async () => {
  await signOut()
}

const authState = ref(null)

const formFields = reactive({
  email: '',
  data: {
    name: '',
    phone: '',
    lastName: '',
    middleName: '',
    gender: '',
    birthday: ''
  }
})

watch(user, () => {
  if (user.value) {
    formFields.email = user.value?.email || ''
    formFields.data = {
      name: user.value.user_metadata.name,
      phone: user.value.user_metadata.phone,
      lastName: user.value.user_metadata.lastName,
      middleName: user.value.user_metadata.middleName,
      gender: user.value.user_metadata.gender,
      birthday: user.value.user_metadata.birthday
    }
    authState.value = true
  }
})
const _mounted = ref(false)
onMounted(() => (_mounted.value = true))
</script>

<style lang="scss" scoped>
.profile__preferences {
  border: 1px solid $light;
  padding: 0 20px 20px;
  width: 75%;

  @media (max-width: 768px) {
    width: 100%;
  }

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
              width: 8rem;
            }
          }
        }
      }
    }

  }
}
</style>
