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
          type="email"
          class="body__email-input"
          placeholder="Email"
          v-model.lazy="signUpEmail"
          ref="emailElement"
          required
        />
        <input
          type="text"
          class="body__name-input"
          placeholder="Имя"
          v-model.lazy="signUpName"
        />
        <input
          type="password"
          class="body__password-input"
          placeholder="Придумайте пароль"
          v-model="signUpPassword"
        />
        <div class="body__validation">
          <div
            class="validate"
            :class="validations.length && 'validate--valid'"
          >
            Не менее 8 символов
          </div>
          <div
            class="validate"
            :class="validations.numbers && 'validate--valid'"
          >
            Состоит из цифр и латинских букв
          </div>
          <div
            class="validate"
            :class="validations.letters && 'validate--valid'"
          >
            Содержит строчные и заглавные буквы
          </div>
        </div>
        <button
          class="body__signup-btn"
          type="submit"
          :class="!isFormValid && 'body__signup-btn--disabled'"
        >
          Зарегистрироваться
        </button>
      </form>
      <div class="modal__footer">
        <div class="footer__signup">
          <span class="signup__text">Уже есть аккаунт? </span>
          <a class="signup__link" @click.prevent="$emit('has-account')"
            >Войти</a
          >
        </div>
      </div>
    </div>
  </div>
  <div class="confirm-email" v-else>
    Подтвердите регистрацию по ссылке, отправленной на email
  </div>
</template>

<script setup lang="ts">
const { signUp, user } = useAuth();
const { supabase } = useSupabase();

let signUpEmail = ref("");
let signUpPassword = ref("");
let signUpName = ref("");
let emailElement = ref(null);

let showConfirmationMessage = ref(false);

const validations = reactive({
  length: false,
  numbers: false,
  letters: false,

  name: false,
  email: false,
});

let isFormValid = computed(() => Object.values(validations).every(Boolean));

const validateForm = () => {
  validations.length = signUpPassword.value.length >= 8;

  validations.numbers =
    !!signUpPassword.value.match(/[0-9]/) &&
    !!signUpPassword.value.match(/[a-z]/);

  validations.letters =
    signUpPassword.value.toLowerCase() !== signUpPassword.value;

  validations.name = signUpName.value.length >= 1;

  validations.email = emailElement.value.validity.valid;
};

const handleSignUp = () => {
  try {
    signUp({
      email: signUpEmail.value,
      password: signUpPassword.value,
      name: signUpName.value,
    });

    showConfirmationMessage.value = true;
  } catch (err) {
    throw err;
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/style/main.scss";

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
          background: url("~/assets/icons/valid.png") no-repeat center/contain;
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