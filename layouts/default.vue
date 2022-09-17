<template>
  <div class="container">
    <AuthSignIn
      @close-modal="closeAuthModal"
      v-if="isAuthModalOpened"
    />
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
<style lang="scss" scoped>
.container {
  width: 80vw;
  margin: 0 auto;
  overflow: hidden;

  @media (max-width: 1600px) {
    width: 90vw;
  }
  @media (max-width: 1400px) {
    width: 100vw;
  }
  @media (max-width: 768px) {
    font-size: 15px;
  }
}

.content {
  margin: 50px 0 0 0;
}
</style>
