<template>
  <div class="container">
    <LazyCartPopup />

    <TheNav />
    <main class="content">
      <slot />
    </main>
  </div>
</template>
<script setup>
const route = useRoute()
useHead({
  link: [
    { rel: 'canonical', href: 'https://feelcomfy.netlify.app' + route.path }
  ]
})
</script>
<style lang="scss">
html {
  @media (max-width: 768px) {
    font-size: 14px;
  }
}

.container {
  width: min(1200px, 80vw);
  margin: 0 auto;
  padding: 0 7px;

  @media (max-width: 1600px) {
    width: min(1200px, 90vw);
  }
  @media (max-width: 1400px) {
    width: min(1200px, 100%);
  }
}

.content {
  margin: 50px 0 0 0;
}
</style>
