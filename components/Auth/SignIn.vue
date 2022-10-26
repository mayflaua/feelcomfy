<template>
  <div class="auth-signin">
    <input
      v-model="signInForm.email"
      class="auth-signin__email-input"
      placeholder="Email"
      type="email"
      ui-input
    >
    <input
      v-model="signInForm.password"
      class="auth-signin__password-input"
      placeholder="Пароль"
      type="password"
      ui-input
    >
    <UIButton
      :disabled="!canSignIn"
      :loading-state="isLoading"
      class="auth-signin__login-btn"
      text="Войти"
      @click="handleSignIn"
    />
    <button class="auth-signin__forgot-password-btn">
      Забыли пароль?
    </button>
    <p v-if="errMessage" class="auth-error">
      {{ errMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, Ref, ref } from 'vue'
import useAuth from '../../composables/useAuth'

interface SignInForm {
  email: string,
  password: string
}

const emit = defineEmits(['success'])

const errMessage: Ref<string> = ref('')

const isLoading: Ref<boolean> = ref(false)

const signInForm = reactive<SignInForm>({
  email: '',
  password: ''
})

const canSignIn = computed(() => signInForm.email !== '' && signInForm.password !== '')

const { signIn } = useAuth()

const handleSignIn = async (): Promise<void> => {
  isLoading.value = true
  try {
    errMessage.value = ''
    await signIn(signInForm)
    emit('success')
  } catch (err) {
    const errCode = err.status
    switch (errCode) {
      case 400:
        errMessage.value = 'Неверные данные'
        break
      case 422:
        errMessage.value = 'Введите данные'
        break
      default:
        errMessage.value = `Ошибка авторизации (${errCode})`
    }
  }
  isLoading.value = false
}

</script>

<style lang="scss" scoped>
.auth-signin {
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

  &__email-input,
  &__password-input {
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

  &__login-btn {
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

  &__forgot-password-btn {
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
</style>
