<template>
  <div class="container">
    <AuthSignIn @close-modal="closeAuthModal" v-if="isAuthModalOpened" />
    <TheNav @open-auth-modal="openAuthModal"></TheNav>
    <main class="content"><slot /></main>
  </div>
</template>
<script setup>
let isAuthModalOpened = ref(false);

const closeAuthModal = () => {
  isAuthModalOpened.value = false;
};

const openAuthModal = () => {
  isAuthModalOpened.value = true;
};
</script>
<style lang="scss">
html {
  @media (max-width: 768px) {
    font-size: 14px;
  }
}
.container {
  width: 80vw;
  margin: 0 auto;
  padding: 0 7px;

  @media (max-width: 1600px) {
    width: 90vw;
  }
  @media (max-width: 1400px) {
    width: 100%;
  }
}

.content {
  margin: 50px 0 0 0;
}
</style>
