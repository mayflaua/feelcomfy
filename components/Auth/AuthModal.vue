<template>
  <Teleport to="body">
    <div
      class="auth-modal-wrapper"
      @click.self="$emit('close')"
    >
      <div class="auth-modal">
        <div class="modal__header">
          <p class="header__title">
            {{ currentTab === SignIn ? "Вход" : "Регистрация" }}
          </p>
          <img
            alt="close icon"
            class="header__close-btn dark-invert"
            src="~/assets/icons/close.webp"
            @click="$emit('close-modal')"
          >
        </div>
        <div class="modal__body">
          <component :is="currentTab" @success="$emit('close')" />
        </div>
        <div class="modal__footer">
          <div class="footer__signup">
            <span class="signup__text">{{ currentTab === SignUp ? 'Нет аккаунта? ' : 'Уже есть аккаунт? ' }} </span>
            <a
              class="signup__link"
              @click.prevent="switchAuthMethod"
            >{{ currentTab === SignIn ? 'Зарегистрироваться' : 'Войти' }}</a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import SignIn from '~/components/Auth/SignIn.vue'
import SignUp from '~/components/Auth/SignUp.vue'

defineEmits(['close'])

const currentTab = shallowRef(SignIn)

const switchAuthMethod = (): void => {
  switch (currentTab.value) {
    case SignIn:
      currentTab.value = SignUp
      break
    case SignUp:
      currentTab.value = SignIn
      break
  }
}
</script>

<style lang="scss" scoped>
.auth-modal-wrapper {
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

.auth-modal {
  width: 400px;
  background: white;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

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
