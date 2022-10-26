<template>
  <form
    class="auth-signup"
    @input="validateForm"
    @submit.prevent="isFormValid ? handleSignUp() : null"
  >
    <p class="auth-signup__title">
      Зарегистрируйтесь и начните совершать покупки на FeelComfy.
    </p>
    <input
      ref="emailElement"
      v-model.lazy="signUpForm.email"
      class="auth-signup__email-input"
      placeholder="Email"
      required
      type="email"
      ui-input
    >
    <input
      v-model.lazy="signUpForm.name"
      class="auth-signup__name-input"
      placeholder="Имя"
      type="text"
      ui-input
    >
    <input
      v-model="signUpForm.password"
      class="auth-signup__password-input"
      placeholder="Придумайте пароль"
      type="password"
      ui-input
    >
    <div class="auth-signup__validation">
      <div
        :class="validations.length && 'validate--valid'"
        class="validate"
      >
        Не менее 8 символов
      </div>
      <div
        :class="validations.numbers && 'validate--valid'"
        class="validate"
      >
        Состоит из цифр и латинских букв
      </div>
      <div
        :class="validations.letters && 'validate--valid'"
        class="validate"
      >
        Содержит строчные и заглавные буквы
      </div>
    </div>

    <p v-if="errMessage" class="auth-error">
      {{ errMessage }}
    </p>

    <UIButton
      :disabled="!isFormValid"
      :loading-state="isLoading"
      class="auth-signup__signup-btn"
      text="Зарегистрироваться"
      type="submit"
    >
      Зарегистрироваться
    </UIButton>
  </form>
</template>

<script lang="ts" setup>
import { computed, reactive, Ref, ref } from 'vue'
import useAuth from '@/composables/useAuth'

const { signUp } = useAuth()

interface SignUpForm {
  email: string
  password: string
  name: string
}

const emit = defineEmits(['success'])

const signUpForm = reactive<SignUpForm>({
  email: '',
  password: '',
  name: ''
})

const emailElement: Ref<HTMLInputElement> = ref(null)

const validations = reactive({
  length: false,
  numbers: false,
  letters: false,

  name: false,
  email: false
})

const isFormValid = computed(() => Object.values(validations).every(Boolean))

const validateForm = (): void => {
  errMessage.value = ''
  validations.length = signUpForm.password.length >= 8

  validations.numbers =
    !!signUpForm.password.match(/[0-9]/) &&
    !!signUpForm.password.match(/[a-z]/)

  validations.letters =
    signUpForm.password.toLowerCase() !== signUpForm.password

  validations.name = signUpForm.name.length >= 1

  validations.email = emailElement.value.validity.valid
}

const errMessage: Ref<string> = ref('')
const isLoading: Ref<boolean> = ref(false)
const handleSignUp = async (): Promise<void> => {
  isLoading.value = true
  try {
    await signUp(signUpForm)
    emit('success')
  } catch (err) {
    const errCode = err.status
    switch (errCode) {
      case 400:
        errMessage.value = 'Пользователь с таким email уже зарегистрирован'
    }
  }
  isLoading.value = false
}
</script>

<style lang="scss" scoped>
.auth-signup {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 25px;
  gap: 1rem;
  height: 100%;

  .auth-error {
    text-align: center;
    background-color: rgb(233, 108, 108);
    color: white;
    padding: 10px 0;
    border-radius: 7px;
    margin: 15px 0 0 0;
  }

  &__email-input,
  &__password-input,
  &__name-input {
    display: block;
    padding: 7px 10px;
    border: 1px solid $light;
    border-radius: 3px;
    outline: none;
    font-size: 0.9rem;

    &:focus {
      border-color: $default;
    }
  }

  &__signup-btn {
    border-radius: 7px;
    background-color: $blue;
    border: none;
    outline: none;
    padding: 12px 0;
    color: white;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background-color: darken($blue, 5);
    }

    &--disabled {
      opacity: 0.7;

      &:hover {
        background-color: $default;
      }
    }
  }

  &__validation {
    .validate {
      font-size: 0.8rem;
      color: $default;
      display: flex;
      margin: 0 0 5px 0;

      &:before {
        content: "";
        display: block;
        margin: 0 10px 0 0;
        width: 15px;
        height: 15px;
        background: url("~/assets/icons/valid.webp") no-repeat center/contain;
        filter: grayscale(100);
        transition: filter 0.3s ease;
      }

      &--valid:before {
        filter: none;
      }
    }
  }
}

</style>
