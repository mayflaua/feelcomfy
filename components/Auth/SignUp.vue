<template>
  <div v-if="!showConfirmationMessage">
    <div class="signup-modal">
      <form
        class="modal__body"
        @input="validateForm"
        @submit.prevent="isFormValid ? handleSignUp() : null"
      >
        <p class="body__title">
          Зарегистрируйтесь и начните совершать покупки на FeelComfy.
        </p>
        <input
          ref="emailElement"
          v-model.lazy="signUpEmail"
          class="body__email-input"
          placeholder="Email"
          required
          type="email"
          ui-input
        >
        <input
          v-model.lazy="signUpName"
          class="body__name-input"
          placeholder="Имя"
          type="text"
          ui-input
        >
        <input
          v-model="signUpPassword"
          class="body__password-input"
          placeholder="Придумайте пароль"
          type="password"
          ui-input
        >
        <div class="body__validation">
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
        <button
          :class="!isFormValid && 'body__signup-btn--disabled'"
          class="body__signup-btn"
          type="submit"
        >
          Зарегистрироваться
        </button>
      </form>
      <div class="modal__footer">
        <div class="footer__signup">
          <span class="signup__text">Уже есть аккаунт? </span>
          <a
            class="signup__link"
            @click.prevent="$emit('has-account')"
          >Войти</a>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="confirm-email">
    Подтвердите регистрацию по ссылке, отправленной на email
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import useAuth from '../../composables/useAuth'

const { signUp } = useAuth()

const signUpEmail = ref('')
const signUpPassword = ref('')
const signUpName = ref('')
const emailElement = ref(null)

const showConfirmationMessage = ref(false)

const validations = reactive({
  length: false,
  numbers: false,
  letters: false,

  name: false,
  email: false
})

const isFormValid = computed(() => Object.values(validations).every(Boolean))

const validateForm = () => {
  validations.length = signUpPassword.value.length >= 8

  validations.numbers =
    !!signUpPassword.value.match(/[0-9]/) &&
    !!signUpPassword.value.match(/[a-z]/)

  validations.letters =
    signUpPassword.value.toLowerCase() !== signUpPassword.value

  validations.name = signUpName.value.length >= 1

  validations.email = emailElement.value.validity.valid
}

const handleSignUp = () => {
  signUp({
    email: signUpEmail.value,
    password: signUpPassword.value,
    name: signUpName.value
  })

  showConfirmationMessage.value = true
}
</script>

<style lang="scss" scoped>

.confirm-email {
  padding: 20px 10px;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}

.signup-modal {
  width: 400px;
  height: 450px;
  background: white;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .modal__body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 25px;
    height: 100%;

    .body__email-input,
    .body__password-input,
    .body__name-input {
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

    .body__signup-btn {
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

    .body__validation {
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

  .modal__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    border-top: 2px solid $light;

    font-size: 0.8rem;
    color: $dark;

    .signup__link {
      text-decoration: none;
      color: $dark;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
