<template>
  <div class="no-user">
    <LazyAuthSignIn v-if="isSignInModalOpened" @close-modal="isSignInModalOpened = false" />
    <img alt="unknown user" class="image" src="~/assets/images/unknown.png">
    <p class="title">
      Вы не авторизованы
    </p>
    <LazyUIButton class="login-btn" text="Войти или зарегистрироваться" @click="isSignInModalOpened = true" />
  </div>
</template>

<script setup>

const isSignInModalOpened = ref(false)

</script>

<style lang="scss" scoped>
.no-user {
  width: min(300px, 80%);
  margin: 0 auto;
  text-align: center;

  .image {
    width: 100%
  }

  .title {
    font-size: 1.3rem;
    font-weight: 500;
  }

  .login-btn {
  }

}
</style>
