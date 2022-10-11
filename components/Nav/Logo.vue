<template>
  <nuxt-link class="nav__logo" to="/">
    <ColorScheme>
      <nuxt-img
        :src="logoColorName"
        alt="logo"
        class="logo"
        format="webp"
        preload
      />
    </ColorScheme>
  </nuxt-link>
</template>

<script setup>
const colorMode = useColorMode()

const logoColorName = computed(() => colorMode.preference === 'light' ? 'logo.png' : 'logo-dark.png')

</script>

<style lang="scss" scoped>
.nav__logo {
  width: 300px;
  @media (max-width: 768px) {
    width: 100%;
  }

  .logo {
    height: 40px;
    margin: 0 15px 0 0;

    animation: .4s logo ease;

    @keyframes logo {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      margin: 0 auto 15px auto;
      display: block;
    }
  }
}

</style>
