<template>
  <div class="signin-wrapper">
    <div class="signin-modal" :class="showLoading && 'signin-modal--blocked'">
      <UILoader v-if="showLoading" class="loading" />
      <div class="modal__header">
        <p class="header__title">{{ isSigningIn ? "Вход" : "Регистрация" }}</p>
        <img
          src="~/assets/icons/close.png"
          class="header__close-btn"
          @click="$emit('close-modal')"
        />
      </div>
      <div class="body-wrapper" v-if="isSigningIn">
        <div class="modal__body">
          <input
            type="email"
            class="body__email-input"
            placeholder="Email"
            v-model.lazy="signInEmail"
          />
          <input
            type="password"
            class="body__password-input"
            placeholder="Пароль"
            v-model.lazy="signInPassword"
          />
          <button class="body__login-btn" @click="handleSignIn">Войти</button>
          <button class="body__forgot-password-btn">Забыли пароль?</button>
          <p class="auth-error" v-if="authError">{{ authError }}</p>
        </div>
        <div class="modal__footer">
          <div class="footer__signup">
            <span class="signup__text">Нет аккаунта? </span>
            <a class="signup__link" @click.prevent="switchAuthMethod"
              >Зарегестрироваться</a
            >
          </div>
        </div>
      </div>
      <AuthSignUp class="body-wrapper" v-else @has-account="switchAuthMethod" />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close-modal"]);

let authError = ref("");

let showLoading = ref(false);

let signInEmail = ref("");
let signInPassword = ref("");

let isSigningIn = ref(true);

const { signIn } = useAuth();
const { supabase: sb } = useSupabase();

const handleSignIn = async () => {
  try {
    showLoading.value = true;
    authError.value = "";
    await signIn({
      email: signInEmail.value,
      password: signInPassword.value,
    }).then(async (user) => {
      await sb.from("carts").insert({
        user_id: user.id,
        cart: null,
      });
      showLoading.value = false;
      emit("close-modal");
    });
  } catch (err) {
    showLoading.value = false;
    err.message.startsWith("You")
      ? (authError.value = "Введите данные")
      : (authError.value = "Неверные данные");
  }
};

const switchAuthMethod = () => {
  isSigningIn.value = !isSigningIn.value;
  authError.value = null;
};
</script>

<style lang="scss" scoped>
.signin-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  left: 0;
  top: 0;
  z-index: 15;

  width: 100vw;
  height: 100vh;
  background-color: rgba(black, 0.4);
}

.signin-modal {
  width: 400px;
  background: white;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &--blocked:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 16;
    cursor: wait;
  }

  .loader {
    position: absolute;
    top: 40%;
    left: 0;
    width: 50px;
    right: 0;
    margin: 0 auto;
    z-index: 17;
  }

  .modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: $light;

    .header__title {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .header__close-btn {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
  .body-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .modal__body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 25px;
    height: 250px;

    .auth-error {
      text-align: center;
      background-color: rgb(233, 108, 108);
      color: white;
      padding: 10px 0;
      border-radius: 7px;
      margin: 15px 0 0 0;
    }

    .body__email-input,
    .body__password-input {
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

    .body__login-btn {
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
    }

    .body__forgot-password-btn {
      border: none;
      outline: none;
      background: transparent;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: $dark;
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
