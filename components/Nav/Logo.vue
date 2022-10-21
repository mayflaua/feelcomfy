<template>
  <nuxt-link class="nav__logo" to="/">
    <nuxt-img
      alt="logo"
      class="logo"
      fit="contain"
      format="webp"
      height="40"
      preload
      sizes="md:600px"
      src="images/logo-new.png"
      width="300"
    />
  </nuxt-link>
</template>

<style lang="scss" scoped>
.nav__logo {
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
    height: 70px;
  }

  .logo {
    margin: 0 15px 0 0;
    @media (max-width: 768px) {
      margin: 0 auto 15px auto;
      display: block;
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
}

</style>
